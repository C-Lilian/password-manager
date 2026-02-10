from cryptography.fernet import Fernet
from app.core.config import settings


# La clé est chargée depuis les variables d'environnement
fernet = Fernet(settings.SECRET_ENCRYPTION_KEY)


def encrypt_secret(plain_text: str) -> str:
    """
    Chiffre une chaîne de caractères (mot de passe, secret, etc.)

    - entrée : texte en clair
    - sortie : texte chiffré (base64)
    """
    return fernet.encrypt(plain_text.encode()).decode()


def decrypt_secret(encrypted_text: str) -> str:
    """
    Déchiffre une chaîne chiffrée.

    """
    return fernet.decrypt(encrypted_text.encode()).decode()
