from sqlalchemy import Column, Integer, String, Text, Date, BigInteger
from app.database import Base

class NIHProject(Base):
    __tablename__ = "nih_projects"

    id = Column(Integer, primary_key=True, index=True)
    project_num = Column(String(64), unique=True, index=True)
    project_title = Column(Text, nullable=False)
    principal_investigator = Column(Text)
    organization = Column(Text)
    award_amount = Column(BigInteger)
    project_terms = Column(Text)
    abstract_text = Column(Text)
    project_start_date = Column(Date)
    project_end_date = Column(Date)
    agency_ic_admin_abbreviation = Column(String(32))
    status = Column(String(32))
    # New fields for robust categorization
    country = Column(String(128))
    region = Column(String(128))
    project_type = Column(String(64))
    sectors = Column(Text)  # comma-separated or JSON string

    def __repr__(self):
        return f"<NIHProject(project_num={self.project_num}, title={self.project_title[:50]})>"
