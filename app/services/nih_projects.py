import json
from datetime import datetime
from app.models.nih_projects import NIHProject
from sqlalchemy.orm import Session

def load_nih_projects_from_json(db: Session, json_path: str):
    with open(json_path, 'r') as f:
        projects = json.load(f)
    for proj in projects:
        # Defensive: skip if missing required fields
        if not proj.get('project_num') or not proj.get('project_title'):
            continue
        db_proj = NIHProject(
            project_num=proj.get('project_num'),
            project_title=proj.get('project_title'),
            principal_investigator=(proj.get('principal_investigators') or [{}])[0].get('full_name') if proj.get('principal_investigators') else None,
            organization=proj.get('organization', {}).get('org_name') if proj.get('organization') else None,
            award_amount=proj.get('award_amount'),
            project_terms=proj.get('terms'),
            abstract_text=proj.get('abstract_text'),
            project_start_date=parse_date(proj.get('project_start_date')),
            project_end_date=parse_date(proj.get('project_end_date')),
            agency_ic_admin_abbreviation=proj.get('agency_ic_admin', {}).get('abbreviation') if proj.get('agency_ic_admin') else None,
            status='Active' if proj.get('is_active') else 'Inactive',
        )
        # Upsert by project_num
        existing = db.query(NIHProject).filter_by(project_num=db_proj.project_num).first()
        if existing:
            for attr, value in db_proj.__dict__.items():
                if attr != '_sa_instance_state' and value is not None:
                    setattr(existing, attr, value)
        else:
            db.add(db_proj)
    db.commit()

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str[:10], "%Y-%m-%d").date()
    except Exception:
        return None
