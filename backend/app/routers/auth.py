from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.core.security import hash_password, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED
)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Crée un nouvel utilisateur.

    - vérifie que l'email n'existe pas déjà
    - hash le mot de passe
    - stocke l'utilisateur en base
    """

    # Vérifie si l'utilisateur existe déjà
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash du mot de passe avant stockage
    hashed_password = hash_password(user_data.password)

    # Création de l'utilisateur
    user = User(
        email=user_data.email,
        password_hash=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login")
def login(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Authentifie un utilisateur.

    - vérifie que l'email existe
    - compare le mot de passe hashé
    """

    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Vérification du mot de passe
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return {"message": "Login successful"}
