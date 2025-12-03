# 🔧 FoodGene Troubleshooting & Testing Checklist

## Pre-Deployment Checklist

### Frontend Setup ✅
- [ ] Node.js 16+ installed: `node --version`
- [ ] npm/yarn installed: `npm --version`
- [ ] `npm install` ran successfully in frontend folder
- [ ] No npm errors or warnings
- [ ] `npm run dev` starts without errors
- [ ] App loads at http://localhost:5173

### Backend Setup ✅
- [ ] Python 3.8+ installed: `python --version`
- [ ] Virtual environment created: `python -m venv venv`
- [ ] Virtual environment activated
- [ ] `pip install -r requirements.txt` successful
- [ ] No pip installation errors
- [ ] `.env` file created with email config
- [ ] `python app.py` starts without errors
- [ ] Backend responds at http://localhost:8000

### Dependencies Verification ✅
```bash
# Frontend
npm list html2pdf.js    # Should show 0.10.1+
npm list axios          # Should show 1.6.0+

# Backend
pip show aiosmtplib     # Should be installed
pip show python-dotenv  # Should be installed
pip show email-validator # Should be installed
```

---

## Feature Testing Checklist

### Test 1: Profile Save (localStorage) ✅

**Steps**:
1. Open app at http://localhost:5173
2. Fill in profile form:
   - [ ] Name: "John Doe"
   - [ ] Age: 25
   - [ ] Weight: 70
   - [ ] Height: 175
   - [ ] Activity: "moderate"
   - [ ] Diet: "balanced"
   - [ ] Email: "test@example.com"
3. Press F5 to refresh
4. **Verify**: All fields still have your data

**Troubleshoot if failing**:
- [ ] Open browser console: `localStorage.getItem('foodgeneProfile')`
- [ ] Should show JSON object with your data
- [ ] If empty: localStorage might be disabled
- [ ] Try clearing: `localStorage.clear()` then refill form
- [ ] Check browser privacy settings

---

### Test 2: Generate Diet Plan ✅

**Steps**:
1. Fill in profile form
2. Click "Generate Diet Plan" button
3. **Verify**: Plan appears with:
   - [ ] "Your Personalized Diet Plan" header
   - [ ] Calorie target displays
   - [ ] 3 macro cards (Protein, Carbs, Fats) with colors
   - [ ] 3 meal cards (Breakfast, Lunch, Dinner)
   - [ ] 5 health recommendations
   - [ ] Two action buttons

**Expected Output**:
- Protein: ~125g (25% of 2000 cal)
- Carbs: ~250g (50% of 2000 cal)
- Fats: ~56g (25% of 2000 cal)

**Troubleshoot if failing**:
- [ ] Check browser console for JavaScript errors
- [ ] Verify App.jsx loaded correctly
- [ ] Check that state variables are defined

---

### Test 3: Calorie Slider ✅

**Steps**:
1. Generate diet plan (Test 2 required)
2. Find calorie slider (should show "Calories: 2000")
3. Drag slider to 1500
4. **Verify**:
   - [ ] Calorie value updates to 1500
   - [ ] Protein updates (matches 25%)
   - [ ] Carbs update (matches 50%)
   - [ ] Fats update (matches 25%)
   - [ ] Meal cards show new calorie targets
5. Drag slider to 2500
6. **Verify**: All values update again

**Macro Calculation Check**:
- At 1500 cal: P~94g, C~188g, F~42g
- At 2500 cal: P~156g, C~313g, F~69g

**Troubleshoot if failing**:
- [ ] Check slider element exists in DOM
- [ ] Open console: check if handleCalorieChange fires
- [ ] Verify dietPlan state updates
- [ ] Check CSS for slider visibility

---

### Test 4: Download PDF ✅

**Steps**:
1. Generate diet plan (Test 2 required)
2. Scroll down to action buttons
3. Click "📥 Download PDF" button
4. **Verify**:
   - [ ] No console errors
   - [ ] File downloads to Downloads folder
   - [ ] Filename: `FoodGene_DietPlan_YYYY-MM-DD.pdf`
   - [ ] File size > 50KB
5. Open PDF in browser
6. **Verify PDF content**:
   - [ ] Beautiful formatting
   - [ ] All macros visible
   - [ ] All meals visible
   - [ ] Recommendations present
   - [ ] Professional styling
   - [ ] Print-friendly (no dark backgrounds)

**Troubleshoot if failing**:
- [ ] Error: "html2pdf.js not found"
  - Solution: Run `npm install` in frontend
- [ ] File doesn't download
  - Check browser console for fetch errors
  - Verify network tab
  - Check if html2pdf.js loaded
- [ ] PDF looks broken
  - Try in different browser
  - Check console for warnings

---

### Test 5: Email My Plan (Without Backend) ✅

**Before Backend Setup**:
1. Try clicking "📧 Email My Plan"
2. **Should see error**: "Error sending email - make sure backend is running"
3. This is expected!

---

### Test 6: Email Configuration (SMTP) ✅

**Setup Gmail SMTP**:
1. Go to https://myaccount.google.com/apppasswords
2. Select App: "Mail"
3. Select Device: "Windows Computer" (or your device)
4. Click "Generate"
5. Copy the 16-character password
6. Edit `.env` file:
```env
EMAIL_PROVIDER=smtp
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=xxxx xxxx xxxx xxxx
```

**Verify Configuration**:
1. Save `.env` file
2. Restart backend: `python app.py`
3. Check console for startup message
4. Should not show email errors

**Troubleshoot**:
- [ ] "SMTP authentication failed"
  - Verify SENDER_EMAIL is correct
  - Verify SENDER_PASSWORD is exactly from Google
  - Make sure 2FA is enabled
  - Check SMTP_PORT is 587
- [ ] "Module 'aiosmtplib' not found"
  - Run: `pip install aiosmtplib`

---

### Test 7: Email Configuration (SendGrid) ✅

**Setup SendGrid**:
1. Go to https://sendgrid.com
2. Sign up for free account
3. Go to Settings → API Keys
4. Create API Key (copy the key)
5. Edit `.env` file:
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@foodgene.com
```

**Verify Configuration**:
1. Save `.env` file
2. Restart backend: `python app.py`
3. Check console for startup message
4. Should not show SendGrid errors

**Troubleshoot**:
- [ ] "SENDGRID_API_KEY not set"
  - Verify key in .env
  - Restart backend after changing .env
- [ ] "Module 'sendgrid' not found"
  - Run: `pip install sendgrid`

---

### Test 8: Email My Plan (With Backend) ✅

**Prerequisites**:
- [ ] Backend running: `python app.py`
- [ ] Email configured (.env file updated)
- [ ] Frontend running: `npm run dev`

**Steps**:
1. Fill in profile with your email
2. Generate diet plan
3. Click "📧 Email My Plan"
4. **Verify**:
   - [ ] No immediate errors
   - [ ] See "Sending..." text on button
   - [ ] After 2-3 seconds: Success message appears
5. Check your email inbox
6. **Verify email**:
   - [ ] Email received from SENDER_EMAIL
   - [ ] Subject: "Your FoodGene Diet Plan - {name}"
   - [ ] Beautiful HTML formatting
   - [ ] All diet plan content present
   - [ ] Professional header and footer

**Troubleshoot if failing**:

**Error: "Error sending email - make sure backend is running"**
- [ ] Verify backend started with `python app.py`
- [ ] Check backend console for errors
- [ ] Verify http://localhost:8000 responds
- [ ] Check frontend console for CORS errors

**Error: "Email configuration not set"**
- [ ] Verify .env file exists
- [ ] Verify EMAIL_PROVIDER is set
- [ ] Check SENDER_EMAIL format for SMTP
- [ ] Restart backend after editing .env

**Email not received**:
- [ ] Check spam/junk folder
- [ ] Verify recipient email is correct
- [ ] Check backend console for errors
- [ ] Try sending again
- [ ] For Gmail: Check if "Less secure apps" are blocked

**Email formatting broken**:
- [ ] Check email client (Gmail, Outlook, etc.)
- [ ] Try opening in different email client
- [ ] Check if HTML rendering is enabled

---

## Performance Testing Checklist

### Frontend Performance ✅

**Measure Load Time**:
```javascript
// In browser console
performance.measure('app-load')
performance.getEntriesByType('measure')
```
- [ ] Initial load < 2 seconds
- [ ] Form interaction instant
- [ ] Slider updates in < 100ms

**Measure PDF Generation**:
1. Click "Download PDF"
2. **Check console timing**:
   - [ ] Should complete in 1-3 seconds
   - [ ] Large PDFs may take up to 5 seconds
   - [ ] File size: 200-500KB

### Backend Performance ✅

**Measure Email Speed**:
1. Click "Email My Plan"
2. Time from button click to success message
3. **Expected**:
   - [ ] SMTP: 1-3 seconds
   - [ ] SendGrid: 1-2 seconds

**Check Memory Usage**:
```bash
# While backend running
# Linux/Mac: monitor with top
# Windows: Task Manager
```
- [ ] Python process < 50MB memory
- [ ] No memory leaks after 10+ email sends

---

## Browser Compatibility Checklist

### Desktop Browsers ✅
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Mobile Browsers ✅
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Test Responsive Design ✅
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test on:
   - [ ] iPhone 12 (390x844)
   - [ ] iPad (768x1024)
   - [ ] Android (360x800)
4. **Verify**:
   - [ ] Form is single column
   - [ ] Buttons stack vertically
   - [ ] Slider works smoothly
   - [ ] Text readable
   - [ ] No horizontal scroll

---

## Security Checklist

### Code Security ✅
- [ ] No API keys in frontend code
- [ ] No passwords in version control
- [ ] .env file in .gitignore
- [ ] CORS configured correctly
- [ ] Email validation enabled
- [ ] No console.log of sensitive data

### Data Security ✅
- [ ] localStorage only stores non-sensitive data
- [ ] Profile doesn't include passwords
- [ ] Email sent over HTTPS (production)
- [ ] SMTP uses TLS (port 587)
- [ ] API key not exposed in errors

### Deployment Preparation ✅
- [ ] Change CORS to specific domains
- [ ] Enable HTTPS
- [ ] Use environment variable manager
- [ ] Rotate API keys regularly
- [ ] Set up SMTP-specific app password
- [ ] Monitor email usage quota

---

## Common Issues & Solutions

### Issue: "Module not found: html2pdf.js"
```bash
# Solution
cd frontend
npm install html2pdf.js
npm run dev
```

### Issue: "CORS error when sending email"
```python
# Verify in ml/app.py:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: "Email sends but not received"
1. Check spam folder
2. Verify email address spelling
3. For Gmail: Allow less secure apps
4. Check backend logs for errors
5. Try with different email provider

### Issue: "Slider not updating macros"
1. Generate diet plan first
2. Check browser console for errors
3. Verify dietPlan state is set
4. Clear cache: Ctrl+Shift+Delete

### Issue: "localStorage not working"
1. Check browser privacy settings
2. Not in private/incognito mode?
3. Clear site data: Settings → Clear browsing data
4. Try in regular window
5. Check browser supports localStorage

### Issue: "PDF download says "blocked""
1. Check browser security settings
2. Allow downloads from localhost
3. Try different browser
4. Disable popup blocker

---

## Performance Optimization Tips

### Frontend
- Use React DevTools Profiler to identify slow renders
- Minimize large images in CSS
- Consider code splitting for large components
- Use memoization for expensive calculations

### Backend
- Use connection pooling for SMTP
- Implement request rate limiting
- Add caching for common operations
- Monitor database queries

### Deployment
- Use CDN for static files
- Enable gzip compression
- Minimize CSS/JS bundles
- Cache headers for static assets

---

## Testing Commands

```bash
# Frontend
cd frontend
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Check code quality

# Backend
cd ml
python -m venv venv     # Create environment
source venv/bin/activate # Activate (Linux/Mac)
pip install -r requirements.txt  # Install dependencies
python app.py           # Start server
```

---

## Debugging Tips

### Frontend Debugging
```javascript
// Check localStorage
localStorage.getItem('foodgeneProfile')

// Check if PDF library loaded
window.html2pdf

// Check API response
fetch('http://localhost:8000/api/email-plan')
  .then(r => r.json())
  .then(d => console.log(d))

// Monitor slider changes
document.querySelector('.slider').addEventListener('change', (e) => {
  console.log('New value:', e.target.value)
})
```

### Backend Debugging
```python
# Check environment variables
import os
print(os.getenv('EMAIL_PROVIDER'))
print(os.getenv('SENDER_EMAIL'))

# Test SMTP connection
import smtplib
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('email@gmail.com', 'password')

# Check API logs
# Add to FastAPI: --log-level debug
# uvicorn app:app --reload --log-level debug
```

---

## When to Ask for Help

### Check These First:
1. [ ] Error message - copy exact text
2. [ ] Browser console errors (F12)
3. [ ] Backend console errors
4. [ ] .env file is correct
5. [ ] Both frontend and backend running
6. [ ] No typos in config

### Include in Bug Report:
- Error message (exact)
- What you were doing
- Browser/OS version
- Steps to reproduce
- Backend console output
- Frontend console output

---

## Success Indicators

✅ **Everything working if you see**:
1. Form saves and reloads ✓
2. Diet plan generates beautifully ✓
3. Slider updates macros instantly ✓
4. PDF downloads successfully ✓
5. Email sends with professional formatting ✓
6. No console errors ✓
7. No network errors ✓

---

Generated: December 3, 2025
Version: 1.0.0
