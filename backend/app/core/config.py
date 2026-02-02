from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Cette classe charge automatiquement les variables
    d'environnement depuis le système ou un fichier .env.
    
    """

    # Clé secrète utilisée pour signer les JWT
    SECRET_KEY: str

    # Algorithme de signature JWT
    ALGORITHM: str = "HS256"

    # Durée de vie du token (en minutes)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Configuration base de données
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int

    class Config:
      # Indique à Pydantic de lire le fichier
      env_file = ".env"

# Instance globale utilisée partout dans le backend
settings = Settings()