from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_user():
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


def test_login_user():
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"


def test_login_wrong_password():
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401
