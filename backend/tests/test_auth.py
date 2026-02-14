def test_register_user(client):
    """Test la création d'un nouvel utilisateur"""
    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_login_user(client):
    """Test le login avec des identifiants corrects"""
    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    """Test le login avec un mauvais mot de passe"""
    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == 401
    assert "detail" in response.json()


def test_login_nonexistent_user(client):
    """Test le login avec un email inexistant"""
    response = client.post(
        "/auth/login",
        data={
            "username": "nonexistent@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 401


def test_register_duplicate_email(client):
    """Test qu'on ne peut pas créer deux comptes avec le même email"""
    # Premier utilisateur
    client.post(
        "/auth/register",
        json={"email": "duplicate@example.com", "password": "password123"}
    )
    
    # Tentative de doublon
    response = client.post(
        "/auth/register",
        json={"email": "duplicate@example.com", "password": "password456"}
    )
    
    assert response.status_code == 400
    assert "email" in response.json()["detail"].lower()


def test_get_current_user(client):
    """Test la récupération des infos utilisateur avec un token valide"""
    # Créer un utilisateur
    register_response = client.post(
        "/auth/register",
        json={"email": "currentuser@example.com", "password": "password123"}
    )
    
    # Se connecter pour obtenir le token
    login_response = client.post(
        "/auth/login",
        data={"username": "currentuser@example.com", "password": "password123"}
    )
    
    token = login_response.json()["access_token"]
    
    # Récupérer les infos utilisateur
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "currentuser@example.com"


def test_get_current_user_without_token(client):
    """Test que /auth/me échoue sans token"""
    response = client.get("/auth/me")
    
    assert response.status_code == 401  # Forbidden (pas de token)