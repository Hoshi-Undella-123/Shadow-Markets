#!/usr/bin/env python3
"""
Simple test script to verify the backend is working
"""

import requests
import json
from datetime import datetime


def test_backend():
    """Test the backend API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Research Matching Backend API")
    print("=" * 50)
    
    # Test basic endpoints
    endpoints = [
        ("/", "Root endpoint"),
        ("/health", "Health check"),
        ("/api/v1/status", "API status"),
        ("/api/v1/research/", "Research papers"),
        ("/api/v1/researchers/", "Researchers"),
        ("/api/v1/funders/", "Funders"),
        ("/api/v1/matches/", "Matches"),
        ("/api/v1/research/stats/", "Research stats"),
        ("/api/v1/researchers/stats/", "Researcher stats"),
        ("/api/v1/funders/stats/", "Funder stats"),
        ("/api/v1/matches/stats/", "Match stats"),
    ]
    
    for endpoint, description in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code == 200:
                print(f"✅ {description}: OK")
                if "stats" in endpoint:
                    data = response.json()
                    print(f"   📊 Data: {json.dumps(data, indent=2)}")
            else:
                print(f"❌ {description}: Failed (Status: {response.status_code})")
        except requests.exceptions.ConnectionError:
            print(f"❌ {description}: Connection failed (Is the server running?)")
        except Exception as e:
            print(f"❌ {description}: Error - {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎯 Backend Test Complete!")
    print(f"📅 Test run at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    test_backend() 