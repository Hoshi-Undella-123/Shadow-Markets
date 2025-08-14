import os
import json
import csv
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user@localhost:5432/shadow")
engine = create_engine(DATABASE_URL)

def upsert_project(conn, mapped_project):
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
    except Exception as e:
        print(f"Error upserting project {mapped_project.get('project_id')}: {e}")

def load_misc_csv_json_to_db():
    files = [
        ("aiddata_global_projects.csv", "AidData"),
        ("ngsc_car_parks.json", "NGSC-CarParks"),
        ("ngsc_asset_buildings.json", "NGSC-AssetBuildings"),
        ("southern_grampians_garbage_zones.json", "SouthernGrampiansGarbage"),
        ("asic_banned_orgs.csv", "ASIC-BannedOrgs"),
        ("energy_rating_appliances.csv", "EnergyRating"),
    ]
    with engine.connect() as conn:
        for fname, source in files:
            fpath = os.path.join("Backend", fname)
            if not os.path.exists(fpath):
                print(f"File not found: {fpath}")
                continue
            print(f"Loading {fpath} as source {source}")
            if fname.endswith(".csv"):
                with open(fpath, newline='', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        mapped = {
                            'project_id': row.get('project_id') or row.get('id') or row.get('ProjectID') or row.get('project_code') or row.get('AssetID') or row.get('CarParkID') or row.get('BuildingID') or row.get('Name') or row.get('SerialNumber') or row.get('UniqueID') or row.get('RecordID') or row.get('Reference') or row.get('OrganisationID') or row.get('OrganisationName') or row.get('Title') or row.get('title') or row.get('Asset Name') or row.get('Asset'),
                            'title': row.get('title') or row.get('Title') or row.get('Asset Name') or row.get('Asset'),
                            'description': row.get('description') or row.get('Description'),
                            'start_date': row.get('start_date') or row.get('StartDate') or row.get('CommencementDate'),
                            'end_date': row.get('end_date') or row.get('EndDate') or row.get('CompletionDate'),
                            'funding_amount': row.get('funding_amount') or row.get('FundingAmount') or row.get('Value'),
                            'needs_funding': False,
                            'country': row.get('country') or row.get('Country'),
                            'region': row.get('region') or row.get('Region'),
                            'project_type': row.get('project_type') or row.get('Type'),
                            'sectors': [row.get('sector') or row.get('Sector') or row.get('Category') or row.get('Type')],
                            'source': source,
                            'source_url': row.get('source_url') or row.get('URL')
                        }
                        if mapped['project_id']:
                            upsert_project(conn, mapped)
            elif fname.endswith(".json"):
                with open(fpath, encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict) and 'features' in data:
                        # GeoJSON
                        for feat in data['features']:
                            props = feat.get('properties', {})
                            mapped = {
                                'project_id': props.get('id') or props.get('project_id') or props.get('AssetID') or props.get('CarParkID') or props.get('BuildingID') or props.get('Name'),
                                'title': props.get('title') or props.get('Name'),
                                'description': props.get('description') or props.get('Description'),
                                'start_date': props.get('start_date') or props.get('StartDate'),
                                'end_date': props.get('end_date') or props.get('EndDate'),
                                'funding_amount': props.get('funding_amount') or props.get('Value'),
                                'needs_funding': False,
                                'country': props.get('country'),
                                'region': props.get('region'),
                                'project_type': props.get('project_type') or props.get('Type'),
                                'sectors': [props.get('sector') or props.get('Category') or props.get('Type')],
                                'source': source,
                                'source_url': props.get('source_url')
                            }
                            if mapped['project_id']:
                                upsert_project(conn, mapped)
                    elif isinstance(data, list):
                        for row in data:
                            mapped = {
                                'project_id': row.get('id') or row.get('project_id') or row.get('AssetID') or row.get('CarParkID') or row.get('BuildingID') or row.get('Name'),
                                'title': row.get('title') or row.get('Name'),
                                'description': row.get('description') or row.get('Description'),
                                'start_date': row.get('start_date') or row.get('StartDate'),
                                'end_date': row.get('end_date') or row.get('EndDate'),
                                'funding_amount': row.get('funding_amount') or row.get('Value'),
                                'needs_funding': False,
                                'country': row.get('country'),
                                'region': row.get('region'),
                                'project_type': row.get('project_type') or row.get('Type'),
                                'sectors': [row.get('sector') or row.get('Category') or row.get('Type')],
                                'source': source,
                                'source_url': row.get('source_url')
                            }
                            if mapped['project_id']:
                                upsert_project(conn, mapped)
            print(f"Loaded data from {fname}")
        conn.commit()
    print("All misc CSV/JSON datasets loaded.")

if __name__ == "__main__":
    load_misc_csv_json_to_db()
