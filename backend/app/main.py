from fastapi import FastAPI

app = FastAPI(title="Password Manager API")

@app.get("/health")
def health_check():
    """
    Endpoint simple pour vérifier
    que l'API démarre correctement.
    """
    return {"status": "ok"}
