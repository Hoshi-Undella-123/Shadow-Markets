"""
Fetches research/impact projects from open NGO datasets/APIs and saves as JSON for DB loading.
"""
import requests
import json

# Placeholder: Replace with real open NGO project API or dataset
NGO_API = "https://api.globalinnovationexchange.org/api/v1/innovations?limit=1000"

def fetch_ngos_projects(output_path="ngos_projects.json", max_projects=1000):
    print("Fetching NGO projects...")
    resp = requests.get(NGO_API)
    resp.raise_for_status()
    data = resp.json()
    # This is a placeholder; real NGO project APIs may differ
    projects = data.get('results', [])[:max_projects]
    with open(output_path, "w") as f:
        json.dump(projects, f, indent=2)
    print(f"Saved {len(projects)} NGO projects to {output_path}")

if __name__ == "__main__":
    fetch_ngos_projects()
