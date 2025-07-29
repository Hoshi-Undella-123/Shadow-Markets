import json
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from datetime import datetime, timedelta

from app.models.funders import Funder
from app.models.researchers import Researcher
from app.models.matches import Match
from app.models.research import ResearchPaper


async def generate_recommendations(
    db: Session,
    funder_id: int,
    match_type: Optional[str] = None,
    min_impact_score: Optional[float] = None,
    max_impact_score: Optional[float] = None,
    min_barrier_score: Optional[float] = None,
    max_barrier_score: Optional[float] = None,
    priority: Optional[str] = None,
    limit: int = 10,
    offset: int = 0
) -> Dict:
    """
    Generate personalized recommendations for a funder
    """
    try:
        # Get funder details
        funder = db.query(Funder).filter(Funder.id == funder_id).first()
        if not funder:
            return {"matches": [], "total_count": 0, "has_more": False}
        
        # Build base query for researchers
        query = db.query(Researcher).filter(Researcher.status == "active")
        
        # Apply filters
        if min_impact_score is not None:
            query = query.filter(Researcher.impact_score >= min_impact_score)
        if max_impact_score is not None:
            query = query.filter(Researcher.impact_score <= max_impact_score)
        if min_barrier_score is not None:
            query = query.filter(Researcher.barrier_score >= min_barrier_score)
        if max_barrier_score is not None:
            query = query.filter(Researcher.barrier_score <= max_barrier_score)
        
        # Get total count
        total_count = query.count()
        
        # Get researchers
        researchers = query.offset(offset).limit(limit).all()
        
        # Generate matches
        matches = []
        for researcher in researchers:
            match_score = await _calculate_match_score(funder, researcher, match_type)
            
            if match_score["overall_score"] > 0.3:  # Minimum threshold
                match = Match(
                    funder_id=funder_id,
                    researcher_id=researcher.id,
                    match_type=match_type or "funding",
                    priority=priority or "medium",
                    impact_score=match_score["impact_score"],
                    barrier_score=match_score["barrier_score"],
                    compatibility_score=match_score["compatibility_score"],
                    overall_score=match_score["overall_score"],
                    match_reasoning=json.dumps(match_score["reasoning"]),
                    barrier_analysis=json.dumps(match_score["barrier_analysis"]),
                    solution_proposal=json.dumps(match_score["solution_proposal"]),
                    expires_at=datetime.utcnow() + timedelta(days=30)
                )
                matches.append(match)
        
        # Sort by overall score
        matches.sort(key=lambda x: x.overall_score, reverse=True)
        
        return {
            "matches": matches,
            "total_count": total_count,
            "has_more": (offset + limit) < total_count
        }
        
    except Exception as e:
        raise Exception(f"Error generating recommendations: {str(e)}")


async def _calculate_match_score(
    funder: Funder,
    researcher: Researcher,
    match_type: Optional[str] = None
) -> Dict:
    """
    Calculate match score between funder and researcher
    """
    score = {
        "impact_score": 0.0,
        "barrier_score": 0.0,
        "compatibility_score": 0.0,
        "overall_score": 0.0,
        "reasoning": [],
        "barrier_analysis": [],
        "solution_proposal": []
    }
    
    # Impact Score (based on researcher's impact)
    impact_score = researcher.impact_score / 10.0  # Normalize to 0-1
    score["impact_score"] = min(impact_score, 1.0)
    score["reasoning"].append(f"Researcher impact score: {researcher.impact_score}")
    
    # Barrier Score (based on researcher's barriers)
    barrier_score = researcher.barrier_score / 10.0  # Normalize to 0-1
    score["barrier_score"] = min(barrier_score, 1.0)
    score["reasoning"].append(f"Researcher barrier score: {researcher.barrier_score}")
    
    # Analyze barriers
    if researcher.current_funding_needs:
        score["barrier_analysis"].append("Funding needs identified")
        score["solution_proposal"].append("Direct funding support")
    
    if researcher.infrastructure_needs:
        score["barrier_analysis"].append("Infrastructure needs identified")
        score["solution_proposal"].append("Infrastructure support")
    
    if researcher.collaboration_needs:
        score["barrier_analysis"].append("Collaboration needs identified")
        score["solution_proposal"].append("Network connections")
    
    if researcher.mentorship_needs:
        score["barrier_analysis"].append("Mentorship needs identified")
        score["solution_proposal"].append("Expert guidance")
    
    # Compatibility Score (based on alignment)
    compatibility_factors = []
    
    # Research field alignment
    funder_interests = json.loads(funder.research_interests) if funder.research_interests else []
    researcher_interests = json.loads(researcher.research_interests) if researcher.research_interests else []
    
    if funder_interests and researcher_interests:
        common_interests = set(funder_interests) & set(researcher_interests)
        if common_interests:
            compatibility_factors.append(f"Shared research interests: {', '.join(common_interests)}")
    
    # Geographic alignment
    if funder.country and researcher.country and funder.country == researcher.country:
        compatibility_factors.append("Geographic alignment")
    
    # Career stage alignment
    funder_career_focus = json.loads(funder.career_stage_focus) if funder.career_stage_focus else []
    if funder_career_focus and researcher.career_stage in funder_career_focus:
        compatibility_factors.append("Career stage alignment")
    
    # Support type alignment
    funder_support_types = json.loads(funder.support_types) if funder.support_types else []
    if funder_support_types:
        if match_type in funder_support_types:
            compatibility_factors.append("Support type alignment")
    
    # Calculate compatibility score
    compatibility_score = len(compatibility_factors) / 5.0  # Normalize to 0-1
    score["compatibility_score"] = min(compatibility_score, 1.0)
    score["reasoning"].extend(compatibility_factors)
    
    # Overall Score (weighted combination)
    weights = {
        "impact": 0.4,
        "barrier": 0.3,
        "compatibility": 0.3
    }
    
    overall_score = (
        score["impact_score"] * weights["impact"] +
        score["barrier_score"] * weights["barrier"] +
        score["compatibility_score"] * weights["compatibility"]
    )
    
    score["overall_score"] = overall_score
    
    return score


async def create_match(
    db: Session,
    funder_id: int,
    researcher_id: int,
    match_type: str = "funding",
    priority: str = "medium"
) -> Match:
    """
    Create a new match between funder and researcher
    """
    try:
        # Check if match already exists
        existing_match = db.query(Match).filter(
            and_(
                Match.funder_id == funder_id,
                Match.researcher_id == researcher_id,
                Match.match_type == match_type
            )
        ).first()
        
        if existing_match:
            raise Exception("Match already exists")
        
        # Get funder and researcher
        funder = db.query(Funder).filter(Funder.id == funder_id).first()
        researcher = db.query(Researcher).filter(Researcher.id == researcher_id).first()
        
        if not funder or not researcher:
            raise Exception("Funder or researcher not found")
        
        # Calculate match score
        match_score = await _calculate_match_score(funder, researcher, match_type)
        
        # Create match
        match = Match(
            funder_id=funder_id,
            researcher_id=researcher_id,
            match_type=match_type,
            priority=priority,
            impact_score=match_score["impact_score"],
            barrier_score=match_score["barrier_score"],
            compatibility_score=match_score["compatibility_score"],
            overall_score=match_score["overall_score"],
            match_reasoning=json.dumps(match_score["reasoning"]),
            barrier_analysis=json.dumps(match_score["barrier_analysis"]),
            solution_proposal=json.dumps(match_score["solution_proposal"]),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        
        db.add(match)
        db.commit()
        db.refresh(match)
        
        return match
        
    except Exception as e:
        raise Exception(f"Error creating match: {str(e)}")


async def update_match_scores(db: Session) -> Dict:
    """
    Update match scores for existing matches
    """
    result = {
        "matches_updated": 0,
        "errors": []
    }
    
    try:
        # Get all active matches
        matches = db.query(Match).filter(Match.status == "pending").all()
        
        for match in matches:
            try:
                # Get funder and researcher
                funder = db.query(Funder).filter(Funder.id == match.funder_id).first()
                researcher = db.query(Researcher).filter(Researcher.id == match.researcher_id).first()
                
                if not funder or not researcher:
                    continue
                
                # Recalculate scores
                match_score = await _calculate_match_score(funder, researcher, match.match_type)
                
                # Update match
                match.impact_score = match_score["impact_score"]
                match.barrier_score = match_score["barrier_score"]
                match.compatibility_score = match_score["compatibility_score"]
                match.overall_score = match_score["overall_score"]
                match.match_reasoning = json.dumps(match_score["reasoning"])
                match.barrier_analysis = json.dumps(match_score["barrier_analysis"])
                match.solution_proposal = json.dumps(match_score["solution_proposal"])
                match.updated_at = datetime.utcnow()
                
                result["matches_updated"] += 1
                
            except Exception as e:
                result["errors"].append(f"Error updating match {match.id}: {str(e)}")
        
        db.commit()
        
    except Exception as e:
        result["errors"].append(f"Error in batch score update: {str(e)}")
    
    return result


async def expire_old_matches(db: Session) -> Dict:
    """
    Expire matches that are past their expiration date
    """
    result = {
        "matches_expired": 0,
        "errors": []
    }
    
    try:
        # Find expired matches
        expired_matches = db.query(Match).filter(
            and_(
                Match.status == "pending",
                Match.expires_at < datetime.utcnow()
            )
        ).all()
        
        for match in expired_matches:
            try:
                match.status = "expired"
                match.updated_at = datetime.utcnow()
                result["matches_expired"] += 1
                
            except Exception as e:
                result["errors"].append(f"Error expiring match {match.id}: {str(e)}")
        
        db.commit()
        
    except Exception as e:
        result["errors"].append(f"Error in batch expiration: {str(e)}")
    
    return result 