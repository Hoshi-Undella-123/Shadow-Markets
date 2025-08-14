import requests
import zipfile
import io
import os

def fetch_undp_bulk():
    url = "https://api.open.undp.org/api/download/undp-project-data.zip"
    resp = requests.get(url)
    if resp.status_code != 200:
        print("Failed to fetch UNDP bulk data")
        return
    z = zipfile.ZipFile(io.BytesIO(resp.content))
    z.extractall("Backend/undp-projects-json/")
    print("UNDP bulk project data downloaded and extracted.")

if __name__ == "__main__":
    fetch_undp_bulk()
