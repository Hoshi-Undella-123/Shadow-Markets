from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class MatchStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"
    COMPLETED = "completed"


class MatchType(enum.Enum):
    FUNDING = "funding"
    MENTORSHIP = "mentorship"
    COLLABORATION = "collaboration"
    INFRASTRUCTURE = "infrastructure"
    POLICY = "policy"
    NETWORKING = "networking"
    OTHER = "other"


class MatchPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    funder_id = Column(Integer, ForeignKey('funders.id'), nullable=False)
    researcher_id = Column(Integer, ForeignKey('researchers.id'), nullable=False)
    
    # Match details
    match_type = Column(String(20), default=MatchType.FUNDING.value)
    priority = Column(String(20), default=MatchPriority.MEDIUM.value)
    status = Column(String(20), default=MatchStatus.PENDING.value)
    
    # Matching scores
    impact_score = Column(Float, default=0.0)
    barrier_score = Column(Float, default=0.0)
    compatibility_score = Column(Float, default=0.0)
    overall_score = Column(Float, default=0.0)
    
    # Match reasoning
    match_reasoning = Column(Text)  # JSON string explaining why this match was made
    barrier_analysis = Column(Text)  # JSON string of barrier analysis
    solution_proposal = Column(Text)  # JSON string of proposed solutions
    
    # Communication
    funder_message = Column(Text)
    researcher_message = Column(Text)
    admin_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    expires_at = Column(DateTime(timezone=True))
    responded_at = Column(DateTime(timezone=True))
    
    # Relationships
    funder = relationship("Funder")
    researcher = relationship("Researcher")
    requests = relationship("MatchRequest", back_populates="match")
    responses = relationship("MatchResponse", back_populates="match")
    
    def __repr__(self):
        return f"<Match(id={self.id}, funder_id={self.funder_id}, researcher_id={self.researcher_id}, status='{self.status}')>"


class MatchRequest(Base):
    __tablename__ = "match_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey('matches.id'), nullable=False)
    requester_id = Column(Integer, nullable=False)  # funder_id or researcher_id
    requester_type = Column(String(20), nullable=False)  # "funder" or "researcher"
    
    # Request details
    request_type = Column(String(50), nullable=False)  # "initial", "follow_up", "clarification"
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    
    # Status
    is_read = Column(Boolean, default=False)
    is_responded = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))
    
    # Relationships
    match = relationship("Match", back_populates="requests")
    
    def __repr__(self):
        return f"<MatchRequest(id={self.id}, match_id={self.match_id}, requester_type='{self.requester_type}')>"


class MatchResponse(Base):
    __tablename__ = "match_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey('matches.id'), nullable=False)
    request_id = Column(Integer, ForeignKey('match_requests.id'), nullable=False)
    responder_id = Column(Integer, nullable=False)  # funder_id or researcher_id
    responder_type = Column(String(20), nullable=False)  # "funder" or "researcher"
    
    # Response details
    response_type = Column(String(50), nullable=False)  # "accept", "reject", "clarify", "counter_offer"
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    
    # Action items
    proposed_amount = Column(Float)
    proposed_timeline = Column(Text)  # JSON string of timeline
    conditions = Column(Text)  # JSON string of conditions
    
    # Status
    is_read = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))
    
    # Relationships
    match = relationship("Match", back_populates="responses")
    request = relationship("MatchRequest")
    
    def __repr__(self):
        return f"<MatchResponse(id={self.id}, match_id={self.match_id}, response_type='{self.response_type}')>" 