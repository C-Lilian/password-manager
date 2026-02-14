from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config_test import test_settings

# URL de connexion PostgreSQL
DATABASE_URL_TEST = (
    f"postgresql://{test_settings.POSTGRES_USER}:"
    f"{test_settings.POSTGRES_PASSWORD}@"
    f"{test_settings.POSTGRES_HOST}:"
    f"{test_settings.POSTGRES_PORT}/"
    f"{test_settings.POSTGRES_DB}"
)

# Création de l'engine SQLAlchemy
engine_test = create_engine(DATABASE_URL_TEST)

# Fabrique de sessions DB
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_test
)


def get_db_test():
    """
    Dépendance FastAPI :
    ouvre une session DB et la ferme automatiquement.
    """
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
