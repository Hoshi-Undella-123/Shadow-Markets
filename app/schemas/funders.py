from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class FunderType(str, Enum):
    INDIVIDUAL = "individual"
    FOUNDATION = "foundation"
    CORPORATION = "corporation"
    GOVERNMENT = "government"
    UNIVERSITY = "university"
    NONPROFIT = "nonprofit"
    OTHER = "other"


class SupportType(str, Enum):
    FUNDING = "funding"
    INFRASTRUCTURE = "infrastructure"
    MENTORSHIP = "mentorship"
    COLLABORATION = "collaboration"
    POLICY = "policy"
    NETWORKING = "networking"
    OTHER = "other"


class FunderStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    VERIFIED = "verified"
    PENDING = "pending"


# Authentication Schemas
class FunderLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    email: Optional[str] = None


# Funder Schemas
class FunderBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    funder_type: FunderType = FunderType.INDIVIDUAL
    organization: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    support_types: Optional[str] = None  # JSON string
    funding_range_min: Optional[float] = None
    funding_range_max: Optional[float] = None
    currency: str = "USD"
    research_interests: Optional[str] = None  # JSON string
    geographic_focus: Optional[str] = None  # JSON string
    career_stage_focus: Optional[str] = None  # JSON string


class FunderCreate(FunderBase):
    email: EmailStr
    password: str = Field(..., min_length=6)


class FunderUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    funder_type: Optional[FunderType] = None
    organization: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    support_types: Optional[str] = None
    funding_range_min: Optional[float] = None
    funding_range_max: Optional[float] = None
    currency: Optional[str] = None
    research_interests: Optional[str] = None
    geographic_focus: Optional[str] = None
    career_stage_focus: Optional[str] = None
    is_active: Optional[bool] = None


class FunderResponse(FunderBase):
    id: int
    email: str
    status: FunderStatus
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Funder Profile Schemas
class FunderProfileBase(BaseModel):
    bio: Optional[str] = None
    mission_statement: Optional[str] = None
    funding_philosophy: Optional[str] = None
    total_projects_funded: int = 0
    total_amount_funded: float = 0.0
    average_grant_size: float = 0.0
    evaluation_criteria: Optional[str] = None  # JSON string
    application_process: Optional[str] = None  # JSON string
    reporting_requirements: Optional[str] = None  # JSON string
    preferred_contact_method: Optional[str] = None
    response_time_expectation: Optional[str] = None
    communication_frequency: Optional[str] = None


class FunderProfileCreate(FunderProfileBase):
    pass


class FunderProfileUpdate(BaseModel):
    bio: Optional[str] = None
    mission_statement: Optional[str] = None
    funding_philosophy: Optional[str] = None
    total_projects_funded: Optional[int] = None
    total_amount_funded: Optional[float] = None
    average_grant_size: Optional[float] = None
    evaluation_criteria: Optional[str] = None
    application_process: Optional[str] = None
    reporting_requirements: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    response_time_expectation: Optional[str] = None
    communication_frequency: Optional[str] = None


class FunderProfileResponse(FunderProfileBase):
    id: int
    funder_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Filter Schemas
class FunderFilter(BaseModel):
    name: Optional[str] = None
    funder_type: Optional[FunderType] = None
    organization: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    support_types: Optional[List[SupportType]] = None
    min_funding_range: Optional[float] = None
    max_funding_range: Optional[float] = None
    is_verified: Optional[bool] = None
    is_active: Optional[bool] = None
    status: Optional[FunderStatus] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    limit: int = 50
    offset: int = 0


# Password Change Schema
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6) 