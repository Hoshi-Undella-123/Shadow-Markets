from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.nih_projects import NIHProject
from app.models.nih_projects import NIHProject as NIHProjectModel
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[NIHProject])
def list_nih_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(NIHProjectModel).offset(skip).limit(limit).all()
