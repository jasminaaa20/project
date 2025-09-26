from app.database import Base
from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func


class EmojiStory(Base):
    __tablename__ = "emoji_stories"

    id = Column(String, primary_key=True, index=True)
    emoji_sequence = Column(Text, nullable=False)
    translation = Column(Text, nullable=False)
    author_nickname = Column(String, nullable=False)
    likes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<EmojiStory(id='{self.id}', author='{self.author_nickname}')>"


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, nullable=False)
    translation = Column(Text, nullable=False)
    votes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False)

    def __repr__(self):
        return f"<Translation(id={self.id}, story_id='{self.story_id}')>"
