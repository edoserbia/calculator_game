from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from backend.src.database import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String)
    score = Column(Integer)
    game_type = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 