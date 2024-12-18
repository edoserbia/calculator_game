from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SecretBase(BaseModel):
    code: str
    game_type: str
    active: bool = True

class SecretCreate(SecretBase):
    pass

class SecretUpdate(SecretBase):
    code: Optional[str] = None
    game_type: Optional[str] = None
    active: Optional[bool] = None

class Secret(SecretBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SecretVerify(BaseModel):
    code: str 