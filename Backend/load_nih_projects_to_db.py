
import os
import json
from sqlalchemy import create_engine, text

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user@localhost:5432/shadow")
engine = create_engine(DATABASE_URL)

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return date_str[:10]
    except Exception:
        return None

def get_pi_name(principal_investigators):
    if isinstance(principal_investigators, list) and principal_investigators:
        pi = principal_investigators[0]
        return pi.get('full_name') or pi.get('first_name', '') + ' ' + pi.get('last_name', '')
    return None

def load_nih_projects(json_path="Backend/nih_projects.json"):
    with open(json_path) as f:
        projects = json.load(f)
    count = 0
    with engine.connect() as conn:
        for proj in projects:
            if not proj.get('project_num'):
                continue
            mapped_project = {
                'project_id': proj.get('project_num'),
                'title': proj.get('project_title', ''),
                'description': proj.get('abstract_text', ''),
                'start_date': parse_date(proj.get('project_start_date')),
                'end_date': parse_date(proj.get('project_end_date')),
                'funding_amount': proj.get('award_amount'),
                'needs_funding': True if proj.get('status', '').lower() == 'active' else False,
                'country': (proj.get('organization') or {}).get('country', None),
                'region': None,
                'project_type': proj.get('terms') or proj.get('project_terms', ''),
                'sectors': proj.get('terms', []),
                'source': 'NIH',
                'source_url': None
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
                print(f"Error loading NIH project {proj.get('project_num')}: {e}")
                continue
        conn.commit()
    print(f"Loaded {count} NIH projects into database.")

if __name__ == "__main__":
    load_nih_projects()
    main()
