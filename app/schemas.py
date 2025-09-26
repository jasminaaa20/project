from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class EmojiStoryBase(BaseModel):
    emoji_sequence: List[str] = Field(
        ..., min_length=1, max_length=50, description="Array of emoji characters"
    )
    author_nickname: str = Field(
        ..., min_length=1, max_length=50, description="Author's nickname"
    )


class EmojiStoryCreate(EmojiStoryBase):
    pass


class EmojiStoryUpdate(BaseModel):
    emoji_sequence: Optional[List[str]] = Field(None, min_length=1, max_length=50)
    author_nickname: Optional[str] = Field(None, min_length=1, max_length=50)


class EmojiStoryResponse(EmojiStoryBase):
    id: str
    translation: str
    likes: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TranslationBase(BaseModel):
    translation: str = Field(
        ..., min_length=1, max_length=500, description="Translation text"
    )


class TranslationCreate(TranslationBase):
    story_id: str = Field(..., description="Story ID this translation belongs to")


class TranslationResponse(TranslationBase):
    id: int
    story_id: str
    votes: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TranslationRule(BaseModel):
    pattern: List[str]
    templates: List[str]


class LikeStoryRequest(BaseModel):
    pass


class VoteTranslationRequest(BaseModel):
    vote_type: str = Field(
        ..., pattern="^(up|down)$", description="Vote type: 'up' or 'down'"
    )
