import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class User(Base):
    """
    Modèle utilisateur.
    Aucun mot de passe en clair n'est stocké.
    """

    __tablename__ = "users"

    # UUID → propre, non prédictible
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # Email unique pour l'authentification
    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    # Hash du mot de passe (bcrypt)
    password_hash = Column(
        String,
        nullable=False
    )

    # Date de création du compte
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
