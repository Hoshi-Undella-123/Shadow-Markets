from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.funders import Funder, FunderProfile
from app.schemas.funders import (
    FunderCreate, FunderUpdate, FunderResponse,
    FunderProfileCreate, FunderProfileUpdate, FunderProfileResponse,
    FunderFilter, PasswordChange
)
from app.api.v1.auth import get_current_funder

router = APIRouter()


@router.get("/", response_model=List[FunderResponse])
async def get_funders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    name: Optional[str] = None,
    funder_type: Optional[str] = None,
    organization: Optional[str] = None,
    country: Optional[str] = None,
    is_verified: Optional[bool] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get funders with filtering"""
    query = db.query(Funder)
    
    # Apply filters
    if name:
        query = query.filter(Funder.name.ilike(f"%{name}%"))
    if funder_type:
        query = query.filter(Funder.funder_type == funder_type)
    if organization:
        query = query.filter(Funder.organization.ilike(f"%{organization}%"))
    if country:
        query = query.filter(Funder.country.ilike(f"%{country}%"))
    if is_verified is not None:
        query = query.filter(Funder.is_verified == is_verified)
    if is_active is not None:
        query = query.filter(Funder.is_active == is_active)
    
    # Order by creation date (newest first)
    query = query.order_by(Funder.created_at.desc())
    
    funders = query.offset(skip).limit(limit).all()
    return funders


@router.get("/{funder_id}", response_model=FunderResponse)
async def get_funder(funder_id: int, db: Session = Depends(get_db)):
    """Get a specific funder by ID"""
    funder = db.query(Funder).filter(Funder.id == funder_id).first()
    if not funder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funder not found"
        )
    return funder


@router.post("/", response_model=FunderResponse)
async def create_funder(funder: FunderCreate, db: Session = Depends(get_db)):
    """Create a new funder"""
    # Check for duplicates
    existing_funder = db.query(Funder).filter(Funder.email == funder.email).first()
    if existing_funder:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Funder with this email already exists"
        )
    
    db_funder = Funder(**funder.dict())
    db.add(db_funder)
    db.commit()
    db.refresh(db_funder)
    return db_funder


@router.put("/{funder_id}", response_model=FunderResponse)
async def update_funder(
    funder_id: int,
    funder_update: FunderUpdate,
    db: Session = Depends(get_db)
):
    """Update a funder"""
    db_funder = db.query(Funder).filter(Funder.id == funder_id).first()
    if not db_funder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funder not found"
        )
    
    # Update only provided fields
    update_data = funder_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_funder, field, value)
    
    db_funder.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_funder)
    return db_funder


@router.delete("/{funder_id}")
async def delete_funder(funder_id: int, db: Session = Depends(get_db)):
    """Delete a funder"""
    db_funder = db.query(Funder).filter(Funder.id == funder_id).first()
    if not db_funder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funder not found"
        )
    
    db.delete(db_funder)
    db.commit()
    return {"message": "Funder deleted successfully"}


# Funder Profile endpoints
@router.get("/{funder_id}/profile", response_model=FunderProfileResponse)
async def get_funder_profile(funder_id: int, db: Session = Depends(get_db)):
    """Get a funder's detailed profile"""
    profile = db.query(FunderProfile).filter(FunderProfile.funder_id == funder_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funder profile not found"
        )
    return profile


@router.post("/{funder_id}/profile", response_model=FunderProfileResponse)
async def create_funder_profile(
    funder_id: int,
    profile: FunderProfileCreate,
    db: Session = Depends(get_db)
):
    """Create a funder profile"""
    # Check if funder exists
    funder = db.query(Funder).filter(Funder.id == funder_id).first()
    if not funder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funder not found"
        )
    
    # Check if profile already exists
    existing_profile = db.query(FunderProfile).filter(FunderProfile.funder_id == funder_id).first()
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Funder profile already exists"
        )
    
    db_profile = FunderProfile(funder_id=funder_id, **profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@router.put("/{funder_id}/profile", response_model=FunderProfileResponse)
async def update_funder_profile(
    funder_id: int,
    profile_update: FunderProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update a funder profile"""
    db_profile = db.query(FunderProfile).filter(FunderProfile.funder_id == funder_id).first()
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funder profile not found"
        )
    
    # Update only provided fields
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_profile, field, value)
    
    db_profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_profile)
    return db_profile


# Authenticated endpoints
@router.get("/profile/me", response_model=FunderResponse)
async def get_my_profile(current_funder: Funder = Depends(get_current_funder)):
    """Get current funder's profile"""
    return current_funder


@router.put("/profile/me", response_model=FunderResponse)
async def update_my_profile(
    funder_update: FunderUpdate,
    current_funder: Funder = Depends(get_current_funder),
    db: Session = Depends(get_db)
):
    """Update current funder's profile"""
    # Update only provided fields
    update_data = funder_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_funder, field, value)
    
    current_funder.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_funder)
    return current_funder


@router.get("/profile/me/detailed", response_model=FunderProfileResponse)
async def get_my_detailed_profile(
    current_funder: Funder = Depends(get_current_funder),
    db: Session = Depends(get_db)
):
    """Get current funder's detailed profile"""
    profile = db.query(FunderProfile).filter(FunderProfile.funder_id == current_funder.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detailed profile not found. Please create one first."
        )
    return profile


@router.put("/profile/me/detailed", response_model=FunderProfileResponse)
async def update_my_detailed_profile(
    profile_update: FunderProfileUpdate,
    current_funder: Funder = Depends(get_current_funder),
    db: Session = Depends(get_db)
):
    """Update current funder's detailed profile"""
    profile = db.query(FunderProfile).filter(FunderProfile.funder_id == current_funder.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detailed profile not found. Please create one first."
        )
    
    # Update only provided fields
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/stats/")
async def get_funder_stats(db: Session = Depends(get_db)):
    """Get funder statistics"""
    total_funders = db.query(Funder).count()
    verified_funders = db.query(Funder).filter(Funder.is_verified == True).count()
    active_funders = db.query(Funder).filter(Funder.is_active == True).count()
    
    # Funder type distribution
    funder_types = db.query(Funder.funder_type, db.func.count(Funder.id)).group_by(Funder.funder_type).all()
    
    return {
        "total_funders": total_funders,
        "verified_funders": verified_funders,
        "active_funders": active_funders,
        "funder_type_distribution": dict(funder_types)
    } 