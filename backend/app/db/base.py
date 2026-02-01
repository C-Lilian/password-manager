from sqlalchemy.orm import declarative_base

# Classe de base pour tous les modèles
Base = declarative_base()

# IMPORTANT :
# Tous les modèles doivent être importés ici
# pour qu'Alembic puisse les détecter plus tard
from app.models.user import User  # noqa
