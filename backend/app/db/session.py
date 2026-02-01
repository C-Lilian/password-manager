from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# URL de connexion PostgreSQL
DATABASE_URL = (
    f"postgresql://{settings.POSTGRES_USER}:"
    f"{settings.POSTGRES_PASSWORD}@"
    f"{settings.POSTGRES_HOST}:"
    f"{settings.POSTGRES_PORT}/"
    f"{settings.POSTGRES_DB}"
)

# Création de l'engine SQLAlchemy
engine = create_engine(DATABASE_URL)

# Fabrique de sessions DB
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    """
    Dépendance FastAPI :
    ouvre une session DB et la ferme automatiquement.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
