
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.schemas.nih_projects import NIHProject
from app.models.nih_projects import NIHProject as NIHProjectModel
from app.database import get_db
from typing import List, Optional, Dict, Any


router = APIRouter()


@router.get("/nih-projects/", response_model=Dict[str, Any])
def list_nih_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    needs_funding: Optional[bool] = None,
    country: Optional[str] = None,
    region: Optional[str] = None,
    project_type: Optional[str] = None,
    sectors: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Base query
    query = db.query(NIHProjectModel)
    # Optionally filter for projects that need funding (award_amount is None or 0)
    if needs_funding:
        query = query.filter((NIHProjectModel.award_amount == None) | (NIHProjectModel.award_amount == 0))
    if country:
        query = query.filter(NIHProjectModel.country == country)
    if region:
        query = query.filter(NIHProjectModel.region == region)
    if project_type:
        query = query.filter(NIHProjectModel.project_type == project_type)
    if sectors:
        # Allow comma-separated sector search (any match)
        sector_list = [s.strip().lower() for s in sectors.split(",")]
        query = query.filter(
            func.lower(NIHProjectModel.sectors).op('~')('|'.join(sector_list))
        )
    # Remove duplicates by project_num
    query = query.distinct(NIHProjectModel.project_num)
    total = query.count()
    projects = query.offset(skip).limit(limit).all()
    return {"total": total, "results": projects}
