# FoodGene - Complete Setup Guide

## What's Been Implemented

✅ **Complete UI redesign** - Matches the screenshot designs  
✅ **Backend API** - All 3 endpoints fully implemented  
✅ **Frontend Components** - Header, Hero, Generator, MealPlan  
✅ **API Connections** - All forms connected to backend  
✅ **Features:**
  - Generate personalized meal plans
  - Swap individual meals
  - Export plans as PDF
  - Email plans to users
  - Calculate macros based on user metrics

## Quick Start (3 Steps)

### Step 1: Get API Keys (5 minutes)

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy it (format: `sk-...`)

**SendGrid API Key (Optional):**
1. Go to https://sendgrid.com
2. Sign up free
3. Get API key (format: `SG...`)

### Step 2: Start Backend (PowerShell)

```powershell
cd 'c:\Users\focus\Desktop\FOOD\foodgene'
$env:OPENAI_API_KEY = "sk-your-key-here"
$env:SENDGRID_KEY = "SG.your-key-here"
C:/Python313/python.exe -m uvicorn backend.app:app --reload --port 8000
```

Wait for output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

### Step 3: Start Frontend (NEW PowerShell)

```powershell
cd 'c:\Users\focus\Desktop\FOOD\foodgene\frontend'
npm run dev
```

Wait for output:
```
VITE v7.2.2  ready in XXX ms
➜  Local:   http://localhost:5175/
```

## Open in Browser

**http://localhost:5175**

## How to Use

### 1. **Generate Meal Plan**
- Fill in your height, weight, age, gender
- Select activity level, goal (Maintain/Lose Weight/Gain Muscle)
- Choose diet preference (Balanced/Vegetarian/Vegan/Keto/Low Carb)
- Add allergies if any
- Click **"Generate Plan"**
- Wait 3-5 seconds for AI to create your plan
- Plan shows:
  - 7-day meal schedule
  - Calorie counts per meal
  - Macro breakdown (Protein, Carbs, Fat)
  - Macro split pie chart
  - Organized grocery list

### 2. **Swap Meals**
- Click **"Swap"** button on any meal
- AI generates alternative meal with similar macros
- Meal updates instantly (2-3 seconds)

### 3. **Export as PDF**
- Click **"Export as PDF"** button
- Downloads meal plan with all details
- Ready to print or share

### 4. **Email Plan**
- Enter your email address
- Click **"Send"**
- Meal plan arrives in your inbox (1-2 seconds)
- Requires SendGrid key

## Features Explained

### Calorie Calculation
Uses Mifflin-St Jeor formula:
- **Your TDEE** (Total Daily Energy Expenditure) calculated
- Adjusts for activity level
- Shows in real-time on macro chart

### Macro Distribution
Varies by goal:
- **Maintain**: 30% protein, 45% carbs, 25% fat
- **Lose Weight**: 35% protein, 40% carbs, 25% fat
- **Gain Muscle**: 35% protein, 45% carbs, 20% fat

### Grocery List
- Automatically categorized (proteins, vegetables, grains, dairy, etc.)
- Quantities calculated for 7 days
- Easy to take shopping

## API Documentation

Access at: **http://localhost:8000/docs**

Shows:
- All endpoints with detailed specs
- Request/response schemas
- Try-it-out feature

## Troubleshooting

### "OpenAI API key not found"
**Fix:** Run this BEFORE starting backend:
```powershell
$env:OPENAI_API_KEY = "sk-actual-key"
```

### "Port 8000 already in use"
**Fix:** Use different port:
```powershell
C:/Python313/python.exe -m uvicorn backend.app:app --reload --port 8001
```

### "Port 5175 already in use"
**Fix:** Vite will auto-try next port (5176, 5177, etc.)

### "Plan generation failed"
**Cause:** OpenAI API not responding or quota exceeded  
**Fix:** Check your API key has credits

### "Email failed to send"
**Cause:** SendGrid key not set or invalid  
**Fix:** Verify SENDGRID_KEY is set correctly

### "Frontend shows blank page"
**Fix:** Hard refresh browser
- Windows: Ctrl+Shift+Delete or Ctrl+F5
- Mac: Cmd+Shift+Delete or Cmd+Shift+R

## File Structure

```
foodgene/
├── backend/
│   └── app.py              # 3 endpoints: generate-plan, swap-meal, email-plan
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Header.jsx      # Nav bar with login
│       │   ├── Hero.jsx        # Feature highlights
│       │   ├── Generator.jsx   # Form + macro chart
│       │   └── MealPlan.jsx    # 7-day plan display
│       ├── styles/
│       │   ├── Header.css
│       │   ├── Hero.css
│       │   ├── Generator.css
│       │   └── MealPlan.css
│       ├── App.jsx         # Main routing
│       └── index.css       # Global styles
├── ml/
│   ├── llm.py              # OpenAI integration
│   └── requirements.txt     # Python dependencies
└── SETUP_AND_RUN.md        # This file
```

## Technology Stack

**Backend:**
- FastAPI 0.104.1
- Python 3.13
- Uvicorn server
- OpenAI GPT-3.5-turbo
- SendGrid email

**Frontend:**
- React 19.2.0
- Vite 7.2.2
- Chart.js (macro pie chart)
- html2pdf.js (PDF export)

## Environment Variables

Set these in PowerShell before starting backend:

```powershell
# Required for plan generation
$env:OPENAI_API_KEY = "sk-..."

# Optional for email sending
$env:SENDGRID_KEY = "SG...."
```

## API Endpoints

### Generate Plan
**POST** `/api/generate-plan`

Input:
```json
{
  "calories": 2000,
  "macros": {
    "protein_g": 150,
    "fat_g": 65,
    "carbs_g": 250
  },
  "profile": {
    "diet_pref": "balanced",
    "allergies": []
  }
}
```

Output:
```json
{
  "plan_id": "uuid",
  "plan": {
    "days": [
      {
        "day": "Mon",
        "meals": [
          {
            "name": "Chicken Breast",
            "serving": "150g",
            "cal": 250,
            "protein_g": 45,
            "carbs_g": 0,
            "fat_g": 5
          }
        ]
      }
    ],
    "grocery_list": [
      {
        "category": "protein",
        "items": [
          {"name": "chicken", "quantity": "1.5 kg"}
        ]
      }
    ]
  }
}
```

### Swap Meal
**POST** `/api/swap-meal`

Input:
```json
{
  "plan_id": "uuid",
  "day": "Mon",
  "meal_index": 0,
  "profile": {
    "diet_pref": "balanced",
    "allergies": []
  }
}
```

### Email Plan
**POST** `/api/email-plan`

Input:
```json
{
  "email": "user@example.com",
  "plan_id": "uuid"
}
```

## Example Workflow

1. User fills form: 180cm, 75kg, 30yo, Male, Moderate activity, Maintain goal
2. Frontend calculates: TDEE = 2400 kcal/day
3. Frontend calculates macros: 180g protein, 270g carbs, 65g fat
4. User clicks "Generate Plan"
5. Frontend sends POST to `/api/generate-plan`
6. Backend calls OpenAI with meal constraints
7. OpenAI returns 7-day plan in JSON
8. Plan displays in 7-day grid
9. User can swap meals, export PDF, or email plan

## Support

**API Docs:** http://localhost:8000/docs  
**Frontend Dev Tools:** Press F12 in browser  
**Backend Logs:** Check terminal window running the server

---

**FoodGene** - Personalized Nutrition Made Simple 🥗
