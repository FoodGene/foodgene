# FoodGene Features Implementation Guide

## Overview
This document outlines the four new features implemented in the FoodGene project:
1. **Download PDF** - Generate beautiful printable diet PDFs
2. **Email My Plan** - Send diet plans via email
3. **Calorie Slider** - Adjust calories and regenerate macros instantly
4. **Profile Save** - Save user profile to localStorage

---

## Feature 1: Download PDF

### Technology
- **Library**: `html2pdf.js` (v0.10.1)
- **Backend**: No backend required for PDF generation
- **Frontend**: React component with PDF generation on demand

### How It Works
1. User fills in profile and generates diet plan
2. Clicks "📥 Download PDF" button
3. Beautiful styled PDF is generated from the diet plan HTML
4. PDF is automatically downloaded as `FoodGene_DietPlan_YYYY-MM-DD.pdf`

### Key Features
- ✓ Beautiful, printable layout
- ✓ Professional styling with colors and gradients
- ✓ Includes all macros, meals, and recommendations
- ✓ Watermarked with FoodGene branding
- ✓ Mobile-friendly formatting

### Usage
```javascript
// The PDF generation is handled automatically in App.jsx
const downloadPDF = () => {
  if (!dietPlan) return
  const element = document.getElementById('dietPlanContent')
  const opt = {
    margin: 10,
    filename: `FoodGene_DietPlan_${new Date().toISOString().slice(0,10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  }
  import('html2pdf.js').then((html2pdf) => {
    html2pdf.default().set(opt).from(element).save()
  })
}
```

---

## Feature 2: Email My Plan

### Technology
- **Backend**: FastAPI
- **Email Services**: SMTP or SendGrid
- **Frontend**: Axios for API calls

### Configuration

#### Option 1: SMTP (Gmail, Outlook, etc.)
1. Create `.env` file in project root with:
```env
EMAIL_PROVIDER=smtp
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
```

**Gmail Setup**:
- Enable 2-Factor Authentication
- Create App Password: https://myaccount.google.com/apppasswords
- Use App Password in SENDER_PASSWORD

#### Option 2: SendGrid (Free Tier Available)
1. Sign up at https://sendgrid.com
2. Create `.env` file:
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@foodgene.com
```

### Backend Setup
1. Install dependencies:
```bash
cd foodgene/ml
pip install -r requirements.txt
```

2. Set environment variables in `.env`

3. Run the ML service:
```bash
python app.py
# or with uvicorn
uvicorn app:app --reload --port 8000
```

### API Endpoint

**POST** `/api/email-plan`

Request body:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "htmlContent": "<html>diet plan HTML</html>",
  "dietPlan": {
    "profile": {...},
    "calories": 2000,
    "macros": {...},
    "meals": [...]
  }
}
```

Response:
```json
{
  "status": "success",
  "message": "Diet plan sent successfully to user@example.com"
}
```

### Frontend Usage
```javascript
const emailPlan = async () => {
  if (!profile.email) {
    setMessage('✗ Please enter your email address')
    return
  }

  const element = document.getElementById('dietPlanContent')
  const htmlContent = element.innerHTML

  await axios.post('http://localhost:8000/api/email-plan', {
    email: profile.email,
    name: profile.name,
    htmlContent: htmlContent,
    dietPlan: dietPlan
  })
}
```

### Features
- ✓ Beautiful HTML email with inline styles
- ✓ Personalized greeting with user's name
- ✓ Professional header and footer
- ✓ Instructions on how to use the plan
- ✓ Disclaimer about consulting healthcare professionals

---

## Feature 3: Calorie Slider

### Technology
- **Frontend**: HTML5 Range Input
- **Styling**: CSS with custom slider styling
- **State Management**: React useState

### How It Works
1. After generating diet plan, user sees slider control
2. Slider ranges from 1200 to 3500 calories
3. As user adjusts slider, the following regenerate instantly:
   - Macronutrient targets (Protein, Carbs, Fats)
   - Sample meals with updated calories
   - Macro percentages

### Implementation
```javascript
const handleCalorieChange = (e) => {
  const newCalories = Number(e.target.value)
  setCalories(newCalories)
  
  // Regenerate meals and macros with new calories
  if (dietPlan) {
    setDietPlan({
      ...dietPlan,
      calories: newCalories,
      macros: calculateMacros(newCalories),
      meals: generateMeals(newCalories)
    })
  }
}
```

### Macro Calculation
- **Protein**: 25% of calories ÷ 4 cal/g
- **Carbs**: 50% of calories ÷ 4 cal/g
- **Fats**: 25% of calories ÷ 9 cal/g

### Styling Features
- ✓ Beautiful gradient slider background
- ✓ Custom circular thumb with hover effect
- ✓ Real-time calorie value display
- ✓ Min/max labels (1200, 2500, 3500)
- ✓ Responsive on mobile devices

---

## Feature 4: Profile Save (localStorage)

### Technology
- **Storage**: Browser's localStorage API
- **Data Format**: JSON
- **Persistence**: Automatic save and load

### How It Works
1. **On Load**: App checks localStorage for saved profile
2. **On Change**: Every form input update saves to localStorage
3. **On Close**: Data persists even after browser refresh
4. **On Next Visit**: Profile is automatically loaded

### Implementation
```javascript
// Load on mount
useEffect(() => {
  const savedProfile = localStorage.getItem('foodgeneProfile')
  if (savedProfile) {
    const parsedProfile = JSON.parse(savedProfile)
    setProfile(parsedProfile)
  }
}, [])

// Save on change
const saveProfile = (updatedProfile) => {
  setProfile(updatedProfile)
  localStorage.setItem('foodgeneProfile', JSON.stringify(updatedProfile))
}
```

### Stored Data
```javascript
{
  "name": "John Doe",
  "age": 25,
  "weight": 70,
  "height": 175,
  "activityLevel": "moderate",
  "dietaryPreferences": "balanced",
  "email": "john@example.com",
  "targetCalories": 2000
}
```

### Features
- ✓ Automatic persistence of all form inputs
- ✓ Loads saved data on app startup
- ✓ No network requests needed
- ✓ Works offline
- ✓ Last calorie setting preserved

### Storage Limits
- Most browsers: 5-10MB per domain
- FoodGene profile: ~500 bytes

---

## Installation & Setup

### Prerequisites
- Node.js 16+ (Frontend)
- Python 3.8+ (Backend)
- npm or yarn (Package manager)

### Frontend Setup
```bash
cd foodgene/frontend
npm install
npm run dev
# Application will run at http://localhost:5173
```

### Backend Setup
```bash
cd foodgene/ml
pip install -r requirements.txt
# Set up .env file with email configuration
python app.py
# Service will run at http://localhost:8000
```

### Frontend Dependencies
- `html2pdf.js` - PDF generation
- `axios` - HTTP client for API calls
- `react` - UI framework
- `react-dom` - React rendering

### Backend Dependencies
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `aiosmtplib` - SMTP client
- `email-validator` - Email validation
- `python-dotenv` - Environment variables

---

## Testing the Features

### Test Download PDF
1. Fill in profile form
2. Click "Generate Diet Plan"
3. Click "📥 Download PDF"
4. Check Downloads folder for PDF

### Test Email My Plan
1. Fill in email in profile form
2. Generate diet plan
3. Click "📧 Email My Plan"
4. Check email inbox for diet plan

### Test Calorie Slider
1. Generate diet plan
2. Move slider to different values
3. Verify macros and meals update instantly

### Test Profile Save
1. Fill in form with test data
2. Refresh the page (F5)
3. Verify form data is restored
4. Change a value and refresh again

---

## Troubleshooting

### PDF Download Not Working
- **Issue**: "Error downloading PDF - please install html2pdf.js"
- **Solution**: Run `npm install` in frontend directory

### Email Not Sending
- **Issue**: "Error sending email - make sure backend is running"
- **Solutions**:
  - Check backend is running on http://localhost:8000
  - Verify .env file exists with correct credentials
  - Check email credentials are correct
  - For Gmail: Verify App Password is used (not main password)
  - Check CORS is enabled in FastAPI

### Slider Not Updating
- **Issue**: Calorie slider doesn't update meals
- **Solution**: Generate diet plan first, then use slider

### Profile Not Loading
- **Issue**: Form fields are empty on page load
- **Solution**:
  - Check browser localStorage is enabled
  - Try clearing localStorage: `localStorage.clear()` in console
  - Ensure form is filled before closing

---

## Performance Considerations

### PDF Generation
- Large diet plans (10+ meals) may take a few seconds
- PDF size: typically 200-500KB
- Recommended: Display loading indicator

### Email Sending
- SMTP: 1-3 seconds typical
- SendGrid: 1-2 seconds typical
- No file attachments (HTML embedded in email body)

### localStorage
- Profile size: ~500 bytes
- No performance impact
- Data persists indefinitely

### Calorie Slider
- Real-time updates with no lag
- Instant macro and meal regeneration

---

## Future Enhancements

### Potential Features
1. **PDF Templates**: Multiple design options
2. **Email Scheduling**: Schedule email sends
3. **Cloud Storage**: Save profiles to cloud
4. **Export Options**: Excel, CSV, iCal formats
5. **Multi-Language Support**: Localization
6. **Dark Mode**: Theme toggle
7. **Meal Swaps**: Suggest alternative meals
8. **Progress Tracking**: Week-by-week updates

---

## Support & Resources

### Documentation Links
- [html2pdf.js Docs](https://html2pdf.es/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [React Docs](https://react.dev/)

### Common Issues
- CORS errors: Ensure CORS middleware is added to FastAPI
- Email errors: Verify credentials and SMTP settings
- localStorage errors: Check privacy settings in browser

---

Generated: December 3, 2025
Version: 1.0.0
