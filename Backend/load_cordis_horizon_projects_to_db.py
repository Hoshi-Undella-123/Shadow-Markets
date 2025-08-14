"""
Loads CORDIS Horizon Europe projects from the official JSON bulk download into the database.
"""
import json
from sqlalchemy import create_engine, text
import os
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/research_matching")
engine = create_engine(DATABASE_URL)

def load_cordis_horizon_projects(json_path="Backend/cordis-HORIZONprojects-json/project.json"):
    with open(json_path) as f:
        data = json.load(f)
    projects = data.get('projects', data) if isinstance(data, dict) else data
    count = 0
    now = datetime.now()
    with engine.connect() as conn:
        for p in projects:
            # Only ongoing projects (endDate in future or status not finished)
            end_date = p.get('endDate')
            ongoing = False
            if end_date:
                try:
                    ongoing = datetime.strptime(end_date, "%Y-%m-%d") > now
                except Exception:
                    ongoing = True
            if not ongoing and p.get('status', '').lower() in ['closed', 'terminated', 'finished', 'completed']:
                continue
            # Categorization
            country = None
            region = None
            project_type = p.get('frameworkProgramme')
            # Ensure sectors is a list for Postgres ARRAY
            sectors = p.get('keywords')
            if sectors is None:
                sectors = []
            elif isinstance(sectors, str):
                # Split comma-separated string into list
                sectors = [s.strip() for s in sectors.split(',') if s.strip()]
            elif not isinstance(sectors, list):
                sectors = [str(sectors)]
            raw_award = p.get('ecMaxContribution', 0)
            try:
                award_amount = int(float(raw_award)) if raw_award not in (None, "") else 0
            except Exception:
                award_amount = 0
            mapped_project = {
                'project_id': str(p.get('id', p.get('rcn', 'cordis'))),
                'title': p.get('title', p.get('acronym', '')),
                'description': p.get('objective', ''),
                'start_date': p.get('startDate'),
                'end_date': p.get('endDate'),
                'funding_amount': award_amount,
                'needs_funding': True if p.get('status', '').lower() == 'active' else False,
                'country': country,
                'region': region,
                'project_type': project_type,
                'sectors': sectors,  # Now always a list
                'source': 'CORDIS-HORIZON',
                'source_url': f"https://cordis.europa.eu/project/id/{p.get('id', p.get('rcn', 'cordis'))}"
            }
            query = text("""
                INSERT INTO projects (
                    project_id, title, description, start_date, end_date,
                    funding_amount, needs_funding, country, region,
                    project_type, sectors, source, source_url
                )
                VALUES (
                    :project_id, :title, :description, :start_date, :end_date,
                    :funding_amount, :needs_funding, :country, :region,
                    :project_type, :sectors, :source, :source_url
                )
                ON CONFLICT (project_id) DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    start_date = EXCLUDED.start_date,
                    end_date = EXCLUDED.end_date,
                    funding_amount = EXCLUDED.funding_amount,
                    needs_funding = EXCLUDED.needs_funding,
                    country = EXCLUDED.country,
                    region = EXCLUDED.region,
                    project_type = EXCLUDED.project_type,
                    sectors = EXCLUDED.sectors,
                    source = EXCLUDED.source,
                    source_url = EXCLUDED.source_url;
            """)
            try:
                conn.execute(query, mapped_project)
                count += 1
            except Exception as e:
                print(f"Error loading CORDIS Horizon project {p.get('id')}: {e}")
                continue
        conn.commit()
    print(f"Loaded {count} CORDIS Horizon Europe projects into database.")
    print(f"Loaded {count} CORDIS Horizon projects into DB.")

if __name__ == "__main__":
    load_cordis_horizon_projects()
    # /Users/hoshitaundella/Shadow-Markets-2/.venv/bin/python -m uvicorn app.main:app --reload
