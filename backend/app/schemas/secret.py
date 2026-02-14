from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class SecretBase(BaseModel):
    title: str
    username: str
    url: Optional[str] = None


class SecretCreate(SecretBase):
    password: str


class SecretUpdate(BaseModel):
    title: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    url: Optional[str] = None


class SecretList(SecretBase):
    id: UUID
    title: str
    created_at: datetime
    
    class ConfigDict:
        from_attributes = True


class SecretRead(SecretBase):
    id: UUID
    password: str
    created_at: datetime
    updated_at: datetime
    
    class ConfigDict:
        from_attributes = True