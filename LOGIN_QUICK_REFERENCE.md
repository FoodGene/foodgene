# Login & Onboarding - Quick Reference

## 🚀 Quick Start (2 minutes)

### Start Backend
```bash
cd foodgene
python run_backend.py
```

### Start Frontend
```bash
cd foodgene/frontend
npm run dev
```

### Test the Flow
1. Visit http://localhost:5173
2. Click "Sign Up"
3. Enter: email@example.com / password123
4. Select diet type
5. Complete questionnaire
6. View dashboard

---

## 📋 User Flow

```
Login Page
    ↓
Sign Up / Sign In
    ↓
Diet Type Selection
    ↓
6-Step Questionnaire
    ↓
Dashboard (Personalized)
```

---

## 🔑 Key Features

### 1. Authentication
- Email-based signup/login
- Password validation (min 6 chars)
- JWT token-based auth
- Secure password hashing

### 2. Questionnaire (6 Steps)
1. Height & Weight
2. Age & Gender
3. Meal Type (Veg/Non-Veg/Vegan/Pescatarian)
4. Activity Level & Goal
5. Weekly Eating Habits
6. Allergies & Conditions

### 3. Dashboard
- User profile display
- Daily nutrition targets
- Macro distribution pie chart
- Quick action buttons

### 4. Nutrition Calculation
- Mifflin-St Jeor formula for BMR
- TDEE calculation with activity factors
- Customized macros based on diet type

---

## 📊 Nutrition Calculation

### Formula
```
BMR = 10×weight(kg) + 6.25×height(cm) - 5×age(years) + (5 for M, -161 for F)
TDEE = BMR × Activity Factor
Macros = TDEE × Percentage ÷ Calories per gram
```

### Example
```
User: 75kg, 175cm, 28yo, Male, Moderate Activity, Athlete Diet
BMR = 1708.75 kcal
TDEE = 2649 kcal
Protein: 231g | Carbs: 299g | Fats: 59g
```

---

## 🔌 API Endpoints

### Sign Up
```
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Submit Questionnaire
```
POST /api/questionnaire/submit
{
  "email": "user@example.com",
  "height": "175",
  "weight": "75",
  "age": "28",
  "gender": "Male",
  "mealType": "Non-Vegetarian",
  "activityLevel": "Moderate",
  "goal": "Gain Muscle",
  "weeklyEating": ["Chicken & Poultry", "Rice & Grains"],
  "allergies": "peanuts",
  "existingConditions": "none",
  "dietType": "athlete"
}
```

### Get User Profile
```
GET /api/user/profile?email=user@example.com
```

---

## 📁 File Structure

### Frontend
```
src/pages/
  ├── LoginPage.tsx          # Email/password auth
  ├── DietTypePage.tsx       # Diet selection
  ├── QuestionnairePage.tsx  # 6-step form
  └── DashboardPage.tsx      # Personalized dashboard
```

### Backend
```
backend/
  ├── app.py                 # FastAPI app + endpoints
  ├── schemas.py             # Pydantic models
  └── db.py                  # Database config
```

---

## 🧪 Test Credentials

```
Email: demo@foodgene.com
Password: demo123
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Email already registered" | Use login instead |
| "Invalid email or password" | Check credentials |
| Nutrition not calculating | Complete questionnaire |
| Pie chart not rendering | Install chart.js |
| Token expired | Login again |

---

## 📚 Documentation

- **Full API Docs**: `docs/LOGIN_AND_ONBOARDING_API.md`
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Architecture**: `docs/architecture.md`

---

## 🔒 Security

### Current
- ✅ Password hashing (SHA256)
- ✅ JWT tokens
- ✅ Email validation
- ✅ CORS configured

### Production TODO
- 🔒 Use bcrypt for hashing
- 🔒 Add refresh tokens
- 🔒 Rate limiting
- 🔒 HTTPS/TLS
- 🔒 Database integration
- 🔒 Email verification

---

## 📈 Nutrition Targets

### Athlete/Bodybuilder
- Protein: 35% of TDEE
- Carbs: 45% of TDEE
- Fats: 20% of TDEE

### Normal Diet
- Protein: 25% of TDEE
- Carbs: 50% of TDEE
- Fats: 25% of TDEE

---

## 🎯 Activity Factors

| Level | Factor |
|-------|--------|
| Sedentary | 1.2 |
| Light | 1.375 |
| Moderate | 1.55 |
| Active | 1.725 |
| Very Active | 1.9 |

---

## 💾 Data Storage

### Frontend (localStorage)
- `foodgene_token` - JWT token
- `foodgene_user_id` - User email
- `userEmail` - Email for questionnaire
- `dietType` - Selected diet type
- `userProfile` - Complete profile data

### Backend (In-Memory)
- `USERS` dict: email → {password_hash, profile, created_at}
- `PLANS` dict: plan_id → {plan, created_at}

---

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ to Vercel/Netlify
```

### Backend
```bash
# Deploy to Heroku/Railway
# Set env vars: CORS_ORIGINS, JWT_SECRET_KEY
```

---

## 📞 Support

1. Check troubleshooting section
2. Review API docs
3. Check browser console
4. Check backend logs

---

## ✅ Implementation Checklist

- [x] Email-based authentication
- [x] Sign up flow
- [x] Login flow
- [x] Diet type selection
- [x] 6-step questionnaire
- [x] Nutrition calculation
- [x] Dashboard display
- [x] Pie chart visualization
- [x] API endpoints
- [x] Error handling
- [x] Documentation

---

**Last Updated**: December 3, 2025  
**Version**: 1.0.0

