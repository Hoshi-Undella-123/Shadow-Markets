"""
Fetches research projects from the UN SDG Projects API (or open datasets) and saves as JSON for DB loading.
"""
import requests
import json

# Example: UN SDG API or open dataset (replace with real endpoint if available)
UN_API = "https://unstats.un.org/SDGAPI/v1/sdg/Goal/List"

def fetch_un_projects(output_path="un_projects.json", max_projects=1000):
    print("Fetching UN projects...")
    resp = requests.get(UN_API)
    resp.raise_for_status()
    data = resp.json()
    # This is a placeholder; real UN project APIs may differ
    projects = data[:max_projects] if isinstance(data, list) else []
    with open(output_path, "w") as f:
        json.dump(projects, f, indent=2)
    print(f"Saved {len(projects)} UN projects to {output_path}")

if __name__ == "__main__":
    fetch_un_projects()
