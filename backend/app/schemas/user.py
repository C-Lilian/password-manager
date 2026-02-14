from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """
    Données attendues lors de la création d'un utilisateur.
    """
    email: EmailStr
    password: str


class UserRead(BaseModel):
    """
    Données exposées publiquement.
    Jamais de password_hash ici.
    """
    id: UUID
    email: EmailStr
    created_at: datetime

    class ConfigDict:
        from_attributes = True # Permet à Pydantic de lire les objets ORM (SQLAlchemy)