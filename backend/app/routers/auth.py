from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
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
    
    - Vérifie que l'email n'existe pas déjà
    - Hash le mot de passe avec bcrypt
    - Stocke l'utilisateur en base
    
    Raises:
        400: Email déjà enregistré
        500: Erreur serveur
    """
    try:
        # Vérifie si l'utilisateur existe déjà
        existing_user = (
            db.query(User)
            .filter(User.email == user_data.email)
            .first()
        )
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Problème lors de la création du compte lié à l'email"
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
    
    except HTTPException:
        # Re-raise les HTTPException (400)
        raise
    
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Database error in register: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du compte"
        )
    
    except Exception as e:
        db.rollback()
        print(f"Unexpected error in register: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur inattendue est survenue"
        )


@router.post("/login", status_code=status.HTTP_200_OK)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authentifie un utilisateur via OAuth2 password flow.
    
    - Vérifie que l'email existe
    - Compare le mot de passe hashé
    - Génère un JWT token
    
    Returns:
        access_token: JWT token valide pour ACCESS_TOKEN_EXPIRE_MINUTES
        token_type: "bearer"
    
    Raises:
        401: Identifiants invalides
        500: Erreur serveur
    """
    try:
        # Recherche l'utilisateur (username = email dans OAuth2)
        user = (
            db.query(User)
            .filter(User.email == form_data.username)
            .first()
        )
        
        # Même message d'erreur si user inexistant OU mot de passe incorrect
        if not user or not verify_password(form_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect",
                headers={"WWW-Authenticate": "Bearer"},
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
    
    except HTTPException:
        raise
    
    except SQLAlchemyError as e:
        print(f"Database error in login: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la connexion"
        )
    
    except Exception as e:
        print(f"Unexpected error in login: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur inattendue est survenue"
        )


@router.get("/me", response_model=UserRead, status_code=status.HTTP_200_OK)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Retourne les informations de l'utilisateur connecté.
    
    Requiert un token JWT valide dans le header Authorization.
    
    Raises:
        401: Token invalide ou expiré
    """
    # Pas besoin de try/except ici, get_current_user gère déjà les erreurs
    return current_user