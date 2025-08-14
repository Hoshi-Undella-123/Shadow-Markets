
import json
from sqlalchemy import create_engine, text
import os

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user@localhost:5432/shadow")
engine = create_engine(DATABASE_URL)

def load_worldbank_projects(json_path="worldbank_projects.json"):
    with open(json_path) as f:
        projects = json.load(f)
    count = 0
    with engine.connect() as conn:
        for p in projects:
            theme1 = p.get('theme1', '')
            if isinstance(theme1, dict):
                project_terms = theme1.get('Name', '')
            else:
                project_terms = theme1
            country = p.get('countryshortname') or (p.get('countryname')[0] if isinstance(p.get('countryname'), list) and p.get('countryname') else None)
            region = p.get('regionname')
            sectors = []
            for i in range(1, 6):
                s = p.get(f'sector{i}')
                if s and isinstance(s, dict) and s.get('Name'):
                    sectors.append(s['Name'])
            # Project type: use prodline or lendinginstr as proxy
            project_type = p.get('prodline') or p.get('lendinginstr')
            try:
                award_amount = int(p.get('totalcommamt', 0).replace(',', '')) if p.get('totalcommamt') else 0
            except Exception:
                award_amount = 0
            mapped_project = {
                'project_id': p.get('id', 'worldbank'),
                'title': p.get('project_name', ''),
                'description': p.get('project_abstract', {}).get('cdata', ''),
                'start_date': None,
                'end_date': None,
                'funding_amount': award_amount,
                'needs_funding': True if p.get('projectstatusdisplay', '').lower() == 'active' else False,
                'country': country,
                'region': region,
                'project_type': project_type,
                'sectors': sectors,
                'source': 'WorldBank',
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
                print(f"Error loading World Bank project {p.get('id')}: {e}")
                continue
        conn.commit()
    print(f"Loaded {count} World Bank projects into database.")

if __name__ == "__main__":
    load_worldbank_projects()
