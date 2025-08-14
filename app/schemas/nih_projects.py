from pydantic import BaseModel
from typing import Optional
from datetime import date

class NIHProjectBase(BaseModel):
    project_num: str
    project_title: str
    principal_investigator: Optional[str] = None
    organization: Optional[str] = None
    award_amount: Optional[int] = None
    project_terms: Optional[str] = None
    abstract_text: Optional[str] = None
    project_start_date: Optional[date] = None
    project_end_date: Optional[date] = None
    agency_ic_admin_abbreviation: Optional[str] = None
    status: Optional[str] = None
    # New fields for robust categorization
    country: Optional[str] = None
    region: Optional[str] = None
    project_type: Optional[str] = None
    sectors: Optional[str] = None  # comma-separated or JSON string

class NIHProjectCreate(NIHProjectBase):
    pass

class NIHProject(NIHProjectBase):
    id: int

    class Config:
        orm_mode = True
