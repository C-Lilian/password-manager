# 🔐 Password Manager – Full Stack Application

Secure password manager built with **FastAPI, React, PostgreSQL and Docker**.
The application allows users to securely store, encrypt and manage their credentials.

---

## 🚀 Features

* User authentication (JWT)
* Protected routes (frontend)
* Password encryption (AES via `cryptography`)
* Secure password hashing (`bcrypt`)
* Secrets management (CRUD)
* Pagination & search
* REST API
* Dockerized full-stack environment

---

## 🧰 Tech Stack

### 🖥 Backend

* **FastAPI**
* **Python 3.11**
* **PostgreSQL**
* **SQLAlchemy**
* **Pydantic & Pydantic Settings**
* **JWT Authentication** (`python-jose`)
* **Password hashing** (`bcrypt`)
* **AES Encryption** (`cryptography`)
* **Uvicorn**
* **python-dotenv**
* **email-validator**
* **python-multipart**

### 🎨 Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **React Router v7**
* **React Query v5**
* **Axios**
* **Material UI v7**
* **Material UI Icons**
* **Emotion (MUI styling)**

### 🧪 Testing

* **Pytest**
* **pytest-asyncio**
* **httpx**

### 🐳 Infrastructure

* **Docker**
* **Docker Compose**
* **PostgreSQL**
* **Git & GitHub**
* **ESLint**

---

## 🔐 Security Architecture

* Passwords are **never stored in plaintext**
* User passwords are hashed using **bcrypt**
* Secrets are encrypted using **AES (cryptography)**
* JWT tokens are used for authentication
* Token expiration configurable via environment variables

---

## 📦 Project Structure

```
password-manager/
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── Dockerfile
│   ├── pyproject.toml
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

Example `.env` configuration:

```
POSTGRES_DB=password_manager
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

BACKEND_SECRET_KEY=dev-secret-key-change-me
ACCESS_TOKEN_EXPIRE_MINUTES=30

SECRET_ENCRYPTION_KEY=encryption-key-change-me
```

⚠️ In production, always use strong and unique secret keys.

---

## ▶️ Run Locally with Docker

### Prerequisites

* Docker
* Docker Compose

### Start the project

```bash
docker compose up --build
```

### Access

* Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
* Frontend: [http://localhost:3000](http://localhost:3000)
* PostgreSQL: localhost:5432

---

## 🔌 API Overview

### Authentication

* `POST /auth/register` Register
* `POST /auth/login` Login
* `GET /auth/me` Read Current User

### Secrets

* `GET /secrets` List Secrets
* `GET /secrets/{id}` Get Secret
* `POST /secrets` Create User
* `PATCH /secrets/{id}` Update Secret
* `DELETE /secrets/{id}` Delete Secret

---

## 🧪 Tests

Backend tests are executed using:

```bash
pytest
```

---

## 📝 Author

Developed with passion by [C-Lilian](https://lilian-cleret.com) 🥋

Project built as part of a full-stack security-focused learning initiative.
