from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.src.database import get_db
from backend.src.models.secret import Secret
from backend.src.schemas.secret import SecretCreate, Secret as SecretSchema, SecretVerify, SecretUpdate

router = APIRouter()

@router.post("/verify-secret", response_model=dict)
def verify_secret(secret: SecretVerify, db: Session = Depends(get_db)):
    db_secret = db.query(Secret).filter(
        Secret.code == secret.code,
        Secret.active == True
    ).first()
    
    if not db_secret:
        return {"valid": False, "game_type": None}
    return {"valid": True, "game_type": db_secret.game_type}

@router.get("/secrets", response_model=List[SecretSchema])
def get_secrets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    secrets = db.query(Secret).offset(skip).limit(limit).all()
    return secrets

@router.post("/secrets", response_model=SecretSchema)
def create_secret(secret: SecretCreate, db: Session = Depends(get_db)):
    db_secret = Secret(**secret.model_dump())
    db.add(db_secret)
    db.commit()
    db.refresh(db_secret)
    return db_secret

@router.put("/secrets/{secret_id}", response_model=SecretSchema)
def update_secret(secret_id: int, secret: SecretUpdate, db: Session = Depends(get_db)):
    db_secret = db.query(Secret).filter(Secret.id == secret_id).first()
    if not db_secret:
        raise HTTPException(status_code=404, detail="Secret not found")
    
    for field, value in secret.model_dump(exclude_unset=True).items():
        setattr(db_secret, field, value)
    
    db.commit()
    db.refresh(db_secret)
    return db_secret

@router.delete("/secrets/{secret_id}")
def delete_secret(secret_id: int, db: Session = Depends(get_db)):
    db_secret = db.query(Secret).filter(Secret.id == secret_id).first()
    if not db_secret:
        raise HTTPException(status_code=404, detail="Secret not found")
    
    db.delete(db_secret)
    db.commit()
    return {"message": "Secret deleted successfully"} 