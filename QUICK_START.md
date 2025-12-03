# 🚀 FoodGene Quick Start Guide

## What You Just Implemented

### ✨ 4 Amazing Features

#### 1️⃣ **Download PDF** 📥
Generate beautiful, printable diet PDFs with one click!
- Professional formatting
- Print-friendly layout
- All macros, meals, and recommendations included

#### 2️⃣ **Email My Plan** 📧
Send your personalized diet plan directly to your email
- Beautiful HTML emails
- Works with Gmail, Outlook, or SendGrid
- Includes setup instructions

#### 3️⃣ **Calorie Slider** 🎚️
Adjust calories and see macros + meals update in real-time
- Range: 1200-3500 calories
- Instant recalculation
- Perfect for customization

#### 4️⃣ **Profile Save** 💾
Your profile is automatically saved to your browser
- No account needed
- Data persists forever
- Works offline

---

## ⚡ Quick Start (5 minutes)

### Frontend
```bash
cd foodgene/frontend
npm install
npm run dev
```
→ Opens at http://localhost:5173

### Backend (for email feature)
```bash
cd foodgene/ml

# Create .env file with email config
echo 'EMAIL_PROVIDER=smtp
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password' > .env

# Install and run
pip install -r requirements.txt
python app.py
```
→ Runs at http://localhost:8000

---

## 📧 Email Configuration (Choose One)

### Option A: Gmail (Free)
1. Go to https://myaccount.google.com/apppasswords
2. Create an "App Password"
3. Add to `.env`:
```env
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
```

### Option B: SendGrid (Free Tier)
1. Sign up at https://sendgrid.com
2. Create API key
3. Add to `.env`:
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_api_key
```

---

## 🧪 Testing All Features

### Test 1: Generate Diet Plan
```
1. Fill in your info (age, weight, etc.)
2. Click "Generate Diet Plan"
3. See beautiful macros and meals
```

### Test 2: Download PDF
```
1. After generating plan
2. Click "📥 Download PDF"
3. Check your Downloads folder
```

### Test 3: Email Plan (if backend running)
```
1. Enter your email in the form
2. Click "📧 Email My Plan"
3. Check your email inbox
```

### Test 4: Use Calorie Slider
```
1. Move slider to different value
2. Watch macros and meals update instantly
```

### Test 5: Profile Persistence
```
1. Refresh the page (F5)
2. Your data is still there!
3. Change something and refresh again
```

---

## 📁 File Structure

```
foodgene/
├── frontend/
│   └── src/
│       ├── App.jsx          ← Main component (PDF, Email, Slider, Save)
│       ├── App.css          ← Beautiful styling
│       └── package.json     ← Dependencies (html2pdf.js, axios)
│
├── ml/
│   ├── app.py              ← Updated with email router & CORS
│   ├── requirements.txt     ← Added: aiosmtplib, python-dotenv, email-validator
│   └── src/api/
│       └── email.py        ← NEW: Email service (SMTP & SendGrid)
│
└── docs/
    └── FEATURES_GUIDE.md   ← Detailed documentation
```

---

## 🎨 What Makes These Features Special

### For College Demos 🎓
- **Impressive UI**: Beautiful gradients, smooth animations
- **Complete Feature Set**: Generate, download, email, customize
- **Real-World Use**: Actually sends emails and generates PDFs
- **Responsive Design**: Works on all devices

### For Hackathons 🏆
- **Quick Implementation**: All code ready to go
- **Easy Setup**: 5-minute setup
- **No Database**: Uses localStorage (no backend needed)
- **Shareable**: Users can email their plans

### For Users 👥
- **Save Your Data**: Profile persists forever
- **Customize Freely**: Slider to adjust calories
- **Beautiful Output**: Professional PDF format
- **Easy Sharing**: Email your plan to friends

---

## 🐛 Troubleshooting

### Frontend not loading?
```bash
cd foodgene/frontend
npm install
npm run dev
```

### PDF download not working?
- Make sure `npm install` was run
- Check browser console for errors

### Email not sending?
- Verify `.env` file exists with correct credentials
- For Gmail: Use App Password, not regular password
- Check backend is running: http://localhost:8000
- Look at backend console for error messages

### Profile not saving?
- Check localStorage is enabled in browser
- Try: `localStorage.clear()` in browser console
- Then fill form and refresh page

---

## 📚 Learn More

Full documentation: `docs/FEATURES_GUIDE.md`

---

## 🎯 Next Steps

1. **Deploy Frontend** → Vercel, Netlify
2. **Deploy Backend** → Heroku, Railway, Render
3. **Add Database** → Store user plans & progress
4. **Add Authentication** → Login/signup
5. **Add More Meals** → Real meal database
6. **Add Tracking** → Weekly progress updates

---

## 💡 Cool Demo Ideas

### For College Demo Day
```
1. Load the app
2. Fill in sample profile
3. Click Generate Plan
4. Show slider in action (adjust calories)
5. Download PDF to show quality
6. Send email to demo email account
7. Open email on projector to show result
8. Refresh page to show profile persistence
```

### For Hackathon Judges
- Show "beautiful UI" → Scroll through the styled plan
- Show "real functionality" → Actually send an email
- Show "user-friendly" → Slider updates instantly
- Show "persistent data" → Refresh page
- Show "shareable" → Email the plan

---

Generated: December 3, 2025
Version: 1.0.0
