from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from uuid import UUID
from typing import List, Optional

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.core.crypto import decrypt_secret, encrypt_secret
from app.models.user import User
from app.models.secret import Secret
from app.schemas.secret import SecretCreate, SecretRead, SecretList, SecretUpdate


router = APIRouter(
    prefix="/secrets",
    tags=["secrets"]
)

@router.post("/", response_model=SecretRead, status_code=status.HTTP_201_CREATED)
def create_secret(
    secret_data: SecretCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Crée un nouveau secret pour l'utilisateur connecté.
    
    Le mot de passe est automatiquement chiffré avant stockage.
    """
    try:
        secret = Secret(
            title=secret_data.title,
            username=secret_data.username,
            password=encrypt_secret(secret_data.password),
            url=secret_data.url,
            user_id=current_user.id
        )

        db.add(secret)
        db.commit()
        db.refresh(secret)

        return secret
    
    except SQLAlchemyError as e:
        db.rollback()  # Important : rollback en cas d'erreur
        print(f"Database error in create_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du secret"
        )
    
    except Exception as e:
        db.rollback()
        print(f"Unexpected error in create_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur inattendue est survenue"
        )


@router.get("/", response_model=List[SecretList], status_code=status.HTTP_200_OK)
def list_secrets(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère tous les secrets de l'utilisateur connecté.
    
    Args:
        skip: Nombre de résultats à sauter (pagination)
        limit: Nombre max de résultats (max 100)
        search: Recherche dans title/username (optionnel)
    
    Returns:
        Liste des secrets (sans les mots de passe déchiffrés)
    """
    
    # Validation du limit
    if limit > 100:
        limit = 100
    if limit < 1:
        limit = 1
    if skip < 0:
        skip = 0
    
    try:
        query = db.query(Secret).filter(Secret.user_id == current_user.id)
        
        # Filtre de recherche (si fourni)
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (Secret.title.ilike(search_pattern)) | 
                (Secret.username.ilike(search_pattern))
            )
        
        secrets = (
            query
            .order_by(Secret.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        return secrets
    
    except SQLAlchemyError as e:
        print(f"Database error in list_secrets: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des secrets"
        )
    
    except Exception as e:
        print(f"Unexpected error in list_secrets: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur inattendue est survenue"
        )


@router.get("/{secret_id}", response_model=SecretRead, status_code=status.HTTP_200_OK)
def get_secret(
    secret_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère un secret spécifique avec son mot de passe déchiffré.
    
    Le secret doit appartenir à l'utilisateur connecté.
    
    Raises:
        404: Secret non trouvé ou n'appartient pas à l'utilisateur
    """
    
    try:
        secret = db.query(Secret).filter(
            Secret.id == secret_id,
            Secret.user_id == current_user.id
        ).first()
        
        # Vérification explicite si le secret existe
        if not secret:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Secret non trouvé"
            )
        
        # Déchiffre le mot de passe avant de retourner
        try:
            decrypted_password = decrypt_secret(secret.password)
        except Exception as decrypt_error:
            print(f"Decryption error: {str(decrypt_error)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors du déchiffrement du mot de passe"
            )
        
        # Construction manuelle pour inclure le mot de passe déchiffré
        return {
            "id": secret.id,
            "title": secret.title,
            "username": secret.username,
            "password": decrypted_password,
            "url": secret.url,
            "created_at": secret.created_at,
            "updated_at": secret.updated_at
        }
    
    except HTTPException:
        # Re-raise les HTTPException (404, 500 de déchiffrement)
        raise
    
    except SQLAlchemyError as e:
        print(f"Database error in get_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération du secret"
        )
    
    except Exception as e:
        print(f"Unexpected error in get_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur inattendue est survenue"
        )


@router.patch("/{secret_id}", response_model=SecretRead, status_code=status.HTTP_200_OK)
def update_secret(
    secret_id: UUID,
    secret_data: SecretUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Met à jour un secret existant.
    
    Si le mot de passe est fourni, il sera re-chiffré.
    """
    try:
        secret = db.query(Secret).filter(
            Secret.id == secret_id,
            Secret.user_id == current_user.id
        ).first()
        
        if not secret:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Secret non trouvé"
            )
        
        # Met à jour les champs
        if secret_data.title is not None:
          secret.title = secret_data.title
        if secret_data.username is not None:
          secret.username = secret_data.username
        if secret_data.password is not None:
          secret.password = encrypt_secret(secret_data.password)
        if secret_data.url is not None:
          secret.url = secret_data.url
        
        if not any([
          secret_data.title,
          secret_data.username,
          secret_data.password,
          secret_data.url
        ]):
          raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aucun champ à mettre à jour"
          )
        
        db.commit()
        db.refresh(secret)
        
        return secret
    
    except HTTPException:
        raise
    
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Database error in update_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la mise à jour du secret"
        )
    
    except Exception as e:
        db.rollback()
        print(f"Unexpected error in update_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur inattendue est survenue"
        )


@router.delete("/{secret_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_secret(
    secret_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Supprime un secret de manière permanente.
    
    Raises:
        404: Secret non trouvé
    """
    try:
        secret = db.query(Secret).filter(
            Secret.id == secret_id,
            Secret.user_id == current_user.id
        ).first()
        
        if not secret:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Secret non trouvé"
            )
        
        db.delete(secret)
        db.commit()
        
        # 204 No Content ne retourne rien
        return None
    
    except HTTPException:
        raise
    
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Database error in delete_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la suppression du secret"
        )
    
    except Exception as e:
        db.rollback()
        print(f"Unexpected error in delete_secret: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur inattendue est survenue"
        )