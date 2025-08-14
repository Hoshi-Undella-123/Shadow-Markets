"""
Loads NGO projects from JSON into the database, mapping to the unified Project model.
"""
import json
from sqlalchemy import create_engine, text
import os

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user@localhost:5432/shadow")
engine = create_engine(DATABASE_URL)

def load_ngos_projects(json_path="ngos_projects.json"):
    with open(json_path) as f:
        projects = json.load(f)
    count = 0
    with engine.connect() as conn:
        for p in projects:
            mapped_project = {
                'project_id': p.get('id', 'ngo'),
                'title': p.get('title', ''),
                'description': p.get('description', ''),
                'start_date': p.get('start_date', None),
                'end_date': p.get('end_date', None),
                'funding_amount': p.get('funding', 0),
                'needs_funding': True if p.get('status', '').lower() == 'active' else False,
                'country': p.get('country', None),
                'region': p.get('region', None),
                'project_type': p.get('project_type', 'NGO'),
                'sectors': p.get('tags', []),
                'source': 'NGO',
                'source_url': p.get('url', None)
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
                print(f"Error loading NGO project {p.get('id')}: {e}")
                continue
        conn.commit()
    print(f"Loaded {count} NGO projects into database.")

if __name__ == "__main__":
    load_ngos_projects()
