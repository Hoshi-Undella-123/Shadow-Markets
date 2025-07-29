from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/research_matching"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    OPENAI_API_KEY: Optional[str] = None
    ARXIV_EMAIL: Optional[str] = None
    SEMANTIC_SCHOLAR_API_KEY: Optional[str] = None
    
    # Redis/Celery
    REDIS_URL: str = "redis://localhost:6379"
    
    # Application
    APP_NAME: str = "Research Matching Backend"
    DEBUG: bool = False
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]
    
    # Data Ingestion
    INGESTION_BATCH_SIZE: int = 100
    INGESTION_INTERVAL_HOURS: int = 24
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings() 