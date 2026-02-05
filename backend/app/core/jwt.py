from datetime import datetime, timedelta
from typing import Optional
from jose import jwt

from app.core.config import settings

# Fonction pour générer un token JWT
def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Crée un JWT contenant les informations de l'utilisateur.
    data : dictionnaire, typiquement {"sub": email}
    expires_delta : durée de vie du token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(tz=None) + expires_delta
    else:
        expire = datetime.now(tz=None) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


# Fonction pour décoder et vérifier le JWT
def verify_access_token(token: str) -> dict:
    """
    Vérifie le token JWT et renvoie le contenu.
    Lève une exception si le token est invalide ou expiré.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except jwt.JWTError:
        raise ValueError("Invalid token")
