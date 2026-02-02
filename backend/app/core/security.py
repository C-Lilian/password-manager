import bcrypt

def hash_password(password: str) -> str:
    """
    Prend un mot de passe en clair
    et retourne un hash sécurisé.
    """
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un mot de passe correspond à son hash.
    """
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))