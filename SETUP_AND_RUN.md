# FoodGene Setup & Run Instructions

## Prerequisites

✅ Python 3.13 installed  
✅ Node.js 20+ installed  
✅ npm installed  
✅ All Python packages installed  
✅ All npm packages installed  

## What You Need

### 1. OpenAI API Key (Required for meal generation)
Get from: https://platform.openai.com/api-keys

### 2. SendGrid API Key (Required for email)
Get from: https://sendgrid.com/

## Step-by-Step Setup

### Step 1: Set Environment Variables (PowerShell)

```powershell
# Open PowerShell and run these commands
$env:OPENAI_API_KEY = "sk-your-key-here"
$env:SENDGRID_KEY = "SG.your-key-here"
```

**Important:** These are set only for the current PowerShell session. If you close it, you'll need to set them again.

### Step 2: Start Backend Server

**In PowerShell:**
```powershell
cd 'c:\Users\focus\Desktop\FOOD\foodgene'
C:/Python313/python.exe -m uvicorn backend.app:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process [XXXXX]
INFO:     Application startup complete.
```

### Step 3: Start Frontend Server (NEW PowerShell)

**In NEW PowerShell:**
```powershell
cd 'c:\Users\focus\Desktop\FOOD\foodgene\frontend'
npm run dev
```

**Expected output:**
```
VITE v7.2.2  ready in XXX ms
➜  Local:   http://localhost:5175/
```

### Step 4: Open Browser

Go to: **http://localhost:5175**

## Features You Can Test

### 1. Generate Meal Plan ✅
- Set calories (slider: 1200-3500)
- Click "Generate Plan"
- Wait 3-5 seconds (OpenAI API call)
- View 7-day meal plan with:
  - Daily meals (Breakfast, Lunch, Dinner)
  - Calorie counts
  - Macro breakdown (Protein, Carbs, Fat)
  - Weekly calorie chart
  - Organized grocery list

### 2. Swap Meals ✅
- Click "Swap" button on any meal
- AI generates alternative meal with similar nutrition
- Updated meal appears instantly

### 3. Export PDF ✅
- Click "Export as PDF"
- Downloads meal plan with all details
- Print-friendly formatting

### 4. Email Plan ✅
- Enter your email
- Click "Send"
- Meal plan is emailed to you
- Requires SendGrid API key

### 5. Theme Toggle ✅
- Click ☀️ to switch to dark mode
- Click 🌙 to switch to light mode
- Preference is saved

## Troubleshooting

### "Internal server error" on Frontend
**Cause:** Backend not running or API key not set
**Fix:** 
1. Check backend terminal - should show "Application startup complete"
2. For plan generation: set OPENAI_API_KEY before starting backend

### "OpenAI API key not found"
**Cause:** Environment variable not set
**Fix:** Run this in PowerShell BEFORE starting backend:
```powershell
$env:OPENAI_API_KEY = "sk-your-actual-key"
C:/Python313/python.exe -m uvicorn backend.app:app --reload --port 8000
```

### "Port 8000 already in use"
**Cause:** Another process using port 8000
**Fix:** Run backend on different port:
```powershell
C:/Python313/python.exe -m uvicorn backend.app:app --reload --port 8001
```
Then update frontend config to use port 8001

### "Port 5175 already in use"
**Cause:** Another process using port 5175
**Fix:** Vite will automatically try next port (5176, 5177, etc.)

### Frontend shows blank or old content
**Fix:** Hard refresh browser
- Windows: Ctrl+Shift+Delete or Ctrl+F5
- Mac: Cmd+Shift+Delete or Cmd+Shift+R

## API Endpoints

All available at: **http://localhost:8000/docs**

### Generate 7-Day Meal Plan
```
POST /api/generate-plan
```

### Swap a Meal
```
POST /api/swap-meal
```

### Email the Plan
```
POST /api/email-plan
```

## File Structure

```
foodgene/
├── backend/              # FastAPI app
├── frontend/             # React app
├── ml/                   # ML models and LLM integration
├── run_backend.py        # Backend startup script
└── START.bat             # Windows batch starter
```

## Quick Start (Alternative)

If you have API keys, you can use:

```powershell
cd 'c:\Users\focus\Desktop\FOOD\foodgene'
$env:OPENAI_API_KEY = "sk-..."
$env:SENDGRID_KEY = "SG...."
START.bat
```

This opens both backend and frontend in separate windows.

## API Key Sources

### OpenAI
1. Go to https://platform.openai.com
2. Click on your profile → API keys
3. Create new secret key
4. Copy it (you'll only see it once!)
5. Format: `sk-...`

### SendGrid
1. Go to https://sendgrid.com
2. Sign up for free account
3. Go to Settings → API Keys
4. Create new API key
5. Copy it
6. Format: `SG...`

---

**Need Help?**
- Backend docs: http://localhost:8000/docs
- Frontend console: F12 in browser
- Check terminal output for errors

