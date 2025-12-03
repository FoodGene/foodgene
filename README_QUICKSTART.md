# FoodGene - Meal Plan Generator 🍽️

A full-stack web application for generating personalized meal plans using OpenAI, with PDF export and email capabilities.

## Quick Start

### Option 1: Automatic (Recommended)
**Windows:**
```bash
cd c:\Users\focus\Desktop\FOOD\foodgene
START.bat
```

This will:
- Start the backend API on `http://localhost:8000`
- Start the frontend on `http://localhost:5175`
- Open both in new terminal windows

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd c:\Users\focus\Desktop\FOOD\foodgene
C:\Python313\python.exe run_backend.py
```

Expected output:
```
Starting FoodGene Backend API...
API Title: FoodGene API
API Version: 1.0.0
Listening on http://0.0.0.0:8000
API Docs available at http://localhost:8000/docs
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\focus\Desktop\FOOD\foodgene\frontend
npm run dev
```

Expected output:
```
VITE v7.2.2  ready in XXXX ms
➜  Local:   http://localhost:5175/
```

## URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:5175 | Web application |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Swagger documentation |
| ReDoc | http://localhost:8000/redoc | Alternative API docs |

## Features

### 1. Generate Meal Plan
- Adjust calorie slider (1200-3500 calories/day)
- Click "Generate Plan" to create a 7-day meal plan
- Requires: `OPENAI_API_KEY` environment variable

### 2. View Meal Plan
- 7-day meal grid with breakfast, lunch, dinner
- Macro breakdown (protein, carbs, fat) for each meal
- Weekly calorie chart visualization
- Categorized grocery list

### 3. Swap Meals
- Click "Swap Meal" on any meal to replace it
- AI generates alternative meal with similar macros
- Updates plan instantly

### 4. Export PDF
- Click "Export as PDF" button
- Downloads meal plan with all details
- Print-friendly formatting
- No buttons/controls in PDF

### 5. Email Plan
- Enter email address
- Click "Send"
- Meal plan emailed as HTML document
- Requires: `SENDGRID_KEY` environment variable

### 6. Theme Toggle
- Click ☀️/🌙 to switch light/dark theme
- Preference saved to browser localStorage
- Persists on page reload

## Environment Variables

### Required for Features

**For Backend:**
```bash
# Set these before starting the backend

# OpenAI API Key (for meal generation)
set OPENAI_API_KEY=sk-...

# SendGrid API Key (for email sending)
set SENDGRID_KEY=SG....
```

**Example (PowerShell):**
```powershell
$env:OPENAI_API_KEY = "sk-your-key-here"
$env:SENDGRID_KEY = "SG.your-key-here"
python.exe run_backend.py
```

## Project Structure

```
foodgene/
├── backend/                    # FastAPI application
│   ├── app.py                 # Main app with 3 meal plan endpoints
│   ├── core/
│   │   ├── auth.py            # JWT authentication
│   │   └── models.py          # Database models
│   ├── db.py                  # Database initialization
│   ├── schemas.py             # Request/Response schemas
│   └── __init__.py
│
├── ml/
│   ├── llm.py                 # OpenAI meal generation (NEW)
│   ├── requirements.txt        # Python dependencies
│   └── ...
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlanView.jsx   # Main meal plan display (NEW)
│   │   │   ├── MealItem.jsx   # Individual meal (NEW)
│   │   │   └── Controls.jsx   # Controls panel (NEW)
│   │   ├── styles/
│   │   │   ├── PlanView.css   # Plan styles (NEW)
│   │   │   ├── MealItem.css   # Meal styles (NEW)
│   │   │   └── Controls.css   # Controls styles (NEW)
│   │   ├── App.jsx            # Main app component
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   └── ...
│
├── run_backend.py             # Backend startup script (NEW)
├── START.bat                  # Windows batch startup (NEW)
├── MEAL_PLAN_SETUP.md        # Setup guide
├── IMPLEMENTATION_NOTES.md    # Technical details
└── README.md                  # This file
```

## API Endpoints

### 1. Generate Plan
**POST** `/api/generate-plan`

Request:
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

Response:
```json
{
  "plan_id": "uuid-string",
  "plan": {
    "days": [
      {
        "day": "Mon",
        "meals": [
          {
            "name": "Grilled Chicken",
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

### 2. Swap Meal
**POST** `/api/swap-meal`

Request:
```json
{
  "plan_id": "uuid-string",
  "day": "Mon",
  "meal_index": 0,
  "profile": {
    "diet_pref": "balanced",
    "allergies": []
  }
}
```

Response:
```json
{
  "new_meal": {
    "name": "Salmon",
    "serving": "180g",
    "cal": 280,
    "protein_g": 35,
    "carbs_g": 0,
    "fat_g": 15
  },
  "plan": { /* updated full plan */ }
}
```

### 3. Email Plan
**POST** `/api/email-plan`

Request:
```json
{
  "email": "user@example.com",
  "plan_id": "uuid-string"
}
```

Response:
```json
{
  "status": "sent"
}
```

## Technology Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn
- **LLM**: OpenAI GPT-3.5-turbo
- **Email**: SendGrid
- **Database**: SQLite (with SQLAlchemy ORM)
- **Auth**: JWT tokens

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Charts**: React-ChartJS-2 + Chart.js
- **PDF Export**: html2pdf.js
- **Styling**: Plain CSS with CSS custom properties
- **HTTP**: Axios
- **Routing**: React Router v6

### Styling
- No Tailwind CSS - using plain CSS with CSS custom properties
- Light/Dark theme support via CSS variables
- Responsive design (mobile, tablet, desktop)
- Print-friendly PDF styles

## Testing the Application

1. **Start the servers** using START.bat or manual commands
2. **Open frontend** at http://localhost:5175
3. **Test features:**
   - Adjust calorie slider to 2000
   - Click "Generate Plan" (waits 3-5 seconds for OpenAI)
   - View 7-day plan with meals
   - Click "Swap Meal" on any meal (waits 2-3 seconds)
   - Enter email and click "Send" to email plan
   - Click "Export as PDF" to download
   - Click theme toggle to switch light/dark mode

4. **View API docs** at http://localhost:8000/docs
5. **Test API directly:**
   ```bash
   curl -X POST http://localhost:8000/api/generate-plan \
     -H "Content-Type: application/json" \
     -d '{
       "calories": 2000,
       "macros": {"protein_g": 150, "fat_g": 65, "carbs_g": 250},
       "profile": {"diet_pref": "balanced", "allergies": []}
     }'
   ```

## Troubleshooting

### Backend won't start
- Verify Python 3.13 is installed: `python --version`
- Check OPENAI_API_KEY is set (if you want to generate plans)
- Port 8000 might be in use: `netstat -ano | findstr :8000`

### Frontend won't start
- Verify npm is installed: `npm --version`
- Run `npm install --legacy-peer-deps` in frontend directory
- Port 5175 might be in use, Vite will try next port (5176, etc.)

### API calls fail
- Verify backend is running: `curl http://localhost:8000/health`
- Check browser console for error messages
- Verify OPENAI_API_KEY environment variable is set

### PDF export doesn't work
- Check browser console for JavaScript errors
- Verify html2pdf.js is installed: check `node_modules/html2pdf.js`

### Email sending fails
- Verify SENDGRID_KEY environment variable is set
- Check API response in browser console
- Verify email address format is valid

## Performance Notes

- Plan generation: 3-5 seconds (OpenAI API latency)
- Meal swap: 2-3 seconds (OpenAI API latency)
- PDF export: <2 seconds
- Email send: 1-2 seconds
- Frontend responds instantly

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Notes

- Plans are stored in-memory (not persisted)
- Profile and theme preferences saved in localStorage
- No user authentication required (demo mode)
- All API calls are unprotected (set CORS appropriately in production)

## Next Steps for Production

1. Add database persistence (PostgreSQL recommended)
2. Implement user authentication and authorization
3. Add rate limiting and request throttling
4. Set proper CORS origins (not `*`)
5. Add comprehensive logging and monitoring
6. Implement plan history and user accounts
7. Add scheduled tasks for meal plan renewal
8. Set up CI/CD pipeline with GitHub Actions
9. Containerize with Docker
10. Deploy to cloud (AWS, Azure, GCP)

## Support

For issues or questions:
1. Check the API documentation at http://localhost:8000/docs
2. Review environment variables setup
3. Check browser console for frontend errors
4. Check terminal output for backend errors

---

**FoodGene - Making personalized nutrition accessible to everyone** 🥗
