from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.database import get_db
from app.models.funders import Funder
from app.schemas.funders import FunderCreate, FunderLogin, Token, TokenData
from app.config import settings

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def authenticate_funder(db: Session, email: str, password: str):
    """Authenticate a funder with email and password"""
    funder = db.query(Funder).filter(Funder.email == email).first()
    if not funder:
        return False
    if not verify_password(password, funder.hashed_password):
        return False
    return funder


def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_current_funder(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get the current authenticated funder"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    funder = db.query(Funder).filter(Funder.email == token_data.email).first()
    if funder is None:
        raise credentials_exception
    
    return funder


@router.post("/register", response_model=Token)
async def register_funder(funder: FunderCreate, db: Session = Depends(get_db)):
    """Register a new funder"""
    # Check if funder already exists
    existing_funder = db.query(Funder).filter(Funder.email == funder.email).first()
    if existing_funder:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new funder
    hashed_password = get_password_hash(funder.password)
    db_funder = Funder(
        email=funder.email,
        hashed_password=hashed_password,
        name=funder.name,
        funder_type=funder.funder_type,
        organization=funder.organization,
        website=funder.website,
        phone=funder.phone,
        address=funder.address,
        country=funder.country,
        city=funder.city,
        support_types=funder.support_types,
        funding_range_min=funder.funding_range_min,
        funding_range_max=funder.funding_range_max,
        currency=funder.currency,
        research_interests=funder.research_interests,
        geographic_focus=funder.geographic_focus,
        career_stage_focus=funder.career_stage_focus
    )
    
    db.add(db_funder)
    db.commit()
    db.refresh(db_funder)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": funder.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/login", response_model=Token)
async def login_funder(funder_credentials: FunderLogin, db: Session = Depends(get_db)):
    """Login a funder and return access token"""
    funder = authenticate_funder(db, funder_credentials.email, funder_credentials.password)
    if not funder:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    funder.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": funder.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.get("/me")
async def get_current_funder_info(current_funder: Funder = Depends(get_current_funder)):
    """Get current funder information"""
    return current_funder


@router.post("/logout")
async def logout_funder(current_funder: Funder = Depends(get_current_funder)):
    """Logout funder (client should discard token)"""
    return {"message": "Successfully logged out"} 