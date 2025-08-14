from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class PaperStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    PREPRINT = "preprint"
    RETRACTED = "retracted"


class DataSource(str, Enum):
    ARXIV = "arxiv"
    SEMANTIC_SCHOLAR = "semantic_scholar"
    PUBMED = "pubmed"
    CROSSREF = "crossref"
    DOAJ = "doaj"
    MANUAL = "manual"


# Research Paper Schemas
class ResearchPaperBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    abstract: Optional[str] = None
    authors: Optional[str] = None  # JSON string of author names
    doi: Optional[str] = None
    arxiv_id: Optional[str] = None
    semantic_scholar_id: Optional[str] = None
    journal: Optional[str] = None
    publication_date: Optional[datetime] = None
    status: PaperStatus = PaperStatus.PREPRINT
    data_source: DataSource = DataSource.ARXIV


class ResearchPaperCreate(ResearchPaperBase):
    pass


class ResearchPaperUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    abstract: Optional[str] = None
    authors: Optional[str] = None
    doi: Optional[str] = None
    arxiv_id: Optional[str] = None
    semantic_scholar_id: Optional[str] = None
    journal: Optional[str] = None
    publication_date: Optional[datetime] = None
    status: Optional[PaperStatus] = None
    data_source: Optional[DataSource] = None
    citation_count: Optional[int] = None
    impact_score: Optional[float] = None
    novelty_score: Optional[float] = None
    societal_impact_score: Optional[float] = None
    funding_limitations: Optional[str] = None
    infrastructure_needs: Optional[str] = None
    collaboration_needs: Optional[str] = None
    barrier_score: Optional[float] = None
    is_processed: Optional[bool] = None
    is_scored: Optional[bool] = None
    is_flagged_for_review: Optional[bool] = None


class ResearchPaperResponse(ResearchPaperBase):
    id: int
    citation_count: int = 0
    impact_score: float = 0.0
    novelty_score: float = 0.0
    societal_impact_score: float = 0.0
    funding_limitations: Optional[str] = None
    infrastructure_needs: Optional[str] = None
    collaboration_needs: Optional[str] = None
    barrier_score: float = 0.0
    is_processed: bool = False
    is_scored: bool = False
    is_flagged_for_review: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_ingested: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Research Field Schemas
class ResearchFieldBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    parent_field_id: Optional[int] = None


class ResearchFieldCreate(ResearchFieldBase):
    pass


class ResearchFieldUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    parent_field_id: Optional[int] = None


class ResearchFieldResponse(ResearchFieldBase):
    id: int
    parent_field_id: Optional[int] = None
    
    class Config:
        from_attributes = True


# Filter Schemas
class ResearchFilter(BaseModel):
    title: Optional[str] = None
    authors: Optional[str] = None
    journal: Optional[str] = None
    status: Optional[PaperStatus] = None
    data_source: Optional[DataSource] = None
    min_citation_count: Optional[int] = None
    max_citation_count: Optional[int] = None
    min_impact_score: Optional[float] = None
    max_impact_score: Optional[float] = None
    min_barrier_score: Optional[float] = None
    max_barrier_score: Optional[float] = None
    is_processed: Optional[bool] = None
    is_scored: Optional[bool] = None
    is_flagged_for_review: Optional[bool] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    limit: int = 50
    offset: int = 0


# Ingestion Schemas
class IngestionRequest(BaseModel):
    source: DataSource
    query: Optional[str] = None
    max_results: int = 100
    force_refresh: bool = False


class IngestionResponse(BaseModel):
    success: bool
    papers_ingested: int
    papers_updated: int
    errors: List[str] = []
    processing_time: float 