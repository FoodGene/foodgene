# Implementation Checklist & Sanity Checks

## Files Created/Modified

### Backend
- ✅ `ml/llm.py` - OpenAI meal generation module
  - `_extract_json()` - Robust JSON extraction
  - `call_llm_for_plan()` - Generate 7-day meal plan
  - `call_llm_for_single_meal()` - Generate replacement meal
  
- ✅ `backend/app.py` - Modified FastAPI app
  - Added Pydantic models: `MacroTarget`, `DietProfile`, `GeneratePlanRequest`, `SwapMealRequest`, `EmailPlanRequest`
  - Added in-memory storage: `PLANS` dictionary
  - Added helper functions: `normalize_grocery_item()`, `categorize_grocery_items()`, `render_plan_html()`
  - Added endpoint: `POST /api/generate-plan`
  - Added endpoint: `POST /api/swap-meal`
  - Added endpoint: `POST /api/email-plan`
  - CORS already configured with `allow_origins="*"`

- ✅ `ml/requirements.txt` - Updated with:
  - `openai>=1.0.0`
  - `sendgrid>=6.10.0`

### Frontend
- ✅ `frontend/package.json` - Updated dependencies:
  - `html2pdf.js": "^0.10.1`
  - `react-chartjs-2": "^5.2.0`
  - `chart.js": "^4.4.0`

- ✅ `frontend/src/components/PlanView.jsx` - Main component
  - Calls `POST /api/generate-plan`
  - Displays 7-day meal plan in grid layout
  - Renders weekly calorie chart using react-chartjs-2
  - Displays categorized grocery list
  - Wraps plan in `<div id="plan-to-print">` for PDF export
  - Uses MealItem and Controls components

- ✅ `frontend/src/components/MealItem.jsx` - Meal display
  - Props: `planId`, `day`, `mealIndex`, `meal`, `profile`, `onMealSwapped`
  - Displays meal info (name, serving, calories, macros)
  - "Swap Meal" button calls `POST /api/swap-meal`
  - Shows loading state and error messages
  
- ✅ `frontend/src/components/Controls.jsx` - Control panel
  - Calorie slider (1200-3500 range)
  - "Generate Plan" button
  - "Export as PDF" button (uses html2pdf.js)
  - Email input + "Send" button (calls `POST /api/email-plan`)
  - Theme toggle (persists to localStorage)
  - All buttons properly disabled when loading or no plan

- ✅ `frontend/src/index.css` - Global styles
  - CSS custom properties for light/dark theme
  - `body.dark` selector for dark mode
  - Button, form, card, grid, message, spinner styles
  - Print media queries for PDF export

- ✅ `frontend/src/styles/PlanView.css` - Plan component styles
  - `.plan-view`, `.days-grid`, `.day-card`
  - `.meals-list`, `.meal-wrapper`
  - `.chart-container`, `.grocery-section`
  - `.grocery-grid`, `.grocery-category`, `.grocery-items`
  - Print-friendly styles with `page-break-inside: avoid`

- ✅ `frontend/src/styles/MealItem.css` - Meal item styles
  - `.meal-item`, `.meal-header`, `.meal-name`, `.meal-serving`
  - `.meal-macros`, `.macro-item`, `.macro-label`, `.macro-value`
  - `.meal-calories`, `.meal-actions`, `.swap-button`
  - `.swap-loading`, `.swap-error`

- ✅ `frontend/src/styles/Controls.css` - Controls styles
  - `.controls`, `.control-group`, `.control-label`
  - `.calorie-input`, `.calorie-display`
  - `.email-group`, `.email-button`
  - `.action-buttons`, `.btn-generate`, `.btn-export`
  - `.theme-toggle`, `.toggle-switch`, `.toggle-slider`

- ✅ `frontend/vite.config.js` - Updated with:
  - Path alias `@` for `./src`
  - Proxy `/api/*` to `http://localhost:8000`

- ✅ `frontend/src/App.jsx` - Entry component
  - Renders `<PlanView />`

## Manual Sanity Tests

### 1. Backend Startup
```bash
cd foodgene
export OPENAI_API_KEY="sk-..."
export SENDGRID_KEY="SG...."
python -m uvicorn backend.app:app --reload --port 8000
```
- [ ] No import errors
- [ ] Server starts on http://localhost:8000
- [ ] Health check: `curl http://localhost:8000/health` returns `{"status":"ok"}`

### 2. Frontend Startup
```bash
cd frontend
npm install
npm run dev
```
- [ ] No compilation errors
- [ ] Dev server starts on http://localhost:5173
- [ ] Page loads in browser

### 3. Generate Plan (requires OpenAI key)
```bash
curl -X POST http://localhost:8000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "calories": 2000,
    "macros": {"protein_g": 150, "fat_g": 65, "carbs_g": 250},
    "profile": {"diet_pref": "balanced", "allergies": []}
  }'
```
- [ ] Returns 200 status
- [ ] Response contains `plan_id` (UUID)
- [ ] Response contains `plan` object with `days` and `grocery_list`
- [ ] `days` array has 7 entries (Mon-Sun)
- [ ] Each day has `meals` array
- [ ] `grocery_list` is categorized: `[{"category": "protein", "items": [...]}]`

### 4. UI - Generate Plan Button
- [ ] Adjust calorie slider to 2500
- [ ] Click "Generate Plan"
- [ ] Spinner appears during generation
- [ ] After ~3-5 seconds, plan displays
- [ ] 7-day grid with meals appears
- [ ] Weekly calorie chart appears below
- [ ] Grocery list displays in categories below chart

### 5. UI - Swap Meal
- [ ] Click "Swap Meal" button on any meal
- [ ] Button shows "⏳ Swapping..." state
- [ ] After ~2-3 seconds, meal content updates
- [ ] If error, red error message appears inline

### 6. UI - Export PDF
- [ ] Click "Export as PDF" button
- [ ] File `meal_plan.pdf` downloads to Downloads folder
- [ ] Open PDF - should show all 7 days, meals, grocery list
- [ ] No buttons visible in PDF (stripped by @media print)
- [ ] Font sizes readable, layout clean

### 7. UI - Email Plan
```bash
# Use Sendgrid sandbox testing (requires valid SENDGRID_KEY set in env)
```
- [ ] Enter valid email in email input
- [ ] Click "Send" button
- [ ] Button shows "⏳" during send
- [ ] After ~1-2 seconds, green success message appears
- [ ] Email input clears
- [ ] (Check email inbox - should receive plan HTML email)

### 8. UI - Theme Toggle
- [ ] Click theme toggle (☀️/🌙)
- [ ] Page background changes to dark theme
- [ ] All text, cards, forms update to dark colors
- [ ] Toggle theme back to light
- [ ] Reload page - theme persists (from localStorage)

### 9. Swap Meal API
```bash
curl -X POST http://localhost:8000/api/swap-meal \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "the-uuid-from-generate",
    "day": "Mon",
    "meal_index": 0,
    "profile": {"diet_pref": "balanced", "allergies": []}
  }'
```
- [ ] Returns 200 status
- [ ] Response contains `new_meal` object
- [ ] Response contains updated `plan` object
- [ ] Meal at day "Mon" meal 0 is different from original

### 10. Email Plan API
```bash
curl -X POST http://localhost:8000/api/email-plan \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "plan_id": "the-uuid-from-generate"
  }'
```
- [ ] Returns 200 status with `{"status":"sent"}`
- [ ] If SENDGRID_KEY not set, returns 500 with error message
- [ ] If plan_id invalid, returns 404

## Error Scenarios

### Missing Environment Variables
- [ ] Without `OPENAI_API_KEY`: Generate button returns error message
- [ ] Without `SENDGRID_KEY`: Email button shows 500 error

### Invalid Inputs
- [ ] Invalid plan_id in swap: Returns 404
- [ ] Invalid day name in swap: Returns 400
- [ ] Invalid email format: Frontend shows validation error before sending
- [ ] Out-of-range meal_index: Returns 400

### Network Errors
- [ ] Backend down: Frontend shows connection error
- [ ] OpenAI API timeout: Returns error and shows message to user
- [ ] SendGrid API timeout: Returns error and shows message to user

## Code Quality Checks

- [ ] All imports in files resolve correctly
- [ ] No unused imports
- [ ] Function signatures match docs
- [ ] Pydantic models validate correctly
- [ ] CSS variables work for light/dark theme
- [ ] Print media queries remove buttons and set proper page breaks
- [ ] localStorage properly saves/loads profile and theme
- [ ] MealItem properly updates when swapped
- [ ] Controls buttons disable appropriately

## Browser Compatibility
- [ ] Chrome/Edge - Full functionality
- [ ] Firefox - Full functionality
- [ ] Safari - Full functionality
- [ ] Mobile (iOS Safari) - Responsive layout works

## Performance
- [ ] Plan generation takes 3-5 seconds (OpenAI latency)
- [ ] Meal swap takes 2-3 seconds
- [ ] PDF export completes in <2 seconds
- [ ] Email send completes in 1-2 seconds
- [ ] Page navigation smooth, no lag

## Documentation
- [ ] MEAL_PLAN_SETUP.md has clear setup instructions
- [ ] API examples show request/response format
- [ ] Environment variable requirements documented
- [ ] All components have JSDoc comments

## Commits (if using git)
```bash
git add -A
git commit -m "feat(ml): add ml/llm.py OpenAI meal generation"
git commit -m "feat(api): add generate-plan, swap-meal, email-plan endpoints"
git commit -m "feat(ui): implement PlanView, MealItem, Controls components"
git commit -m "style(css): add plain CSS for layout and printable PDF"
```

## Final Status

All required files created/modified:
- ✅ Backend: 2 files (ml/llm.py, backend/app.py)
- ✅ Frontend: 9 files (PlanView.jsx, MealItem.jsx, Controls.jsx, 3 CSS files, App.jsx, index.css, vite.config.js, package.json)
- ✅ Dependencies: Updated ml/requirements.txt and frontend/package.json
- ✅ Documentation: MEAL_PLAN_SETUP.md created

Zero extra features added. Code is minimal and focused on the specified features only.
