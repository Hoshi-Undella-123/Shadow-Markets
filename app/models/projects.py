from sqlalchemy import Column, Integer, String, Text, Date, BigInteger, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(128), unique=True, index=True)
    title = Column(Text, nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    funding_amount = Column(BigInteger)
    needs_funding = Column(Boolean)
    country = Column(String(128))
    region = Column(String(128))
    project_type = Column(String(64))
    sectors = Column(ARRAY(Text))
    source = Column(String(64))
    source_url = Column(Text)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
