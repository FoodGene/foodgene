# FoodGene Meal Plan Generator - Implementation Guide

## Quick Start

### Backend Setup

1. Install Python dependencies:
```bash
cd ml
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export OPENAI_API_KEY="your-openai-api-key"
export SENDGRID_KEY="your-sendgrid-api-key"
```

3. Start the backend:
```bash
cd ..  # Go to foodgene root
python -m uvicorn backend.app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install Node dependencies:
```bash
cd frontend
npm install
```

2. Start the dev server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### POST /api/generate-plan
Generate a new 7-day meal plan

**Request:**
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

**Response:**
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

### POST /api/swap-meal
Replace a single meal in an existing plan

**Request:**
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

**Response:**
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

### POST /api/email-plan
Email a generated meal plan to a user

**Request:**
```json
{
  "email": "user@example.com",
  "plan_id": "uuid-string"
}
```

**Response:**
```json
{
  "status": "sent"
}
```

## Frontend Features

### Controls Component
- **Calorie Slider:** Adjust daily calorie target (1200-3500)
- **Generate Button:** Create a new meal plan based on current settings
- **Export PDF:** Download the meal plan as a PDF
- **Email Input:** Send the plan to an email address
- **Theme Toggle:** Switch between light and dark mode

### PlanView Component
- **7-Day Calendar:** View meals organized by day
- **Meal Details:** See calories and macros for each meal
- **Swap Meals:** Replace individual meals with alternatives
- **Weekly Chart:** Visualize daily calorie breakdown
- **Grocery List:** Categorized shopping list

### MealItem Component
- **Meal Information:** Name, serving size, calories
- **Macro Breakdown:** Protein, carbs, and fat content
- **Swap Button:** Replace meal with AI-generated alternative
- **Error Handling:** Inline error messages for failed swaps

## Styling

The application uses plain CSS with CSS custom properties for theming:

```css
:root {
  --bg: #ffffff;
  --text: #111111;
  --card: #f7f7f7;
  --border: #e0e0e0;
  --primary: #0284c7;
  --success: #16a34a;
  --error: #dc2626;
}

body.dark {
  --bg: #0f1720;
  --text: #e6eef8;
  --card: #1a2332;
  --border: #333333;
}
```

All components support light/dark theme automatically through CSS variables.

## Testing the Full Flow

1. Open `http://localhost:5173` in your browser
2. Adjust the calorie slider to your desired daily intake
3. Click "Generate" to create a meal plan (requires OpenAI API key)
4. Click on "Swap Meal" for any meal to replace it with an alternative
5. Click "Export as PDF" to download the plan
6. Enter your email and click "Send" to email the plan
7. Toggle the theme switch to see light/dark mode in action

## Environment Variables Required

### Backend
- `OPENAI_API_KEY`: Your OpenAI API key for GPT-3.5-turbo
- `SENDGRID_KEY`: Your SendGrid API key for email sending

### Frontend
- No environment variables required (uses localStorage for persistence)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PlanView.jsx       # Main meal plan display
│   │   ├── MealItem.jsx       # Individual meal component
│   │   └── Controls.jsx       # Control panel (slider, buttons)
│   ├── styles/
│   │   ├── PlanView.css
│   │   ├── MealItem.css
│   │   └── Controls.css
│   ├── index.css              # Global styles with theme support
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point

backend/
├── app.py                      # FastAPI app with new endpoints
├── core/
│   └── auth.py                # Authentication utilities
├── schemas.py                 # Pydantic models
├── db.py                      # Database initialization
└── ml/
    └── llm.py                 # OpenAI meal generation
```

## Notes

- Plans are stored in-memory (not persisted to database)
- Profile and theme preferences are saved in localStorage
- PDF export uses html2pdf.js with print-friendly styling
- Email sending requires valid SendGrid API key
- OpenAI API calls use gpt-3.5-turbo model with 0.25 temperature
