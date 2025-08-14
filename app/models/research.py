from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class PaperStatus(enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    PREPRINT = "preprint"
    RETRACTED = "retracted"


class DataSource(enum.Enum):
    ARXIV = "arxiv"
    SEMANTIC_SCHOLAR = "semantic_scholar"
    PUBMED = "pubmed"
    CROSSREF = "crossref"
    DOAJ = "doaj"
    MANUAL = "manual"


# Association table for research fields
paper_fields = Table(
    'paper_fields',
    Base.metadata,
    Column('paper_id', Integer, ForeignKey('research_papers.id')),
    Column('field_id', Integer, ForeignKey('research_fields.id'))
)


class ResearchPaper(Base):
    __tablename__ = "research_papers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    abstract = Column(Text)
    authors = Column(Text)  # JSON string of author names
    doi = Column(String(100), unique=True, index=True)
    arxiv_id = Column(String(50), unique=True, index=True)
    semantic_scholar_id = Column(String(100), unique=True, index=True)
    
    # Publication info
    journal = Column(String(200))
    publication_date = Column(DateTime)
    status = Column(String(20), default=PaperStatus.PREPRINT.value)
    data_source = Column(String(20), default=DataSource.ARXIV.value)
    
    # Impact metrics
    citation_count = Column(Integer, default=0)
    impact_score = Column(Float, default=0.0)
    novelty_score = Column(Float, default=0.0)
    societal_impact_score = Column(Float, default=0.0)
    
    # Limitations and barriers
    funding_limitations = Column(Text)  # JSON string of funding issues
    infrastructure_needs = Column(Text)  # JSON string of infrastructure needs
    collaboration_needs = Column(Text)   # JSON string of collaboration needs
    barrier_score = Column(Float, default=0.0)  # Overall barrier severity
    
    # Processing flags
    is_processed = Column(Boolean, default=False)
    is_scored = Column(Boolean, default=False)
    is_flagged_for_review = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_ingested = Column(DateTime(timezone=True))
    
    # Relationships
    fields = relationship("ResearchField", secondary=paper_fields, back_populates="papers")
    paper_authors = relationship("PaperAuthor", back_populates="paper")
    
    def __repr__(self):
        return f"<ResearchPaper(id={self.id}, title='{self.title[:50]}...')>"


class ResearchField(Base):
    __tablename__ = "research_fields"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    parent_field_id = Column(Integer, ForeignKey('research_fields.id'), nullable=True)
    
    # Relationships
    papers = relationship("ResearchPaper", secondary=paper_fields, back_populates="fields")
    researchers = relationship("Researcher", secondary="researcher_fields", back_populates="fields")
    funders = relationship("Funder", secondary="funder_interests", back_populates="interests")
    parent_field = relationship("ResearchField", remote_side=[id])
    child_fields = relationship("ResearchField")
    
    def __repr__(self):
        return f"<ResearchField(id={self.id}, name='{self.name}')>"


class PaperAuthor(Base):
    __tablename__ = "paper_authors"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey('research_papers.id'), nullable=False)
    researcher_id = Column(Integer, ForeignKey('researchers.id'), nullable=True)
    
    # Author info (in case researcher not in our system)
    name = Column(String(200), nullable=False)
    email = Column(String(200))
    affiliation = Column(String(300))
    orcid = Column(String(50))
    
    # Author order in paper
    author_order = Column(Integer, default=0)
    
    # Relationships
    paper = relationship("ResearchPaper", back_populates="paper_authors")
    researcher = relationship("Researcher", back_populates="paper_authorships")
    
    def __repr__(self):
        return f"<PaperAuthor(id={self.id}, name='{self.name}', paper_id={self.paper_id})>" 