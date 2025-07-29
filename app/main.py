from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn

from app.config import settings
from app.database import engine, get_db
from app.models import Base
from app.api.v1 import research, researchers, funders, matches, auth

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="A system that identifies high-impact but under-supported research projects and matches researchers with funders, collaborators, and advisors.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(research.router, prefix="/api/v1/research", tags=["Research"])
app.include_router(researchers.router, prefix="/api/v1/researchers", tags=["Researchers"])
app.include_router(funders.router, prefix="/api/v1/funders", tags=["Funders"])
app.include_router(matches.router, prefix="/api/v1/matches", tags=["Matches"])


@app.get("/")
async def root():
    """Root endpoint with basic API information"""
    return {
        "message": "Research Matching Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.APP_NAME}


@app.get("/api/v1/status")
async def api_status(db: Session = Depends(get_db)):
    """API status with database connectivity check"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "api": "running",
        "database": db_status,
        "version": "1.0.0"
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    ) 