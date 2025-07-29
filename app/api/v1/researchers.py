from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.researchers import Researcher, ResearcherProfile
from app.schemas.researchers import (
    ResearcherCreate, ResearcherUpdate, ResearcherResponse,
    ResearcherProfileCreate, ResearcherProfileUpdate, ResearcherProfileResponse,
    ResearcherFilter
)

router = APIRouter()


@router.get("/", response_model=List[ResearcherResponse])
async def get_researchers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    name: Optional[str] = None,
    email: Optional[str] = None,
    institution: Optional[str] = None,
    country: Optional[str] = None,
    career_stage: Optional[str] = None,
    min_impact_score: Optional[float] = None,
    max_impact_score: Optional[float] = None,
    min_barrier_score: Optional[float] = None,
    max_barrier_score: Optional[float] = None,
    is_verified: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get researchers with filtering"""
    query = db.query(Researcher)
    
    # Apply filters
    if name:
        query = query.filter(Researcher.name.ilike(f"%{name}%"))
    if email:
        query = query.filter(Researcher.email.ilike(f"%{email}%"))
    if institution:
        query = query.filter(Researcher.institution.ilike(f"%{institution}%"))
    if country:
        query = query.filter(Researcher.country.ilike(f"%{country}%"))
    if career_stage:
        query = query.filter(Researcher.career_stage == career_stage)
    if min_impact_score is not None:
        query = query.filter(Researcher.impact_score >= min_impact_score)
    if max_impact_score is not None:
        query = query.filter(Researcher.impact_score <= max_impact_score)
    if min_barrier_score is not None:
        query = query.filter(Researcher.barrier_score >= min_barrier_score)
    if max_barrier_score is not None:
        query = query.filter(Researcher.barrier_score <= max_barrier_score)
    if is_verified is not None:
        query = query.filter(Researcher.is_verified == is_verified)
    
    # Order by impact score (highest first)
    query = query.order_by(Researcher.impact_score.desc())
    
    researchers = query.offset(skip).limit(limit).all()
    return researchers


@router.get("/{researcher_id}", response_model=ResearcherResponse)
async def get_researcher(researcher_id: int, db: Session = Depends(get_db)):
    """Get a specific researcher by ID"""
    researcher = db.query(Researcher).filter(Researcher.id == researcher_id).first()
    if not researcher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Researcher not found"
        )
    return researcher


@router.post("/", response_model=ResearcherResponse)
async def create_researcher(researcher: ResearcherCreate, db: Session = Depends(get_db)):
    """Create a new researcher"""
    # Check for duplicates
    existing_researcher = db.query(Researcher).filter(Researcher.email == researcher.email).first()
    if existing_researcher:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Researcher with this email already exists"
        )
    
    db_researcher = Researcher(**researcher.dict())
    db.add(db_researcher)
    db.commit()
    db.refresh(db_researcher)
    return db_researcher


@router.put("/{researcher_id}", response_model=ResearcherResponse)
async def update_researcher(
    researcher_id: int,
    researcher_update: ResearcherUpdate,
    db: Session = Depends(get_db)
):
    """Update a researcher"""
    db_researcher = db.query(Researcher).filter(Researcher.id == researcher_id).first()
    if not db_researcher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Researcher not found"
        )
    
    # Update only provided fields
    update_data = researcher_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_researcher, field, value)
    
    db_researcher.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_researcher)
    return db_researcher


@router.delete("/{researcher_id}")
async def delete_researcher(researcher_id: int, db: Session = Depends(get_db)):
    """Delete a researcher"""
    db_researcher = db.query(Researcher).filter(Researcher.id == researcher_id).first()
    if not db_researcher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Researcher not found"
        )
    
    db.delete(db_researcher)
    db.commit()
    return {"message": "Researcher deleted successfully"}


# Researcher Profile endpoints
@router.get("/{researcher_id}/profile", response_model=ResearcherProfileResponse)
async def get_researcher_profile(researcher_id: int, db: Session = Depends(get_db)):
    """Get a researcher's detailed profile"""
    profile = db.query(ResearcherProfile).filter(ResearcherProfile.researcher_id == researcher_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Researcher profile not found"
        )
    return profile


@router.post("/{researcher_id}/profile", response_model=ResearcherProfileResponse)
async def create_researcher_profile(
    researcher_id: int,
    profile: ResearcherProfileCreate,
    db: Session = Depends(get_db)
):
    """Create a researcher profile"""
    # Check if researcher exists
    researcher = db.query(Researcher).filter(Researcher.id == researcher_id).first()
    if not researcher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Researcher not found"
        )
    
    # Check if profile already exists
    existing_profile = db.query(ResearcherProfile).filter(ResearcherProfile.researcher_id == researcher_id).first()
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Researcher profile already exists"
        )
    
    db_profile = ResearcherProfile(researcher_id=researcher_id, **profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@router.put("/{researcher_id}/profile", response_model=ResearcherProfileResponse)
async def update_researcher_profile(
    researcher_id: int,
    profile_update: ResearcherProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update a researcher profile"""
    db_profile = db.query(ResearcherProfile).filter(ResearcherProfile.researcher_id == researcher_id).first()
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Researcher profile not found"
        )
    
    # Update only provided fields
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_profile, field, value)
    
    db_profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_profile)
    return db_profile


@router.get("/stats/")
async def get_researcher_stats(db: Session = Depends(get_db)):
    """Get researcher statistics"""
    total_researchers = db.query(Researcher).count()
    verified_researchers = db.query(Researcher).filter(Researcher.is_verified == True).count()
    active_researchers = db.query(Researcher).filter(Researcher.status == "active").count()
    
    # Career stage distribution
    career_stages = db.query(Researcher.career_stage, db.func.count(Researcher.id)).group_by(Researcher.career_stage).all()
    
    # Average scores
    avg_impact = db.query(Researcher.impact_score).scalar()
    avg_barrier = db.query(Researcher.barrier_score).scalar()
    
    return {
        "total_researchers": total_researchers,
        "verified_researchers": verified_researchers,
        "active_researchers": active_researchers,
        "career_stage_distribution": dict(career_stages),
        "average_impact_score": float(avg_impact) if avg_impact else 0.0,
        "average_barrier_score": float(avg_barrier) if avg_barrier else 0.0
    } 