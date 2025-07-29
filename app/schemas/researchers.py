from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ResearcherStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    VERIFIED = "verified"
    PENDING = "pending"


class CareerStage(str, Enum):
    STUDENT = "student"
    POSTDOC = "postdoc"
    ASSISTANT_PROFESSOR = "assistant_professor"
    ASSOCIATE_PROFESSOR = "associate_professor"
    PROFESSOR = "professor"
    RESEARCH_SCIENTIST = "research_scientist"
    INDUSTRY = "industry"
    OTHER = "other"


# Researcher Schemas
class ResearcherBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    orcid: Optional[str] = None
    affiliation: Optional[str] = None
    department: Optional[str] = None
    institution: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    career_stage: CareerStage = CareerStage.OTHER
    years_experience: Optional[int] = None
    h_index: int = 0
    total_citations: int = 0
    research_interests: Optional[str] = None  # JSON string
    expertise_areas: Optional[str] = None  # JSON string
    current_funding_needs: Optional[str] = None  # JSON string
    infrastructure_needs: Optional[str] = None  # JSON string
    collaboration_needs: Optional[str] = None  # JSON string
    mentorship_needs: Optional[str] = None  # JSON string


class ResearcherCreate(ResearcherBase):
    pass


class ResearcherUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    email: Optional[EmailStr] = None
    orcid: Optional[str] = None
    affiliation: Optional[str] = None
    department: Optional[str] = None
    institution: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    career_stage: Optional[CareerStage] = None
    years_experience: Optional[int] = None
    h_index: Optional[int] = None
    total_citations: Optional[int] = None
    research_interests: Optional[str] = None
    expertise_areas: Optional[str] = None
    current_funding_needs: Optional[str] = None
    infrastructure_needs: Optional[str] = None
    collaboration_needs: Optional[str] = None
    mentorship_needs: Optional[str] = None
    impact_score: Optional[float] = None
    barrier_score: Optional[float] = None
    matchability_score: Optional[float] = None
    status: Optional[ResearcherStatus] = None
    is_verified: Optional[bool] = None


class ResearcherResponse(ResearcherBase):
    id: int
    impact_score: float = 0.0
    barrier_score: float = 0.0
    matchability_score: float = 0.0
    status: ResearcherStatus
    is_verified: bool
    verification_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_active: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Researcher Profile Schemas
class ResearcherProfileBase(BaseModel):
    bio: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    github: Optional[str] = None
    research_statement: Optional[str] = None
    current_projects: Optional[str] = None  # JSON string
    future_directions: Optional[str] = None  # JSON string
    funding_history: Optional[str] = None  # JSON string
    grant_applications: Optional[str] = None  # JSON string
    collaboration_preferences: Optional[str] = None  # JSON string
    geographic_preferences: Optional[str] = None  # JSON string
    available_for_collaboration: bool = True
    available_for_mentorship: bool = False
    available_for_consulting: bool = False


class ResearcherProfileCreate(ResearcherProfileBase):
    pass


class ResearcherProfileUpdate(BaseModel):
    bio: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    github: Optional[str] = None
    research_statement: Optional[str] = None
    current_projects: Optional[str] = None
    future_directions: Optional[str] = None
    funding_history: Optional[str] = None
    grant_applications: Optional[str] = None
    collaboration_preferences: Optional[str] = None
    geographic_preferences: Optional[str] = None
    available_for_collaboration: Optional[bool] = None
    available_for_mentorship: Optional[bool] = None
    available_for_consulting: Optional[bool] = None


class ResearcherProfileResponse(ResearcherProfileBase):
    id: int
    researcher_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Filter Schemas
class ResearcherFilter(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    orcid: Optional[str] = None
    affiliation: Optional[str] = None
    institution: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    career_stage: Optional[CareerStage] = None
    min_years_experience: Optional[int] = None
    max_years_experience: Optional[int] = None
    min_h_index: Optional[int] = None
    max_h_index: Optional[int] = None
    min_total_citations: Optional[int] = None
    max_total_citations: Optional[int] = None
    min_impact_score: Optional[float] = None
    max_impact_score: Optional[float] = None
    min_barrier_score: Optional[float] = None
    max_barrier_score: Optional[float] = None
    status: Optional[ResearcherStatus] = None
    is_verified: Optional[bool] = None
    available_for_collaboration: Optional[bool] = None
    available_for_mentorship: Optional[bool] = None
    available_for_consulting: Optional[bool] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    limit: int = 50
    offset: int = 0 