# 🔐 Password Manager

A full-stack password manager built with FastAPI, React, PostgreSQL and Docker.

## 🚀 Tech Stack

### Backend
- FastAPI
- Python 3.11
- PostgreSQL
- SQLAlchemy (planned)
- JWT Authentication (planned)
- AES Encryption (planned)

### Frontend
- React + TypeScript
- React Query
- Axios
- Material UI

### Infrastructure
- Docker & Docker Compose
- Git & GitHub
- Pytest & React Testing Library (planned)

---

## 🐳 Run locally with Docker

```bash
docker compose up --build
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
```

## 🔐 Security

Passwords will never be stored in plaintext.
They will be encrypted using a master key derived from the user's password.

---

## 📝 Auteur

Développé avec passion par [C-Lilian](https://lilian-cleret.com) 🥋.