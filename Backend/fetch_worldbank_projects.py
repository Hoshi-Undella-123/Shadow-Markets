"""
Fetches research projects from the World Bank Projects API and saves as JSON for DB loading.
"""
import requests
import json

# World Bank API: https://search.worldbank.org/api/v2/projects?format=json&rows=1000
WORLD_BANK_API = "https://search.worldbank.org/api/v2/projects?format=json&rows=1000"

def fetch_worldbank_projects(output_path="worldbank_projects.json", max_projects=1000):
    print("Fetching World Bank projects...")
    resp = requests.get(WORLD_BANK_API)
    resp.raise_for_status()
    data = resp.json()
    # World Bank returns projects under 'projects'
    projects = list(data.get('projects', {}).values())[:max_projects]
    with open(output_path, "w") as f:
        json.dump(projects, f, indent=2)
    print(f"Saved {len(projects)} World Bank projects to {output_path}")

if __name__ == "__main__":
    fetch_worldbank_projects()
