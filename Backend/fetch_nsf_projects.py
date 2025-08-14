"""
Fetches research projects from the NSF Award Search API and saves as JSON for DB loading.
"""
import requests
import json

# NSF API: https://www.nsf.gov/awardsearch/download.jsp (CSV, but also has a JSON endpoint)
NSF_API = "https://api.nsf.gov/services/v1/awards.json?offset=1&limit=1000"

def fetch_nsf_projects(output_path="nsf_projects.json", max_projects=1000):
    print("Fetching NSF projects...")
    resp = requests.get(NSF_API)
    resp.raise_for_status()
    data = resp.json()
    # NSF returns a list of awards under 'response' > 'award'
    projects = data.get('response', {}).get('award', [])[:max_projects]
    with open(output_path, "w") as f:
        json.dump(projects, f, indent=2)
    print(f"Saved {len(projects)} NSF projects to {output_path}")

if __name__ == "__main__":
    fetch_nsf_projects()
