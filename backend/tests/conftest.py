import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.session import get_db
from app.db.session_test import get_db_test, engine_test
from app.db.base import Base


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture()
def client():
    app.dependency_overrides[get_db] = get_db_test

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()
