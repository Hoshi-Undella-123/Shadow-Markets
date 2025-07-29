from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class ResearcherStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    VERIFIED = "verified"
    PENDING = "pending"


class CareerStage(enum.Enum):
    STUDENT = "student"
    POSTDOC = "postdoc"
    ASSISTANT_PROFESSOR = "assistant_professor"
    ASSOCIATE_PROFESSOR = "associate_professor"
    PROFESSOR = "professor"
    RESEARCH_SCIENTIST = "research_scientist"
    INDUSTRY = "industry"
    OTHER = "other"


# Association table for researcher fields
researcher_fields = Table(
    'researcher_fields',
    Base.metadata,
    Column('researcher_id', Integer, ForeignKey('researchers.id')),
    Column('field_id', Integer, ForeignKey('research_fields.id'))
)


class Researcher(Base):
    __tablename__ = "researchers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    email = Column(String(200), unique=True, index=True)
    orcid = Column(String(50), unique=True, index=True)
    
    # Profile info
    affiliation = Column(String(300))
    department = Column(String(200))
    institution = Column(String(300))
    country = Column(String(100))
    city = Column(String(100))
    
    # Career info
    career_stage = Column(String(30), default=CareerStage.OTHER.value)
    years_experience = Column(Integer)
    h_index = Column(Integer, default=0)
    total_citations = Column(Integer, default=0)
    
    # Research focus
    research_interests = Column(Text)  # JSON string of interests
    expertise_areas = Column(Text)     # JSON string of expertise
    
    # Current barriers and needs
    current_funding_needs = Column(Text)  # JSON string of funding needs
    infrastructure_needs = Column(Text)    # JSON string of infrastructure needs
    collaboration_needs = Column(Text)     # JSON string of collaboration needs
    mentorship_needs = Column(Text)        # JSON string of mentorship needs
    
    # Scoring
    impact_score = Column(Float, default=0.0)
    barrier_score = Column(Float, default=0.0)
    matchability_score = Column(Float, default=0.0)
    
    # Status and verification
    status = Column(String(20), default=ResearcherStatus.PENDING.value)
    is_verified = Column(Boolean, default=False)
    verification_date = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_active = Column(DateTime(timezone=True))
    
    # Relationships
    fields = relationship("ResearchField", secondary=researcher_fields, back_populates="researchers")
    profile = relationship("ResearcherProfile", back_populates="researcher", uselist=False)
    paper_authorships = relationship("PaperAuthor", back_populates="researcher")
    
    def __repr__(self):
        return f"<Researcher(id={self.id}, name='{self.name}', email='{self.email}')>"


class ResearcherProfile(Base):
    __tablename__ = "researcher_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    researcher_id = Column(Integer, ForeignKey('researchers.id'), nullable=False)
    
    # Detailed profile
    bio = Column(Text)
    website = Column(String(300))
    linkedin = Column(String(300))
    twitter = Column(String(100))
    github = Column(String(100))
    
    # Research statement
    research_statement = Column(Text)
    current_projects = Column(Text)  # JSON string of current projects
    future_directions = Column(Text)  # JSON string of future research directions
    
    # Funding history
    funding_history = Column(Text)  # JSON string of past funding
    grant_applications = Column(Text)  # JSON string of grant applications
    
    # Collaboration preferences
    collaboration_preferences = Column(Text)  # JSON string of collaboration preferences
    geographic_preferences = Column(Text)     # JSON string of geographic preferences
    
    # Availability
    available_for_collaboration = Column(Boolean, default=True)
    available_for_mentorship = Column(Boolean, default=False)
    available_for_consulting = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    researcher = relationship("Researcher", back_populates="profile")
    
    def __repr__(self):
        return f"<ResearcherProfile(id={self.id}, researcher_id={self.researcher_id})>" 