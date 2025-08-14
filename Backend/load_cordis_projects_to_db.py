
import json
from sqlalchemy import create_engine, text
import os

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user@localhost:5432/shadow")
engine = create_engine(DATABASE_URL)

def load_cordis_projects(json_path="Backend/cordis-HORIZONprojects-json/project.json"):
    with open(json_path) as f:
        projects = json.load(f)
    count = 0
    with engine.connect() as conn:
        for p in projects:
            # Handle both dict and string for title/objective
            title = p.get('title', '')
            if isinstance(title, dict):
                title = title.get('en', next(iter(title.values()), ''))
            objective = p.get('objective', '')
            if isinstance(objective, dict):
                objective = objective.get('en', next(iter(objective.values()), ''))
            mapped_project = {
                'project_id': str(p.get('rcn', p.get('id', 'cordis'))),
                'title': title,
                'description': objective,
                'start_date': p.get('startDate', None),
                'end_date': p.get('endDate', None),
                'funding_amount': p.get('ecMaxContribution', 0),
                'needs_funding': True if p.get('status', '').lower() == 'active' else False,
                'country': p.get('coordinatorCountry', None),
                'region': None,
                'project_type': p.get('programme', None),
                'sectors': p.get('topics', []),
                'source': 'CORDIS',
                'source_url': f"https://cordis.europa.eu/project/id/{p.get('rcn', p.get('id', 'cordis'))}"
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
                print(f"Error loading CORDIS project {p.get('rcn', p.get('id'))}: {e}")
                continue
        conn.commit()
    print(f"Loaded {count} CORDIS projects into database.")

if __name__ == "__main__":
    load_cordis_projects()
