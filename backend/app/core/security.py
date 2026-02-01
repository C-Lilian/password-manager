from passlib.context import CryptContext

# Configuration du moteur de hash
# bcrypt est lent volontairement → protection contre brute force
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """
    Prend un mot de passe en clair
    et retourne un hash sécurisé.
    """
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un mot de passe correspond à son hash.
    """
    return pwd_context.verify(password, hashed_password)
