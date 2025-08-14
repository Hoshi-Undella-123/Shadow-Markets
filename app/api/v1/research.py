from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.research import ResearchPaper, ResearchField
from app.schemas.research import (
    ResearchPaperCreate, ResearchPaperUpdate, ResearchPaperResponse,
    ResearchFieldCreate, ResearchFieldResponse, ResearchFilter,
    IngestionRequest, IngestionResponse
)
from app.services.ingestion import ingest_research_data


router = APIRouter()

# Health check endpoint
@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/", response_model=List[ResearchPaperResponse])
async def get_research_papers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    title: Optional[str] = None,
    authors: Optional[str] = None,
    journal: Optional[str] = None,
    min_citation_count: Optional[int] = None,
    max_citation_count: Optional[int] = None,
    min_impact_score: Optional[float] = None,
    max_impact_score: Optional[float] = None,
    min_barrier_score: Optional[float] = None,
    max_barrier_score: Optional[float] = None,
    is_processed: Optional[bool] = None,
    is_scored: Optional[bool] = None,
    is_flagged_for_review: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get research papers with filtering"""
    query = db.query(ResearchPaper)
    
    # Apply filters
    if title:
        query = query.filter(ResearchPaper.title.ilike(f"%{title}%"))
    if authors:
        query = query.filter(ResearchPaper.authors.ilike(f"%{authors}%"))
    if journal:
        query = query.filter(ResearchPaper.journal.ilike(f"%{journal}%"))
    if min_citation_count is not None:
        query = query.filter(ResearchPaper.citation_count >= min_citation_count)
    if max_citation_count is not None:
        query = query.filter(ResearchPaper.citation_count <= max_citation_count)
    if min_impact_score is not None:
        query = query.filter(ResearchPaper.impact_score >= min_impact_score)
    if max_impact_score is not None:
        query = query.filter(ResearchPaper.impact_score <= max_impact_score)
    if min_barrier_score is not None:
        query = query.filter(ResearchPaper.barrier_score >= min_barrier_score)
    if max_barrier_score is not None:
        query = query.filter(ResearchPaper.barrier_score <= max_barrier_score)
    if is_processed is not None:
        query = query.filter(ResearchPaper.is_processed == is_processed)
    if is_scored is not None:
        query = query.filter(ResearchPaper.is_scored == is_scored)
    if is_flagged_for_review is not None:
        query = query.filter(ResearchPaper.is_flagged_for_review == is_flagged_for_review)
    
    # Order by creation date (newest first)
    query = query.order_by(ResearchPaper.created_at.desc())
    
    # Apply pagination
    papers = query.offset(skip).limit(limit).all()
    return papers


@router.get("/{paper_id}", response_model=ResearchPaperResponse)
async def get_research_paper(paper_id: int, db: Session = Depends(get_db)):
    """Get a specific research paper by ID"""
    paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research paper not found"
        )
    return paper


@router.post("/", response_model=ResearchPaperResponse)
async def create_research_paper(paper: ResearchPaperCreate, db: Session = Depends(get_db)):
    """Create a new research paper"""
    # Check for duplicates
    if paper.doi:
        existing_paper = db.query(ResearchPaper).filter(ResearchPaper.doi == paper.doi).first()
        if existing_paper:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Paper with this DOI already exists"
            )
    
    if paper.arxiv_id:
        existing_paper = db.query(ResearchPaper).filter(ResearchPaper.arxiv_id == paper.arxiv_id).first()
        if existing_paper:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Paper with this arXiv ID already exists"
            )
    
    db_paper = ResearchPaper(**paper.dict())
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper


@router.put("/{paper_id}", response_model=ResearchPaperResponse)
async def update_research_paper(
    paper_id: int,
    paper_update: ResearchPaperUpdate,
    db: Session = Depends(get_db)
):
    """Update a research paper"""
    db_paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not db_paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research paper not found"
        )
    
    # Update only provided fields
    update_data = paper_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_paper, field, value)
    
    db_paper.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_paper)
    return db_paper


@router.delete("/{paper_id}")
async def delete_research_paper(paper_id: int, db: Session = Depends(get_db)):
    """Delete a research paper"""
    db_paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not db_paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research paper not found"
        )
    
    db.delete(db_paper)
    db.commit()
    return {"message": "Research paper deleted successfully"}


@router.post("/ingest", response_model=IngestionResponse)
async def ingest_research(request: IngestionRequest, db: Session = Depends(get_db)):
    """Trigger research data ingestion from external sources"""
    try:
        start_time = datetime.utcnow()
        result = await ingest_research_data(db, request)
        end_time = datetime.utcnow()
        processing_time = (end_time - start_time).total_seconds()
        
        return IngestionResponse(
            success=True,
            papers_ingested=result.get("papers_ingested", 0),
            papers_updated=result.get("papers_updated", 0),
            errors=result.get("errors", []),
            processing_time=processing_time
        )
    except Exception as e:
        return IngestionResponse(
            success=False,
            papers_ingested=0,
            papers_updated=0,
            errors=[str(e)],
            processing_time=0.0
        )


# Research Fields endpoints
@router.get("/fields/", response_model=List[ResearchFieldResponse])
async def get_research_fields(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get research fields with filtering"""
    query = db.query(ResearchField)
    
    if name:
        query = query.filter(ResearchField.name.ilike(f"%{name}%"))
    
    fields = query.offset(skip).limit(limit).all()
    return fields


@router.get("/fields/{field_id}", response_model=ResearchFieldResponse)
async def get_research_field(field_id: int, db: Session = Depends(get_db)):
    """Get a specific research field by ID"""
    field = db.query(ResearchField).filter(ResearchField.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research field not found"
        )
    return field


@router.post("/fields/", response_model=ResearchFieldResponse)
async def create_research_field(field: ResearchFieldCreate, db: Session = Depends(get_db)):
    """Create a new research field"""
    # Check for duplicates
    existing_field = db.query(ResearchField).filter(ResearchField.name == field.name).first()
    if existing_field:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Research field with this name already exists"
        )
    
    db_field = ResearchField(**field.dict())
    db.add(db_field)
    db.commit()
    db.refresh(db_field)
    return db_field


@router.get("/stats/")
async def get_research_stats(db: Session = Depends(get_db)):
    """Get research statistics"""
    total_papers = db.query(ResearchPaper).count()
    processed_papers = db.query(ResearchPaper).filter(ResearchPaper.is_processed == True).count()
    scored_papers = db.query(ResearchPaper).filter(ResearchPaper.is_scored == True).count()
    flagged_papers = db.query(ResearchPaper).filter(ResearchPaper.is_flagged_for_review == True).count()
    total_fields = db.query(ResearchField).count()
    
    # Average scores
    avg_impact = db.query(ResearchPaper.impact_score).filter(ResearchPaper.is_scored == True).scalar()
    avg_barrier = db.query(ResearchPaper.barrier_score).filter(ResearchPaper.is_scored == True).scalar()
    
    return {
        "total_papers": total_papers,
        "processed_papers": processed_papers,
        "scored_papers": scored_papers,
        "flagged_papers": flagged_papers,
        "total_fields": total_fields,
        "average_impact_score": float(avg_impact) if avg_impact else 0.0,
        "average_barrier_score": float(avg_barrier) if avg_barrier else 0.0
    } 