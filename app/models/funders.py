from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class FunderType(enum.Enum):
    INDIVIDUAL = "individual"
    FOUNDATION = "foundation"
    CORPORATION = "corporation"
    GOVERNMENT = "government"
    UNIVERSITY = "university"
    NONPROFIT = "nonprofit"
    OTHER = "other"


class SupportType(enum.Enum):
    FUNDING = "funding"
    INFRASTRUCTURE = "infrastructure"
    MENTORSHIP = "mentorship"
    COLLABORATION = "collaboration"
    POLICY = "policy"
    NETWORKING = "networking"
    OTHER = "other"


class FunderStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    VERIFIED = "verified"
    PENDING = "pending"


# Association table for funder interests
funder_interests = Table(
    'funder_interests',
    Base.metadata,
    Column('funder_id', Integer, ForeignKey('funders.id')),
    Column('field_id', Integer, ForeignKey('research_fields.id'))
)


class Funder(Base):
    __tablename__ = "funders"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Basic info
    name = Column(String(200), nullable=False)
    funder_type = Column(String(20), default=FunderType.INDIVIDUAL.value)
    organization = Column(String(300))
    website = Column(String(300))
    
    # Contact info
    phone = Column(String(50))
    address = Column(Text)
    country = Column(String(100))
    city = Column(String(100))
    
    # Support capabilities
    support_types = Column(Text)  # JSON string of support types
    funding_range_min = Column(Float)
    funding_range_max = Column(Float)
    currency = Column(String(10), default="USD")
    
    # Areas of interest
    research_interests = Column(Text)  # JSON string of research interests
    geographic_focus = Column(Text)    # JSON string of geographic preferences
    career_stage_focus = Column(Text)  # JSON string of career stage preferences
    
    # Status and verification
    status = Column(String(20), default=FunderStatus.PENDING.value)
    is_verified = Column(Boolean, default=False)
    verification_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    interests = relationship("ResearchField", secondary=funder_interests, back_populates="funders")
    profile = relationship("FunderProfile", back_populates="funder", uselist=False)
    past_involvements = relationship("FunderInvolvement", back_populates="funder")
    
    def __repr__(self):
        return f"<Funder(id={self.id}, name='{self.name}', email='{self.email}')>"


class FunderProfile(Base):
    __tablename__ = "funder_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    funder_id = Column(Integer, ForeignKey('funders.id'), nullable=False)
    
    # Detailed profile
    bio = Column(Text)
    mission_statement = Column(Text)
    funding_philosophy = Column(Text)
    
    # Past involvement
    total_projects_funded = Column(Integer, default=0)
    total_amount_funded = Column(Float, default=0.0)
    average_grant_size = Column(Float, default=0.0)
    
    # Preferences and criteria
    evaluation_criteria = Column(Text)  # JSON string of evaluation criteria
    application_process = Column(Text)  # JSON string of application process
    reporting_requirements = Column(Text)  # JSON string of reporting requirements
    
    # Communication preferences
    preferred_contact_method = Column(String(50))
    response_time_expectation = Column(String(100))
    communication_frequency = Column(String(100))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    funder = relationship("Funder", back_populates="profile")
    
    def __repr__(self):
        return f"<FunderProfile(id={self.id}, funder_id={self.funder_id})>"


class FunderInvolvement(Base):
    __tablename__ = "funder_involvements"
    
    id = Column(Integer, primary_key=True, index=True)
    funder_id = Column(Integer, ForeignKey('funders.id'), nullable=False)
    researcher_id = Column(Integer, ForeignKey('researchers.id'), nullable=False)
    
    # Involvement details
    involvement_type = Column(String(50), nullable=False)  # funding, mentorship, collaboration, etc.
    amount_funded = Column(Float)
    currency = Column(String(10), default="USD")
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String(20), default="active")  # active, completed, cancelled
    
    # Project details
    project_title = Column(String(500))
    project_description = Column(Text)
    outcomes = Column(Text)  # JSON string of outcomes
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    funder = relationship("Funder", back_populates="past_involvements")
    researcher = relationship("Researcher")
    
    def __repr__(self):
        return f"<FunderInvolvement(id={self.id}, funder_id={self.funder_id}, researcher_id={self.researcher_id})>" 