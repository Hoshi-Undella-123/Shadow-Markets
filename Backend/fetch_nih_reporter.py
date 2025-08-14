
import requests
import json
import os

# NIH RePORTER API endpoint
API_URL = "https://api.reporter.nih.gov/v2/projects/search"


# Fetch 200 ongoing research projects in diverse sectors
payload = {
    "criteria": {
        "project_status": ["Active"],
        "fiscal_years": [2024, 2025]
        # Remove project_type filter for broader results
    },
    "include_fields": [
        "project_title", "principal_investigators", "organization", "award_amount", "project_terms", "abstract_text", "project_num", "project_start_date", "project_end_date", "agency_ic_admin_abbreviation"
    ],
    "offset": 0,
    "limit": 20
}

headers = {"Content-Type": "application/json"}




# Remove include_fields from payload to get full project objects
payload_no_fields = {
    "criteria": payload["criteria"],
    "offset": payload["offset"],
    "limit": payload["limit"]
}
response = requests.post(API_URL, headers=headers, data=json.dumps(payload_no_fields))

if response.status_code == 200:
    data = response.json()
    projects = data.get('results', [])
    for i, proj in enumerate(projects[:3]):
        print(f"--- Project {i+1} ---\n", json.dumps(proj, indent=2))
    out_path = os.path.join(os.path.dirname(__file__), "nih_projects.json")
    with open(out_path, "w") as f:
        json.dump(projects, f, indent=2)
    print(f"Fetched {len(projects)} NIH projects.")
    if not projects or not any(proj for proj in projects if proj):
        print("WARNING: No populated project data returned. Check API or payload.")
else:
    print("Failed to fetch NIH projects:", response.status_code, response.text)
