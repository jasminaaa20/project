import json
import uuid

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import EmojiStory, Translation
from app.schemas import EmojiStoryCreate, EmojiStoryResponse
from app.translation_service import TranslationService

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Emoji Story Translator")

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")
translation_service = TranslationService()


def convert_db_story_to_response(db_story: EmojiStory) -> EmojiStoryResponse:
    emoji_sequence = (
        json.loads(db_story.emoji_sequence) if db_story.emoji_sequence else []  # type: ignore
    )
    return EmojiStoryResponse(
        id=db_story.id,  # type: ignore
        emoji_sequence=emoji_sequence,
        translation=db_story.translation,  # type: ignore
        author_nickname=db_story.author_nickname,  # type: ignore
        likes=db_story.likes,  # type: ignore
        created_at=db_story.created_at,  # type: ignore
        updated_at=db_story.updated_at,  # type: ignore
    )


@app.get("/", response_class=HTMLResponse)
async def read_root(request):
    return templates.TemplateResponse(request, "index.html")


@app.get("/api/stories", response_model=list[EmojiStoryResponse])
def get_stories(
    skip: int = 0, limit: int = 20, popular: bool = False, db: Session = Depends(get_db)
):
    query = db.query(EmojiStory).all()
    if popular:
        query = db.query(EmojiStory).order_by(EmojiStory.likes.desc())
    else:
        query = db.query(EmojiStory).order_by(EmojiStory.created_at.desc())

    stories = query.offset(skip).limit(limit).all()
    return [convert_db_story_to_response(story) for story in stories]


@app.get("/api/stories/{story_id}", response_model=EmojiStoryResponse)
def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(EmojiStory).filter(EmojiStory.id == story_id).first()
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return convert_db_story_to_response(story)


@app.post("/api/stories", response_model=EmojiStoryResponse)
def create_story(story: EmojiStoryCreate, db: Session = Depends(get_db)):
    translation = translation_service.translate(story.emoji_sequence)

    db_story = EmojiStory(
        id=(uuid.uuid4()),
        emoji_sequence=story.emoji_sequence,
        translation=translation,
        author_nickname=story.author_nickname,
        likes=0,
    )

    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return convert_db_story_to_response(db_story)


@app.put("/api/stories/{story_id}", response_model=EmojiStoryResponse)
def update_story(
    story_id: int, story_update: EmojiStoryResponse, db: Session = Depends(get_db)
):
    story = db.query(EmojiStory).filter(EmojiStory.id == story_id).first()
    if story is None:
        return HTTPException(status_code=404, detail="Story not found")

    if story_update.emoji_sequence is not None:
        story.emoji_sequence = json.dumps(story_update.emoji_sequence)  # type: ignore
        story.translation = translation_service.translate(story_update.emoji_sequence)  # type: ignore

    if story_update.author_nickname is not None:
        story.author_nickname = story_update.author_nickname  # type: ignore

    db.commit()
    db.refresh(story)
    return convert_db_story_to_response(story)


@app.delete("/api/stories/{story_id}")
def delete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(EmojiStory).filter(EmojiStory.id == story_id).first()
    if story is None:
        return HTTPException(status_code=404, detail="Story not found")

    # Also delete associated translations
    db.query(Translation).filter(Translation.story_id == story_id).delete()

    db.delete(story)
    db.commit()
    return {"detail": "Story deleted successfully"}


@app.post("/api/stories/{story_id}/like")
def like_story(story_id: str, db: Session = Depends(get_db)):
    """Like an emoji story"""
    story = db.query(EmojiStory).filter(EmojiStory.id == story_id).first()
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")

    # Increment the like count atomically
    db.query(EmojiStory).filter(EmojiStory.id == story_id).update(
        {EmojiStory.likes: EmojiStory.likes + 1}
    )
    db.commit()
    db.refresh(story)

    return convert_db_story_to_response(story)


@app.post("/api/translate-preview")
def preview_translation(emoji_sequence: list[str]):
    """Get a preview translation without saving the story"""
    if not emoji_sequence:
        raise HTTPException(status_code=400, detail="Emoji sequence cannot be empty")

    if not translation_service.validate_emoji_sequence(emoji_sequence):
        raise HTTPException(status_code=400, detail="Invalid emoji sequence")

    translation = translation_service.translate(emoji_sequence)
    themes = translation_service.get_story_themes(emoji_sequence)

    return {
        "translation": translation,
        "themes": themes,
        "emoji_count": len(emoji_sequence),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
