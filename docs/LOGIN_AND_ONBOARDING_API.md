# Login & Onboarding API Documentation

## Overview

This document describes the authentication and onboarding flow for FoodGene. The system supports email-based signup/login with a multi-step questionnaire to gather user health and dietary information.

## Authentication Flow

### 1. Sign Up (Create Account)

**Endpoint:** `POST /api/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_email": "user@example.com"
}
```

**Response (Error - 400):**
```json
{
  "detail": "Email already registered"
}
```

**Validation Rules:**
- Email must be valid format (contains @)
- Password must be at least 6 characters
- Email must not already exist in system

---

### 2. Login (Existing Account)

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_email": "user@example.com"
}
```

**Response (Error - 401):**
```json
{
  "detail": "Invalid email or password"
}
```

---

## Onboarding Flow

### 3. Submit Questionnaire

After login/signup, users are directed to select their diet type, then complete a multi-step questionnaire.

**Endpoint:** `POST /api/questionnaire/submit`

**Request:**
```json
{
  "email": "user@example.com",
  "height": "175",
  "weight": "75",
  "age": "28",
  "gender": "Male",
  "mealType": "Non-Vegetarian",
  "activityLevel": "Moderate",
  "goal": "Gain Muscle",
  "weeklyEating": [
    "Chicken & Poultry",
    "Rice & Grains",
    "Vegetables",
    "Dairy & Milk"
  ],
  "allergies": "peanuts",
  "existingConditions": "none",
  "dietType": "athlete"
}
```

**Response (Success - 200):**
```json
{
  "user_id": "user@example.com",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_email": "user@example.com",
  "profile": {
    "height": "175",
    "weight": "75",
    "age": "28",
    "gender": "Male",
    "mealType": "Non-Vegetarian",
    "activityLevel": "Moderate",
    "goal": "Gain Muscle",
    "weeklyEating": ["Chicken & Poultry", "Rice & Grains", "Vegetables", "Dairy & Milk"],
    "allergies": "peanuts",
    "existingConditions": "none",
    "dietType": "athlete",
    "updated_at": "2025-12-03T10:30:00"
  }
}
```

**Field Descriptions:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| email | string | User's email address | user@example.com |
| height | string | Height in centimeters | 175 |
| weight | string | Weight in kilograms | 75 |
| age | string | Age in years | 28 |
| gender | string | Gender (Male/Female/Other) | Male |
| mealType | string | Dietary preference | Vegetarian, Non-Vegetarian, Vegan, Pescatarian |
| activityLevel | string | Physical activity level | Sedentary, Light, Moderate, Active, Very Active |
| goal | string | Health/fitness goal | Lose Weight, Maintain, Gain Muscle, Improve Health |
| weeklyEating | array | Foods eaten weekly | Array of food categories |
| allergies | string | Food allergies (comma-separated) | peanuts, gluten, dairy |
| existingConditions | string | Medical conditions | diabetes, high blood pressure |
| dietType | string | Diet plan type | athlete, normal |

---

### 4. Get User Profile

**Endpoint:** `GET /api/user/profile?email=user@example.com`

**Response (Success - 200):**
```json
{
  "email": "user@example.com",
  "profile": {
    "height": "175",
    "weight": "75",
    "age": "28",
    "gender": "Male",
    "mealType": "Non-Vegetarian",
    "activityLevel": "Moderate",
    "goal": "Gain Muscle",
    "weeklyEating": ["Chicken & Poultry", "Rice & Grains", "Vegetables", "Dairy & Milk"],
    "allergies": "peanuts",
    "existingConditions": "none",
    "dietType": "athlete",
    "updated_at": "2025-12-03T10:30:00"
  },
  "created_at": "2025-12-03T10:00:00"
}
```

---

## Nutrition Calculation

The dashboard automatically calculates personalized nutrition targets based on questionnaire data using the **Mifflin-St Jeor Formula**:

### BMR Calculation:
- **Male:** BMR = 10×weight(kg) + 6.25×height(cm) - 5×age(years) + 5
- **Female:** BMR = 10×weight(kg) + 6.25×height(cm) - 5×age(years) - 161

### TDEE Calculation:
TDEE = BMR × Activity Factor

**Activity Factors:**
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

### Macronutrient Distribution:

**For Athlete/Bodybuilder Diet:**
- Protein: 35% of TDEE ÷ 4 cal/g
- Carbs: 45% of TDEE ÷ 4 cal/g
- Fats: 20% of TDEE ÷ 9 cal/g

**For Normal Diet:**
- Protein: 25% of TDEE ÷ 4 cal/g
- Carbs: 50% of TDEE ÷ 4 cal/g
- Fats: 25% of TDEE ÷ 9 cal/g

---

## Frontend Flow

### Step 1: Login/Sign Up
- User navigates to `/login`
- Chooses between "Sign In" or "Sign Up"
- Enters email and password
- System validates and returns JWT token

### Step 2: Diet Type Selection
- User redirected to `/diet-type`
- Selects between "Athlete/Bodybuilder" or "Normal Diet"
- Selection stored in localStorage

### Step 3: Multi-Step Questionnaire
- User redirected to `/questionnaire`
- 6-step form:
  1. Body Measurements (height, weight)
  2. Personal Info (age, gender)
  3. Meal Preference (veg/non-veg)
  4. Activity & Goal
  5. Weekly Eating Habits
  6. Allergies & Conditions

### Step 4: Dashboard
- User redirected to `/dashboard`
- Displays personalized nutrition targets
- Shows macro distribution pie chart
- Lists quick action buttons

---

## Error Handling

### Common Error Responses:

**400 Bad Request:**
```json
{
  "detail": "Invalid email format"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Invalid email or password"
}
```

**404 Not Found:**
```json
{
  "detail": "User not found"
}
```

---

## Data Storage

### In-Memory Storage (Development):
- User data stored in `USERS` dictionary
- Key: email address
- Value: {password_hash, profile, created_at}

### Production Considerations:
- Implement database (PostgreSQL recommended)
- Hash passwords with bcrypt
- Use JWT with expiration
- Implement refresh tokens
- Add rate limiting on auth endpoints

---

## Security Best Practices

1. **Password Security:**
   - Minimum 6 characters (consider 8+ for production)
   - Hash with SHA256 (use bcrypt in production)
   - Never store plain text passwords

2. **Token Security:**
   - JWT tokens expire after 30 minutes
   - Tokens stored in localStorage (consider httpOnly cookies)
   - Validate token on protected routes

3. **Data Privacy:**
   - Validate all inputs
   - Sanitize email addresses
   - Don't expose user existence in error messages

4. **CORS:**
   - Configure allowed origins
   - Restrict to production domains

---

## Testing

### Test Credentials:
```
Email: demo@foodgene.com
Password: demo123
```

### Test Scenarios:

1. **Sign Up Flow:**
   - Create new account with valid email/password
   - Verify token returned
   - Verify user can access dashboard

2. **Login Flow:**
   - Login with existing credentials
   - Verify token returned
   - Verify redirect to dashboard

3. **Questionnaire:**
   - Complete all 6 steps
   - Verify profile data saved
   - Verify nutrition calculations correct

4. **Dashboard:**
   - Verify profile data displayed
   - Verify nutrition targets calculated
   - Verify pie chart renders correctly

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/signup | Create new account |
| POST | /api/auth/login | Login to account |
| POST | /api/questionnaire/submit | Save questionnaire data |
| GET | /api/user/profile | Get user profile |
| POST | /api/generate-plan | Generate meal plan |
| POST | /api/swap-meal | Replace meal in plan |
| POST | /api/email-plan | Email meal plan |

---

## Example Complete Flow

```
1. User visits http://localhost:5173/login
2. Clicks "Sign Up"
3. Enters email: john@example.com, password: secure123
4. POST /api/auth/signup → receives token
5. Redirected to /diet-type
6. Selects "Athlete/Bodybuilder"
7. Redirected to /questionnaire
8. Completes 6-step form
9. POST /api/questionnaire/submit → receives profile
10. Redirected to /dashboard
11. Dashboard displays:
    - User profile (height, weight, age, etc.)
    - Daily nutrition targets (2500 cal, 200g protein, etc.)
    - Macro distribution pie chart
    - Quick action buttons
```

---

## Version History

- **v1.0.0** (Dec 3, 2025): Initial implementation
  - Email-based authentication
  - Multi-step questionnaire
  - Nutrition calculation
  - Dashboard with pie chart

