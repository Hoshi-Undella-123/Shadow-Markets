from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.matches import Match, MatchRequest, MatchResponse as MatchResponseModel
from app.models.funders import Funder
from app.models.researchers import Researcher
from app.schemas.matches import (
    MatchCreate, MatchUpdate, MatchResponse, MatchRequestCreate, MatchRequestResponse,
    MatchResponseCreate, MatchResponseResponse, RecommendationRequest, RecommendationResponse,
    MatchFilter
)
from app.api.v1.auth import get_current_funder
from app.services.matching import generate_recommendations, create_match

router = APIRouter()


@router.get("/", response_model=List[MatchResponse])
async def get_matches(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    funder_id: Optional[int] = None,
    researcher_id: Optional[int] = None,
    match_type: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    min_impact_score: Optional[float] = None,
    max_impact_score: Optional[float] = None,
    min_barrier_score: Optional[float] = None,
    max_barrier_score: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Get matches with filtering"""
    query = db.query(Match)
    
    # Apply filters
    if funder_id:
        query = query.filter(Match.funder_id == funder_id)
    if researcher_id:
        query = query.filter(Match.researcher_id == researcher_id)
    if match_type:
        query = query.filter(Match.match_type == match_type)
    if priority:
        query = query.filter(Match.priority == priority)
    if status:
        query = query.filter(Match.status == status)
    if min_impact_score is not None:
        query = query.filter(Match.impact_score >= min_impact_score)
    if max_impact_score is not None:
        query = query.filter(Match.impact_score <= max_impact_score)
    if min_barrier_score is not None:
        query = query.filter(Match.barrier_score >= min_barrier_score)
    if max_barrier_score is not None:
        query = query.filter(Match.barrier_score <= max_barrier_score)
    
    # Order by overall score (highest first)
    query = query.order_by(Match.overall_score.desc())
    
    matches = query.offset(skip).limit(limit).all()
    return matches


@router.get("/{match_id}", response_model=MatchResponse)
async def get_match(match_id: int, db: Session = Depends(get_db)):
    """Get a specific match by ID"""
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    return match


@router.post("/", response_model=MatchResponse)
async def create_new_match(match: MatchCreate, db: Session = Depends(get_db)):
    """Create a new match"""
    # Check if funder exists
    funder = db.query(Funder).filter(Funder.id == match.funder_id).first()
    if not funder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funder not found"
        )
    
    # Check if researcher exists
    researcher = db.query(Researcher).filter(Researcher.id == match.researcher_id).first()
    if not researcher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Researcher not found"
        )
    
    # Check if match already exists
    existing_match = db.query(Match).filter(
        Match.funder_id == match.funder_id,
        Match.researcher_id == match.researcher_id,
        Match.match_type == match.match_type
    ).first()
    
    if existing_match:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Match already exists"
        )
    
    # Create match with expiration date
    db_match = Match(
        **match.dict(),
        expires_at=datetime.utcnow() + timedelta(days=30)  # 30 days expiration
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match


@router.put("/{match_id}", response_model=MatchResponse)
async def update_match(
    match_id: int,
    match_update: MatchUpdate,
    db: Session = Depends(get_db)
):
    """Update a match"""
    db_match = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    # Update only provided fields
    update_data = match_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_match, field, value)
    
    db_match.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_match)
    return db_match


@router.delete("/{match_id}")
async def delete_match(match_id: int, db: Session = Depends(get_db)):
    """Delete a match"""
    db_match = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    db.delete(db_match)
    db.commit()
    return {"message": "Match deleted successfully"}


# Recommendations
@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    current_funder: Funder = Depends(get_current_funder),
    db: Session = Depends(get_db)
):
    """Get personalized recommendations for the current funder"""
    try:
        recommendations = await generate_recommendations(
            db, 
            funder_id=current_funder.id,
            match_type=request.match_type,
            min_impact_score=request.min_impact_score,
            max_impact_score=request.max_impact_score,
            min_barrier_score=request.min_barrier_score,
            max_barrier_score=request.max_barrier_score,
            priority=request.priority,
            limit=request.limit,
            offset=request.offset
        )
        
        return RecommendationResponse(
            matches=recommendations["matches"],
            total_count=recommendations["total_count"],
            has_more=recommendations["has_more"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating recommendations: {str(e)}"
        )


# Match Requests
@router.post("/{match_id}/requests", response_model=MatchRequestResponse)
async def create_match_request(
    match_id: int,
    request: MatchRequestCreate,
    current_funder: Funder = Depends(get_current_funder),
    db: Session = Depends(get_db)
):
    """Create a match request"""
    # Check if match exists
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    # Verify the requester is part of the match
    if request.requester_type == "funder" and request.requester_id != match.funder_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create requests for your own matches"
        )
    
    db_request = MatchRequest(
        match_id=match_id,
        requester_id=request.requester_id,
        requester_type=request.requester_type,
        request_type=request.request_type,
        subject=request.subject,
        message=request.message
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@router.get("/{match_id}/requests", response_model=List[MatchRequestResponse])
async def get_match_requests(
    match_id: int,
    db: Session = Depends(get_db)
):
    """Get all requests for a match"""
    requests = db.query(MatchRequest).filter(MatchRequest.match_id == match_id).all()
    return requests


# Match Responses
@router.post("/{match_id}/responses", response_model=MatchResponseResponse)
async def create_match_response(
    match_id: int,
    response: MatchResponseCreate,
    db: Session = Depends(get_db)
):
    """Create a match response"""
    # Check if match exists
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    # Check if request exists
    request = db.query(MatchRequest).filter(MatchRequest.id == response.request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    db_response = MatchResponseModel(
        match_id=match_id,
        request_id=response.request_id,
        responder_id=response.responder_id,
        responder_type=response.responder_type,
        response_type=response.response_type,
        subject=response.subject,
        message=response.message,
        proposed_amount=response.proposed_amount,
        proposed_timeline=response.proposed_timeline,
        conditions=response.conditions
    )
    db.add(db_response)
    
    # Update request as responded
    request.is_responded = True
    
    # Update match status based on response type
    if response.response_type == "accept":
        match.status = "accepted"
    elif response.response_type == "reject":
        match.status = "rejected"
    
    match.responded_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_response)
    return db_response


@router.get("/{match_id}/responses", response_model=List[MatchResponseResponse])
async def get_match_responses(
    match_id: int,
    db: Session = Depends(get_db)
):
    """Get all responses for a match"""
    responses = db.query(MatchResponseModel).filter(MatchResponseModel.match_id == match_id).all()
    return responses


@router.get("/stats/")
async def get_match_stats(db: Session = Depends(get_db)):
    """Get match statistics"""
    total_matches = db.query(Match).count()
    pending_matches = db.query(Match).filter(Match.status == "pending").count()
    accepted_matches = db.query(Match).filter(Match.status == "accepted").count()
    rejected_matches = db.query(Match).filter(Match.status == "rejected").count()
    expired_matches = db.query(Match).filter(Match.status == "expired").count()
    
    # Match type distribution
    match_types = db.query(Match.match_type, db.func.count(Match.id)).group_by(Match.match_type).all()
    
    # Priority distribution
    priorities = db.query(Match.priority, db.func.count(Match.id)).group_by(Match.priority).all()
    
    return {
        "total_matches": total_matches,
        "pending_matches": pending_matches,
        "accepted_matches": accepted_matches,
        "rejected_matches": rejected_matches,
        "expired_matches": expired_matches,
        "match_type_distribution": dict(match_types),
        "priority_distribution": dict(priorities)
    } 