# FoodGene Login & Onboarding Implementation Guide

## Overview

This guide explains the complete implementation of the login, signup, and onboarding flow for FoodGene, including the personalized dashboard with nutrition calculations and visualization.

## Features Implemented

### 1. ✅ Email-Based Authentication
- **Sign Up**: Create new account with email and password
- **Login**: Authenticate existing users
- **Password Validation**: Minimum 6 characters
- **Email Validation**: Proper email format checking
- **JWT Tokens**: Secure token-based authentication

### 2. ✅ Multi-Step Questionnaire
- **Step 1**: Body Measurements (height, weight)
- **Step 2**: Personal Information (age, gender)
- **Step 3**: Meal Preference (veg/non-veg/vegan/pescatarian)
- **Step 4**: Activity Level & Goal
- **Step 5**: Weekly Eating Habits (multi-select)
- **Step 6**: Allergies & Health Conditions

### 3. ✅ Diet Type Selection
- **Athlete/Bodybuilder**: High protein, optimized for muscle building
- **Normal Diet**: Balanced nutrition for general health

### 4. ✅ Personalized Dashboard
- **User Profile Display**: All questionnaire data
- **Nutrition Targets**: Calculated based on Mifflin-St Jeor formula
- **Macro Distribution**: Pie chart showing protein/carbs/fats breakdown
- **Quick Actions**: Links to other features (meal plan, scan, etc.)
- **Health Information**: Allergies and conditions summary

### 5. ✅ Nutrition Calculation Engine
- **BMR Calculation**: Basal Metabolic Rate using Mifflin-St Jeor formula
- **TDEE Calculation**: Total Daily Energy Expenditure with activity factors
- **Macro Distribution**: Customized based on diet type
- **Real-time Updates**: Calculations update based on user data

---

## Architecture

### Frontend Structure

```
frontend/src/
├── pages/
│   ├── LoginPage.tsx          # Email/password login & signup
│   ├── DietTypePage.tsx       # Diet type selection
│   ├── QuestionnairePage.tsx  # Multi-step questionnaire
│   └── DashboardPage.tsx      # Personalized dashboard
├── context/
│   └── AuthContext.tsx        # Authentication state management
├── services/
│   └── api.ts                 # API client
└── components/
    ├── Navbar.tsx             # Navigation bar
    ├── ProtectedRoute.tsx      # Route protection
    └── ErrorMessage.tsx        # Error display
```

### Backend Structure

```
backend/
├── app.py                     # FastAPI application
├── schemas.py                 # Pydantic models
├── db.py                      # Database configuration
└── core/
    └── auth.py                # JWT authentication
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/signup | Create new account |
| POST | /api/auth/login | Login to account |
| POST | /api/questionnaire/submit | Save questionnaire |
| GET | /api/user/profile | Get user profile |

---

## User Flow

### Complete Journey

```
1. User visits http://localhost:5173
   ↓
2. Clicks "Login" or "Sign Up"
   ↓
3. LoginPage: Email/Password Entry
   - New users: Click "Sign Up"
   - Existing users: Click "Sign In"
   ↓
4. POST /api/auth/signup or /api/auth/login
   - Validate credentials
   - Return JWT token
   ↓
5. DietTypePage: Select Diet Type
   - "💪 Athlete/Bodybuilder" → High protein diet
   - "🥗 Normal Diet" → Balanced diet
   ↓
6. QuestionnairePage: 6-Step Form
   - Step 1: Height (cm), Weight (kg)
   - Step 2: Age, Gender
   - Step 3: Meal Type (Veg/Non-Veg/Vegan/Pescatarian)
   - Step 4: Activity Level, Goal
   - Step 5: Weekly Eating Habits (multi-select)
   - Step 6: Allergies, Health Conditions
   ↓
7. POST /api/questionnaire/submit
   - Save all profile data
   - Return updated token
   ↓
8. DashboardPage: Personalized Dashboard
   - Display user profile
   - Show nutrition targets
   - Display macro pie chart
   - Quick action buttons
```

---

## Nutrition Calculation Details

### Mifflin-St Jeor Formula

**Step 1: Calculate BMR (Basal Metabolic Rate)**

For Males:
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
```

For Females:
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
```

**Step 2: Calculate TDEE (Total Daily Energy Expenditure)**

```
TDEE = BMR × Activity Factor
```

Activity Factors:
- Sedentary (little/no exercise): 1.2
- Light (1-3 days/week): 1.375
- Moderate (3-5 days/week): 1.55
- Active (6-7 days/week): 1.725
- Very Active (intense daily): 1.9

**Step 3: Calculate Macronutrients**

For Athlete/Bodybuilder:
- Protein: 35% of TDEE ÷ 4 cal/g
- Carbs: 45% of TDEE ÷ 4 cal/g
- Fats: 20% of TDEE ÷ 9 cal/g

For Normal Diet:
- Protein: 25% of TDEE ÷ 4 cal/g
- Carbs: 50% of TDEE ÷ 4 cal/g
- Fats: 25% of TDEE ÷ 9 cal/g

### Example Calculation

**User Profile:**
- Height: 175 cm
- Weight: 75 kg
- Age: 28 years
- Gender: Male
- Activity Level: Moderate
- Diet Type: Athlete

**Calculation:**
```
BMR = 10(75) + 6.25(175) - 5(28) + 5
    = 750 + 1093.75 - 140 + 5
    = 1708.75 kcal

TDEE = 1708.75 × 1.55 = 2648.56 ≈ 2649 kcal

Protein = (2649 × 0.35) ÷ 4 = 231.4 ≈ 231g
Carbs = (2649 × 0.45) ÷ 4 = 298.6 ≈ 299g
Fats = (2649 × 0.20) ÷ 9 = 58.9 ≈ 59g
```

---

## Data Models

### User Profile (Stored in localStorage)

```typescript
{
  height: string;           // cm
  weight: string;           // kg
  age: string;              // years
  gender: string;           // Male/Female/Other
  mealType: string;         // Vegetarian/Non-Vegetarian/Vegan/Pescatarian
  activityLevel: string;    // Sedentary/Light/Moderate/Active/Very Active
  goal: string;             // Lose Weight/Maintain/Gain Muscle/Improve Health
  weeklyEating: string[];   // Array of food categories
  allergies: string;        // Comma-separated
  existingConditions: string;
  dietType: string;         // athlete/normal
  updated_at: string;       // ISO timestamp
}
```

### Nutrition Targets (Calculated)

```typescript
{
  calories: number;         // Daily calorie target
  protein: number;          // Grams
  carbs: number;            // Grams
  fats: number;             // Grams
}
```

---

## Frontend Components

### LoginPage.tsx

**Features:**
- Toggle between Sign Up and Sign In
- Email validation
- Password confirmation for sign up
- Error handling
- Loading states

**Key Functions:**
- `validateEmail()`: Validates email format
- `handleSubmit()`: Handles both signup and login

### DietTypePage.tsx

**Features:**
- Two diet type options
- Visual cards with descriptions
- Stores selection in localStorage

### QuestionnairePage.tsx

**Features:**
- 6-step form with progress bar
- Step validation
- Back/Next navigation
- Form data persistence
- API submission

### DashboardPage.tsx

**Features:**
- User profile display
- Nutrition calculation
- Pie chart visualization
- Quick action buttons
- Logout functionality

---

## Backend Implementation

### Authentication (app.py)

```python
@app.post("/api/auth/signup")
async def signup_user(request: SignupRequest):
    # Validate email and password
    # Hash password
    # Create user in USERS dict
    # Return JWT token

@app.post("/api/auth/login")
async def login_user(request: SignupRequest):
    # Validate credentials
    # Verify password hash
    # Return JWT token
```

### Questionnaire (app.py)

```python
@app.post("/api/questionnaire/submit")
async def submit_questionnaire(request: QuestionnaireRequest):
    # Save profile data to USERS[email]["profile"]
    # Return profile data with token
```

### User Profile (app.py)

```python
@app.get("/api/user/profile")
async def get_user_profile(email: str):
    # Retrieve user profile from USERS dict
    # Return profile data
```

---

## Security Considerations

### Current Implementation (Development)

- ✅ Password hashing with SHA256
- ✅ JWT token-based authentication
- ✅ Email validation
- ✅ Password minimum length (6 chars)
- ✅ CORS configuration
- ✅ Error handling without exposing internals

### Production Recommendations

- 🔒 Use bcrypt for password hashing (not SHA256)
- 🔒 Implement refresh tokens
- 🔒 Add rate limiting on auth endpoints
- 🔒 Use HTTPS/TLS
- 🔒 Implement database with proper indexing
- 🔒 Add email verification
- 🔒 Implement password reset flow
- 🔒 Add 2FA support
- 🔒 Use httpOnly cookies for tokens
- 🔒 Implement CSRF protection

---

## Testing

### Manual Testing Checklist

#### Sign Up Flow
- [ ] Navigate to /login
- [ ] Click "Sign Up"
- [ ] Enter valid email and password
- [ ] Verify account created
- [ ] Verify redirected to /diet-type

#### Login Flow
- [ ] Navigate to /login
- [ ] Click "Sign In"
- [ ] Enter valid credentials
- [ ] Verify redirected to /dashboard

#### Questionnaire Flow
- [ ] Complete all 6 steps
- [ ] Verify validation on each step
- [ ] Verify data saved to localStorage
- [ ] Verify redirected to /dashboard

#### Dashboard Display
- [ ] Verify profile data displayed
- [ ] Verify nutrition targets calculated
- [ ] Verify pie chart renders
- [ ] Verify quick action buttons work
- [ ] Verify logout button works

### Test Credentials

```
Email: demo@foodgene.com
Password: demo123
```

---

## Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, or similar
```

### Backend Deployment

```bash
# Deploy ml/ folder to Heroku, Railway, or similar
# Set environment variables:
# - CORS_ORIGINS
# - DATABASE_URL (for production)
# - JWT_SECRET_KEY
```

### Environment Variables

**Frontend (.env):**
```
REACT_APP_API_URL=https://api.foodgene.com
```

**Backend (.env):**
```
CORS_ORIGINS=https://foodgene.com,https://www.foodgene.com
JWT_SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/foodgene
```

---

## Troubleshooting

### Issue: "Email already registered"
- **Cause**: User already has account
- **Solution**: Use login instead of signup

### Issue: "Invalid email or password"
- **Cause**: Wrong credentials
- **Solution**: Check email and password, try signup if new user

### Issue: Nutrition not calculating
- **Cause**: Missing questionnaire data
- **Solution**: Complete questionnaire first

### Issue: Pie chart not rendering
- **Cause**: Chart.js not installed
- **Solution**: Run `npm install chart.js react-chartjs-2`

### Issue: Token expired
- **Cause**: Session timeout (30 minutes)
- **Solution**: Login again

---

## Future Enhancements

### Phase 2
- [ ] Database integration (PostgreSQL)
- [ ] Email verification
- [ ] Password reset flow
- [ ] User profile editing
- [ ] Meal plan generation
- [ ] Progress tracking

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Social features
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Integration with fitness trackers

### Phase 4
- [ ] Wearable integration
- [ ] Community features
- [ ] Subscription model
- [ ] Admin dashboard
- [ ] Advanced reporting

---

## File Changes Summary

### New Files Created
- `foodgene/docs/LOGIN_AND_ONBOARDING_API.md` - API documentation
- `foodgene/IMPLEMENTATION_GUIDE.md` - This file

### Modified Files
- `foodgene/frontend/src/pages/LoginPage.tsx` - Email-based auth
- `foodgene/frontend/src/pages/LoginPage.css` - Updated styling
- `foodgene/frontend/src/pages/DashboardPage.tsx` - Enhanced dashboard
- `foodgene/frontend/src/pages/Pages.css` - New dashboard styles
- `foodgene/backend/app.py` - New auth endpoints

---

## Quick Start

### 1. Start Backend
```bash
cd foodgene
python run_backend.py
# Backend runs on http://localhost:8000
```

### 2. Start Frontend
```bash
cd foodgene/frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Test Flow
1. Visit http://localhost:5173
2. Click "Login" → "Sign Up"
3. Enter email: test@example.com, password: test123
4. Select diet type
5. Complete questionnaire
6. View personalized dashboard

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation: `docs/LOGIN_AND_ONBOARDING_API.md`
3. Check browser console for errors
4. Check backend logs for API errors

---

## Version History

- **v1.0.0** (Dec 3, 2025): Initial implementation
  - Email-based authentication
  - Multi-step questionnaire
  - Nutrition calculation
  - Dashboard with pie chart
  - Complete documentation

