import json
from sqlalchemy import create_engine, text
from datetime import datetime
import os

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user@localhost:5432/shadow")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

def load_hdx_projects(json_path="Backend/hdx-projects-json/projects.json"):
    # Read the JSON file
    with open(json_path, 'r') as f:
        projects = json.load(f)
    
    # Connect to database
    with engine.connect() as conn:
        for project in projects:
            # Map HDX fields to our schema
            mapped_project = {
                'project_id': project.get('id'),
                'title': project.get('title'),
                'description': project.get('notes'),
                'start_date': project.get('metadata_created'),
                'end_date': project.get('metadata_modified'),
                'funding_amount': None,  # HDX doesn't provide funding info
                'needs_funding': True,  # Assume humanitarian projects need funding
                'country': project.get('country'),
                'region': project.get('region'),
                'project_type': 'humanitarian',
                'sectors': project.get('groups', []),
                'source': 'HDX',
                'source_url': f"https://data.humdata.org/dataset/{project.get('id')}"
            }

            # Upsert query
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
                conn.commit()
            except Exception as e:
                print(f"Error loading HDX project {project.get('id')}: {e}")
                continue

    print(f"Loaded {len(projects)} HDX projects into database.")

if __name__ == "__main__":
    load_hdx_projects()
