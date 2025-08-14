import requests
import json
from datetime import datetime

UNDP_API_URL = "https://api.open.undp.org/v1/projects/"

# Fetch all projects (paginated)
def fetch_undp_projects():
    headers = {
        'User-Agent': 'Shadow-Markets-Research-Platform/1.0',
        'Accept': 'application/json'
    }
    projects = []
    page = 1
    
    print(f"Starting to fetch UNDP projects from {UNDP_API_URL}")
    
    while True:
        try:
            params = {
                "page": page,
                "per_page": 100,
                "format": "json"
            }
            print(f"\nFetching page {page}...")
            resp = requests.get(UNDP_API_URL, params=params, headers=headers, timeout=30)
            resp.raise_for_status()
            
            print(f"Response status: {resp.status_code}")
            print(f"Response headers: {resp.headers}")
            
            data = resp.json()
            print(f"Retrieved {len(data.get('results', []))} projects from this page")
            
            if not data or not data.get("results"):
                print("No more results found")
                break
                
            projects.extend(data["results"])
            
            if not data.get("next"):
                print("No next page available")
                break
                
            page += 1
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page}: {str(e)}")
            break
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from page {page}: {str(e)}")
            break
        except Exception as e:
            print(f"Unexpected error on page {page}: {str(e)}")
            break
    with open("Backend/undp-projects-json/projects.json", "w") as f:
        json.dump(projects, f)
    print(f"Fetched {len(projects)} UNDP projects.")

if __name__ == "__main__":
    fetch_undp_projects()
