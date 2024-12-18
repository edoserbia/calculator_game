from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...src.database import get_db
from ...src.models.score import Score
from ...src.schemas.score import ScoreCreate, Score as ScoreSchema

router = APIRouter()

@router.post("/scores", response_model=ScoreSchema)
def create_score(score: ScoreCreate, db: Session = Depends(get_db)):
    db_score = Score(**score.model_dump())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@router.get("/scores/top", response_model=List[ScoreSchema])
def get_top_scores(game_type: str, limit: int = 10, db: Session = Depends(get_db)):
    scores = db.query(Score)\
        .filter(Score.game_type == game_type)\
        .order_by(Score.score.desc())\
        .limit(limit)\
        .all()
    return scores 