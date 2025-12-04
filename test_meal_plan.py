#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Signup
print("=" * 50)
print("TEST 1: Signup")
print("=" * 50)
response = requests.post(f"{BASE_URL}/api/auth/signup", json={
    "email": "test@example.com",
    "password": "password123"
})
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test 2: Generate Meal Plan
print("\n" + "=" * 50)
print("TEST 2: Generate Meal Plan")
print("=" * 50)
response = requests.post(f"{BASE_URL}/api/generate-plan", json={
    "calories": 2000,
    "macros": {
        "protein_g": 150,
        "fat_g": 65,
        "carbs_g": 250
    },
    "profile": {
        "diet_pref": "Balanced",
        "allergies": ["peanuts"]
    }
})
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Plan ID: {data.get('plan_id')}")
    if 'plan' in data:
        plan = data['plan']
        print(f"Plan structure: {list(plan.keys())}")
else:
    print(f"Error: {response.text}")

print("\n✓ Test complete!")
