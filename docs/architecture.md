# FoodGene Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Frontend (Port 5173)                 │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  App Component                               │  │   │
│  │  │  ├─ Profile Form                             │  │   │
│  │  │  ├─ Diet Plan Generator                      │  │   │
│  │  │  ├─ Calorie Slider (1200-3500)              │  │   │
│  │  │  ├─ Macro Display Cards                      │  │   │
│  │  │  ├─ Meal Cards                               │  │   │
│  │  │  ├─ Action Buttons                           │  │   │
│  │  │  │  ├─ 📥 Download PDF (html2pdf.js)        │  │   │
│  │  │  │  └─ 📧 Email Plan (Axios)                │  │   │
│  │  │  └─ localStorage (Profile Persistence)       │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  Libraries:                                         │   │
│  │  - React 19.2.0 (UI Framework)                      │   │
│  │  - Axios 1.6.0 (HTTP Calls)                         │   │
│  │  - html2pdf.js 0.10.1 (PDF Generation)             │   │
│  │  - Browser localStorage (Data Persistence)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Requests
                           │ (For Email Feature Only)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Python FastAPI Backend (Port 8000)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FastAPI Application (app.py)                        │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ CORS Middleware                             │    │   │
│  │  │ (Allows frontend requests)                   │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  Routes:                                            │   │
│  │  ├─ GET /health (Health Check)                      │   │
│  │  ├─ POST /predict (ML Predictions)                  │   │
│  │  └─ POST /api/email-plan (NEW!)                     │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ Email Router (src/api/email.py)             │    │   │
│  │  │                                              │    │   │
│  │  │ POST /api/email-plan                        │    │   │
│  │  │  ├─ Receive:                                │    │   │
│  │  │  │  ├─ email (EmailStr)                     │    │   │
│  │  │  │  ├─ name (str)                           │    │   │
│  │  │  │  ├─ htmlContent (str)                    │    │   │
│  │  │  │  └─ dietPlan (dict)                      │    │   │
│  │  │  │                                          │    │   │
│  │  │  ├─ Process:                                │    │   │
│  │  │  │  ├─ Email Validation                     │    │   │
│  │  │  │  └─ Choose Provider (SMTP or SendGrid)  │    │   │
│  │  │  │                                          │    │   │
│  │  │  └─ Response:                               │    │   │
│  │  │     ├─ status: "success"                    │    │   │
│  │  │     └─ message: confirmation                │    │   │
│  │  │                                              │    │   │
│  │  │ Functions:                                  │    │   │
│  │  │  ├─ send_via_smtp()                        │    │   │
│  │  │  └─ send_via_sendgrid()                    │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
┌─────────────────────────┐  ┌────────────────────────┐
│   Email Provider 1      │  │   Email Provider 2     │
│   SMTP Server           │  │   SendGrid API         │
│   (Gmail, Outlook, etc) │  │   (Cloud Service)      │
│                         │  │                        │
│ Environment Vars:       │  │ Environment Vars:      │
│ - SMTP_SERVER           │  │ - SENDGRID_API_KEY    │
│ - SMTP_PORT             │  │ - SENDGRID_FROM_EMAIL │
│ - SENDER_EMAIL          │  │                        │
│ - SENDER_PASSWORD       │  │ (Free tier: 100/day)   │
└─────────────────────────┘  └────────────────────────┘
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │   User's Email Inbox     │
            │   (Beautiful HTML)       │
            └──────────────────────────┘
```

---

## Data Flow Diagram

### 1. Generate Diet Plan (No Backend Needed)
```
User Input (Form)
      │
      ▼
saveProfile() → localStorage
      │
      ▼
generateDietPlan()
      │
      ├─ calculateMacros() [25/50/25% split]
      │
      ├─ generateMeals() [3 sample meals]
      │
      └─ generateRecommendations() [5 tips]
      │
      ▼
Display Beautiful Plan
      │
      ├─ Macro Cards (P/C/F)
      │
      ├─ Meal Cards (3 meals)
      │
      └─ Recommendations List
```

### 2. Download PDF (Browser Only)
```
"Download PDF" Button Click
      │
      ▼
downloadPDF()
      │
      ├─ Get DOM element (#dietPlanContent)
      │
      ├─ Configure html2pdf.js options:
      │  ├─ Margin: 10mm
      │  ├─ Quality: 98%
      │  └─ Format: A4
      │
      ├─ Render HTML to Canvas
      │
      └─ Convert to PDF
      │
      ▼
Download File: FoodGene_DietPlan_YYYY-MM-DD.pdf
```

### 3. Email Diet Plan (With Backend)
```
"Email My Plan" Button Click
      │
      ├─ Validate email address
      │
      ▼
emailPlan()
      │
      ├─ Get HTML content from DOM
      │
      └─ POST to http://localhost:8000/api/email-plan
            │
            ├─ email
            ├─ name
            ├─ htmlContent
            └─ dietPlan
                  │
                  ▼
            Backend: /api/email-plan
                  │
                  ├─ Validate email
                  │
                  ├─ Load environment config
                  │
                  ├─ Choose provider:
                  │  │
                  │  ├─ SMTP Route:
                  │  │  ├─ Connect to SMTP server
                  │  │  ├─ Create MIME message
                  │  │  ├─ Add HTML content
                  │  │  └─ Send via SMTP
                  │  │
                  │  └─ SendGrid Route:
                  │     ├─ Create Mail object
                  │     ├─ Add HTML content
                  │     └─ Send via API
                  │
                  └─ Return status
                        │
                        ▼
                  Frontend gets response
                        │
                        ▼
                  Show "✓ Email sent!"
```

### 4. Adjust Calories (Real-time)
```
Calorie Slider Change Event
      │
      ▼
handleCalorieChange()
      │
      ├─ Get new calorie value
      │
      ▼
Update dietPlan state:
      │
      ├─ calculateMacros(newCalories)
      │  ├─ Protein = 25% ÷ 4
      │  ├─ Carbs = 50% ÷ 4
      │  └─ Fats = 25% ÷ 9
      │
      └─ generateMeals(newCalories)
            │
            ├─ Meal 1: ⅓ calories
            ├─ Meal 2: ⅓ calories
            └─ Meal 3: ⅓ calories
                  │
                  ▼
React Re-render (Instant)
      │
      ▼
Display Updated:
      ├─ Macro Cards (new values)
      ├─ Meal Cards (new calories/macros)
      └─ Slider position
```

### 5. Load Profile (On App Start)
```
App Mount (useEffect)
      │
      ▼
Check localStorage for "foodgeneProfile"
      │
      ├─ Found:
      │  ├─ Parse JSON
      │  ├─ Set profile state
      │  ├─ Load target calories
      │  └─ Auto-fill form
      │
      └─ Not Found:
         └─ Use defaults
                  │
                  ▼
            User starts fresh
```

---

## Component Tree

```
App
├─ Header
│  ├─ h1: "🥗 FoodGene - AI Diet Planner"
│  └─ p: "Create your personalized nutrition plan..."
│
├─ Content
│  ├─ Form Section
│  │  ├─ h2: "Your Profile"
│  │  ├─ Form Grid
│  │  │  ├─ Name Input
│  │  │  ├─ Age Input
│  │  │  ├─ Weight Input
│  │  │  ├─ Height Input
│  │  │  ├─ Activity Level Select
│  │  │  ├─ Dietary Preferences Select
│  │  │  └─ Email Input
│  │  └─ "Generate Diet Plan" Button
│  │
│  ├─ Message Alert (conditional)
│  │
│  └─ Plan Section (conditional)
│     ├─ Plan Header
│     │  ├─ h2: "Your Personalized Diet Plan"
│     │  └─ p: "Generated for {name}"
│     │
│     ├─ Calorie Slider Section
│     │  ├─ h3: "Adjust Calorie Target"
│     │  ├─ Label: "Calories: {value}"
│     │  ├─ Range Input (1200-3500)
│     │  ├─ Slider Labels (1200, 2500, 3500)
│     │  └─ Info Text
│     │
│     ├─ Macros Section
│     │  ├─ h3: "Daily Macronutrients"
│     │  └─ Macro Cards
│     │     ├─ Protein Card (orange)
│     │     ├─ Carbs Card (blue)
│     │     └─ Fats Card (pink)
│     │
│     ├─ Meals Section
│     │  ├─ h3: "Sample Daily Meals"
│     │  └─ Meal Cards Grid
│     │     ├─ Breakfast Card
│     │     ├─ Lunch Card
│     │     └─ Dinner Card
│     │
│     ├─ Recommendations Section
│     │  ├─ h3: "Health Recommendations"
│     │  └─ Unordered List (5 items)
│     │
│     └─ Action Buttons
│        ├─ "📥 Download PDF" Button
│        └─ "📧 Email My Plan" Button
│
└─ Footer
   ├─ p: "FoodGene © 2025"
   └─ p: "Your AI-Powered Nutrition Assistant"
```

---

## State Management

```
App State:
│
├─ profile: {
│  │  name: "",
│  │  age: 25,
│  │  weight: 70,
│  │  height: 175,
│  │  activityLevel: "moderate",
│  │  dietaryPreferences: "balanced",
│  │  email: "",
│  │  targetCalories: 2000
│  │}  ← Persisted to localStorage
│  │
│  ├─ dietPlan: null | {
│  │  │  profile: {...},
│  │  │  calories: 2000,
│  │  │  macros: {
│  │  │  │  protein: 125,
│  │  │  │  carbs: 250,
│  │  │  │  fats: 56,
│  │  │  │  calories: 2000
│  │  │  },
│  │  │  meals: [
│  │  │  │  {
│  │  │  │  │  name: "Breakfast",
│  │  │  │  │  description: "...",
│  │  │  │  │  calories: 667,
│  │  │  │  │  macros: {...}
│  │  │  │  },
│  │  │  │  {...},
│  │  │  │  {...}
│  │  │  ],
│  │  │  recommendations: ["✓ ...", "✓ ...", ...]
│  │  }  ← Generated on demand
│  │
│  ├─ calories: 2000  ← Slider value
│  │
│  ├─ loading: false  ← API call state
│  │
│  └─ message: ""  ← Success/error message
```

---

## Environment Variables

```
.env file location: /foodgene/.env

Required for Email Feature:

Option 1 - SMTP:
  EMAIL_PROVIDER=smtp
  SMTP_SERVER=smtp.gmail.com
  SMTP_PORT=587
  SENDER_EMAIL=your_email@gmail.com
  SENDER_PASSWORD=your_app_password

Option 2 - SendGrid:
  EMAIL_PROVIDER=sendgrid
  SENDGRID_API_KEY=SG.xxxxxxxxxx
  SENDGRID_FROM_EMAIL=noreply@foodgene.com

Optional:
  FRONTEND_URL=http://localhost:5173
```

---

## API Documentation

### Endpoint: POST /api/email-plan

**Base URL**: http://localhost:8000

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "htmlContent": "<html>...</html>",
  "dietPlan": {
    "profile": {...},
    "calories": 2000,
    "macros": {...},
    "meals": [...]
  }
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "message": "Diet plan sent successfully to user@example.com"
}
```

**Response (Error)**:
```json
{
  "detail": "Email configuration not set. Set SENDER_EMAIL and SENDER_PASSWORD env vars."
}
```

**Status Codes**:
- 200: Success
- 400: Invalid email format
- 401: SMTP authentication failed
- 500: Server error

---

## Styling System

### Color Palette
```css
Primary Colors:
--primary: #10b981        (Green - CTA)
--primary-dark: #059669   (Dark Green)
--secondary: #3b82f6      (Blue - Secondary)

Macro Colors:
--protein: #f97316        (Orange)
--carbs: #3b82f6          (Blue)
--fats: #ec4899           (Pink)

Grayscale:
--gray-50: #f9fafb        (Lightest)
--gray-900: #111827       (Darkest)
```

### Layout Grid
```
- Mobile: 1 column
- Tablet: auto-fit minmax(200px, 1fr)
- Desktop: auto-fit minmax(280px, 1fr)
- Max width: 1200px
```

### Responsive Breakpoints
```
xs: < 480px   (Mobile)
sm: 480-768px (Tablet)
md: 768-1024px (Small Desktop)
lg: > 1024px  (Large Desktop)

@media (max-width: 768px):
  - Single column forms
  - Stack buttons vertically
  - Larger touch targets
```

---

## Performance Metrics

### Frontend
- Initial Load: < 2 seconds
- PDF Generation: 1-3 seconds
- Slider Update: < 100ms
- Email Request: 1-2 seconds

### Backend
- Email Send (SMTP): 1-3 seconds
- Email Send (SendGrid): 1-2 seconds
- Request Validation: < 50ms

### Storage
- Profile Size: ~500 bytes
- localStorage Limit: 5-10MB
- No impact on performance

---

## Security Considerations

### Frontend
✓ No sensitive data stored
✓ Email validated on backend
✓ HTTPS recommended for production

### Backend
✓ Email credentials in .env (never in code)
✓ Input validation (Pydantic)
✓ CORS properly configured
✓ SMTP password never logged
✓ Error messages don't expose internals

### Deployment
□ Use environment variables
□ Never commit .env file
□ Use secrets management (Heroku, etc.)
□ Enable HTTPS/TLS
□ Rate limit API endpoints
□ Add authentication if needed

---

Generated: December 3, 2025
Version: 1.0.0
