from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from app.db.session import engine
from app.db.base import Base
from app.models.user import User  # noqa - nécessaire pour que SQLAlchemy connaisse le modèle
from app.models.secret import Secret  # noqa - nécessaire pour que SQLAlchemy connaisse le modèle
from app.routers import auth, secrets


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PM API | C-Lilian",
    description="API sécurisée pour gérer vos secrets",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ROUTES
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="PM API | C-Lilian",
        swagger_favicon_url="/static/pm_logo_nobg.png",
    )

app.include_router(auth.router)
app.include_router(secrets.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}