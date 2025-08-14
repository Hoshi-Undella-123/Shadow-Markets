import requests
import zipfile
import io
import os
from time import sleep

def fetch_undp_bulk():
    url = "https://api.open.undp.org/api/download/undp-project-data.zip"
    max_retries = 5
    for attempt in range(max_retries):
        try:
            with requests.get(url, stream=True, timeout=120) as r:
                r.raise_for_status()
                content = io.BytesIO()
                for chunk in r.iter_content(chunk_size=1024*1024):
                    if chunk:
                        content.write(chunk)
                content.seek(0)
                with zipfile.ZipFile(content) as z:
                    z.extractall("Backend/undp-projects-json/")
                print("UNDP bulk project data downloaded and extracted.")
                return
        except Exception as e:
            print(f"Attempt {attempt+1} failed: {e}")
            sleep(5)
    print("Failed to download UNDP bulk data after retries.")

if __name__ == "__main__":
    fetch_undp_bulk()
