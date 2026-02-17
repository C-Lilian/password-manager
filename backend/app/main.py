from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.db.base import Base
from app.models.user import User  # noqa - nécessaire pour que SQLAlchemy connaisse le modèle
from app.models.secret import Secret  # noqa - nécessaire pour que SQLAlchemy connaisse le modèle
from app.routers import auth, secrets


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Password Manager API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(secrets.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}