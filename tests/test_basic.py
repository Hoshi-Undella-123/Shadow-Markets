import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import get_db, Base
from app.config import settings


# Create in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_read_main():
    """Test the main endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Research Matching Backend API"


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_api_status():
    """Test the API status endpoint"""
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert "api" in data
    assert data["api"] == "running"


def test_research_papers_endpoint():
    """Test the research papers endpoint"""
    response = client.get("/api/v1/research/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_researchers_endpoint():
    """Test the researchers endpoint"""
    response = client.get("/api/v1/researchers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_funders_endpoint():
    """Test the funders endpoint"""
    response = client.get("/api/v1/funders/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_matches_endpoint():
    """Test the matches endpoint"""
    response = client.get("/api/v1/matches/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_research_stats():
    """Test the research statistics endpoint"""
    response = client.get("/api/v1/research/stats/")
    assert response.status_code == 200
    data = response.json()
    assert "total_papers" in data
    assert "total_fields" in data


def test_researcher_stats():
    """Test the researcher statistics endpoint"""
    response = client.get("/api/v1/researchers/stats/")
    assert response.status_code == 200
    data = response.json()
    assert "total_researchers" in data
    assert "verified_researchers" in data


def test_funder_stats():
    """Test the funder statistics endpoint"""
    response = client.get("/api/v1/funders/stats/")
    assert response.status_code == 200
    data = response.json()
    assert "total_funders" in data
    assert "verified_funders" in data


def test_match_stats():
    """Test the match statistics endpoint"""
    response = client.get("/api/v1/matches/stats/")
    assert response.status_code == 200
    data = response.json()
    assert "total_matches" in data
    assert "pending_matches" in data


def test_docs_endpoint():
    """Test that the API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200


def test_redoc_endpoint():
    """Test that the alternative API documentation is accessible"""
    response = client.get("/redoc")
    assert response.status_code == 200 