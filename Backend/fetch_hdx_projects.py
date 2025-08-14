import requests
import json

HDX_API_URL = "https://data.humdata.org/api/3/action/package_search"

# Fetch projects from HDX (example: humanitarian projects)
def fetch_hdx_projects(query="project", rows=1000):
    headers = {
        'User-Agent': 'Shadow-Markets-Research-Platform/1.0',
        'Content-Type': 'application/json'
    }
    params = {
        "q": query,
        "rows": rows,
        "fq": "dataset_type:dataset"
    }
    try:
        print(f"Fetching from {HDX_API_URL} with params {params}")
        resp = requests.get(HDX_API_URL, params=params, headers=headers, verify=True)
        resp.raise_for_status()  # This will raise an exception for non-200 status codes
        if resp.status_code == 200:
            print("Successfully connected to HDX API")
    except Exception as e:
        print(f"Failed to fetch from HDX: {str(e)}")
        return
    data = resp.json()
    results = data.get("result", {}).get("results", [])
    with open("Backend/hdx-projects-json/projects.json", "w") as f:
        json.dump(results, f)
    print(f"Fetched {len(results)} HDX projects.")

if __name__ == "__main__":
    fetch_hdx_projects()
