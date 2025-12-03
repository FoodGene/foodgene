from backend.app import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Test signup
print("Testing signup...")
response = client.post('/api/auth/signup', json={'email': 'test@example.com', 'password': 'password123'})
print(f'Signup status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print(f'Token received: {data.get("access_token", "")[:20]}...')
    print(f'User email: {data.get("user_email")}')
else:
    print(f'Error: {response.json()}')

# Test login
print("\nTesting login...")
response = client.post('/api/auth/login', json={'email': 'test@example.com', 'password': 'password123'})
print(f'Login status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print(f'Login successful, token: {data.get("access_token", "")[:20]}...')
else:
    print(f'Error: {response.json()}')

# Test questionnaire submission
print("\nTesting questionnaire submission...")
response = client.post('/api/questionnaire/submit', json={
    'email': 'test@example.com',
    'height': '175',
    'weight': '75',
    'age': '25',
    'gender': 'Male',
    'mealType': 'Non-Vegetarian',
    'activityLevel': 'Moderate',
    'goal': 'Maintain',
    'weeklyEating': ['Chicken & Poultry', 'Rice & Grains'],
    'allergies': 'none',
    'existingConditions': 'none',
    'dietType': 'normal'
})
print(f'Questionnaire status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print(f'Profile saved successfully')
    print(f'User ID: {data.get("user_id")}')
else:
    print(f'Error: {response.json()}')
