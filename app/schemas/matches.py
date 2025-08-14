from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class MatchStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"
    COMPLETED = "completed"


class MatchType(str, Enum):
    FUNDING = "funding"
    MENTORSHIP = "mentorship"
    COLLABORATION = "collaboration"
    INFRASTRUCTURE = "infrastructure"
    POLICY = "policy"
    NETWORKING = "networking"
    OTHER = "other"


class MatchPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class RequestType(str, Enum):
    INITIAL = "initial"
    FOLLOW_UP = "follow_up"
    CLARIFICATION = "clarification"


class ResponseType(str, Enum):
    ACCEPT = "accept"
    REJECT = "reject"
    CLARIFY = "clarify"
    COUNTER_OFFER = "counter_offer"


# Match Schemas
class MatchBase(BaseModel):
    funder_id: int
    researcher_id: int
    match_type: MatchType = MatchType.FUNDING
    priority: MatchPriority = MatchPriority.MEDIUM
    impact_score: float = 0.0
    barrier_score: float = 0.0
    compatibility_score: float = 0.0
    overall_score: float = 0.0
    match_reasoning: Optional[str] = None  # JSON string
    barrier_analysis: Optional[str] = None  # JSON string
    solution_proposal: Optional[str] = None  # JSON string
    funder_message: Optional[str] = None
    researcher_message: Optional[str] = None
    admin_notes: Optional[str] = None


class MatchCreate(MatchBase):
    pass


class MatchUpdate(BaseModel):
    match_type: Optional[MatchType] = None
    priority: Optional[MatchPriority] = None
    status: Optional[MatchStatus] = None
    impact_score: Optional[float] = None
    barrier_score: Optional[float] = None
    compatibility_score: Optional[float] = None
    overall_score: Optional[float] = None
    match_reasoning: Optional[str] = None
    barrier_analysis: Optional[str] = None
    solution_proposal: Optional[str] = None
    funder_message: Optional[str] = None
    researcher_message: Optional[str] = None
    admin_notes: Optional[str] = None
    expires_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None


class MatchResponse(MatchBase):
    id: int
    status: MatchStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Match Request Schemas
class MatchRequestBase(BaseModel):
    match_id: int
    requester_id: int
    requester_type: str = Field(..., pattern="^(funder|researcher)$")
    request_type: RequestType = RequestType.INITIAL
    subject: Optional[str] = None
    message: str = Field(..., min_length=1)


class MatchRequestCreate(MatchRequestBase):
    pass


class MatchRequestUpdate(BaseModel):
    subject: Optional[str] = None
    message: Optional[str] = Field(None, min_length=1)
    is_read: Optional[bool] = None
    is_responded: Optional[bool] = None


class MatchRequestResponse(MatchRequestBase):
    id: int
    is_read: bool = False
    is_responded: bool = False
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Match Response Schemas
class MatchResponseBase(BaseModel):
    match_id: int
    request_id: int
    responder_id: int
    responder_type: str = Field(..., pattern="^(funder|researcher)$")
    response_type: ResponseType
    subject: Optional[str] = None
    message: str = Field(..., min_length=1)
    proposed_amount: Optional[float] = None
    proposed_timeline: Optional[str] = None  # JSON string
    conditions: Optional[str] = None  # JSON string


class MatchResponseCreate(MatchResponseBase):
    pass


class MatchResponseUpdate(BaseModel):
    subject: Optional[str] = None
    message: Optional[str] = Field(None, min_length=1)
    proposed_amount: Optional[float] = None
    proposed_timeline: Optional[str] = None
    conditions: Optional[str] = None
    is_read: Optional[bool] = None


class MatchResponseResponse(MatchResponseBase):
    id: int
    is_read: bool = False
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Recommendation Schemas
class RecommendationRequest(BaseModel):
    funder_id: Optional[int] = None
    researcher_id: Optional[int] = None
    match_type: Optional[MatchType] = None
    min_impact_score: Optional[float] = None
    max_impact_score: Optional[float] = None
    min_barrier_score: Optional[float] = None
    max_barrier_score: Optional[float] = None
    priority: Optional[MatchPriority] = None
    limit: int = 10
    offset: int = 0


class RecommendationResponse(BaseModel):
    matches: List[MatchResponse]
    total_count: int
    has_more: bool


# Filter Schemas
class MatchFilter(BaseModel):
    funder_id: Optional[int] = None
    researcher_id: Optional[int] = None
    match_type: Optional[MatchType] = None
    priority: Optional[MatchPriority] = None
    status: Optional[MatchStatus] = None
    min_impact_score: Optional[float] = None
    max_impact_score: Optional[float] = None
    min_barrier_score: Optional[float] = None
    max_barrier_score: Optional[float] = None
    min_compatibility_score: Optional[float] = None
    max_compatibility_score: Optional[float] = None
    min_overall_score: Optional[float] = None
    max_overall_score: Optional[float] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    expires_after: Optional[datetime] = None
    expires_before: Optional[datetime] = None
    limit: int = 50
    offset: int = 0 