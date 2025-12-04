import requests
import json

response = requests.post('http://localhost:8000/api/generate-plan', json={
    "calories": 2000,
    "macros": {
        "protein_g": 150,
        "fat_g": 65,
        "carbs_g": 250
    },
    "profile": {
        "diet_pref": "Balanced",
        "allergies": []
    }
})

if response.status_code == 200:
    data = response.json()
    plan = data.get('plan', {})
    print(f"✓ Plan generated successfully")
    print(f"  Plan ID: {data.get('plan_id')}")
    print(f"  Has 'days': {'days' in plan}")
    print(f"  Has 'daily_meals': {'daily_meals' in plan}")
    
    # Check days structure
    days = plan.get('days', [])
    if days:
        day1 = days[0]
        print(f"\nFirst day structure:")
        print(f"  Keys: {list(day1.keys())}")
        print(f"  Day name: {day1.get('day')}")
        meals = day1.get('meals', [])
        print(f"  Number of meals: {len(meals)}")
        if meals:
            print(f"  First meal keys: {list(meals[0].keys())}")
    
    # Check grocery list
    grocery = plan.get('grocery_list', [])
    print(f"\nGrocery list:")
    print(f"  Type: {type(grocery)}")
    print(f"  Length: {len(grocery) if isinstance(grocery, list) else 'N/A'}")
    if grocery and isinstance(grocery, list):
        print(f"  First item type: {type(grocery[0])}")
        print(f"  First item: {json.dumps(grocery[0], indent=2)}")
else:
    print(f"✗ Error: {response.status_code}")
    print(response.text)
