from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token
from app.core.config import settings
from app.dependencies.auth import get_current_user

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
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authentifie un utilisateur via OAuth2 password flow.

    - vérifie que l'email existe
    - compare le mot de passe hashé
    """

    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Vérification du mot de passe
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Création du token JWT
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserRead)
def read_current_user(current_user=Depends(get_current_user)):
    """
    Retourne les informations de l'utilisateur connecté
    """
    return current_user