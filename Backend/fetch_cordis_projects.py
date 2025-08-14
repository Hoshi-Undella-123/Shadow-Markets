"""
Fetches research projects from the CORDIS (EU) Open Data API and saves as JSON for DB loading.
"""
import requests
import json

CORDIS_API = "https://cordis.europa.eu/data/cordis-h2020projects.json"

# For demo: fetch and save a sample of projects

def fetch_cordis_projects(output_path="cordis_projects.json", max_projects=1000):
    print("Fetching CORDIS projects...")
    resp = requests.get(CORDIS_API)
    resp.raise_for_status()
    data = resp.json()
    # CORDIS returns a list of projects under 'projects'
    projects = data.get('projects', [])[:max_projects]
    with open(output_path, "w") as f:
        json.dump(projects, f, indent=2)
    print(f"Saved {len(projects)} CORDIS projects to {output_path}")

if __name__ == "__main__":
    fetch_cordis_projects()
