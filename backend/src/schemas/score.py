from pydantic import BaseModel
from datetime import datetime

class ScoreBase(BaseModel):
    player_name: str
    score: int
    game_type: str

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 