@echo off
REM FoodGene Project Setup Script for Windows
REM This script sets up both frontend and backend with all dependencies

setlocal enabledelayedexpansion

echo.
echo 🥗 FoodGene Setup Script for Windows
echo ====================================
echo.

REM Check if in correct directory
if not exist "QUICK_START.md" (
    echo ❌ Please run this script from the foodgene root directory
    pause
    exit /b 1
)

REM Setup Frontend
echo [1/3] Setting up Frontend...
cd frontend

if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo ❌ Frontend installation failed
        pause
        exit /b 1
    )
    echo ✓ Frontend dependencies installed
) else (
    echo ✓ Frontend dependencies already installed
)

cd ..
echo.

REM Setup Backend
echo [2/3] Setting up Backend...
cd ml

REM Check Python
python --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+
    pause
    exit /b 1
)

echo 🐍 Python version:
python --version
echo.

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
    if !errorlevel! neq 0 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
    echo ✓ Virtual environment created
)

REM Activate virtual environment
call venv\Scripts\activate.bat

echo 📦 Installing backend dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt
if !errorlevel! neq 0 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

cd ..
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [3/3] Creating .env file...
    (
        echo # Email Configuration
        echo # Choose provider: smtp or sendgrid
        echo EMAIL_PROVIDER=smtp
        echo.
        echo # SMTP Configuration (for Gmail, Outlook, etc.^)
        echo SMTP_SERVER=smtp.gmail.com
        echo SMTP_PORT=587
        echo SENDER_EMAIL=your_email@gmail.com
        echo SENDER_PASSWORD=your_app_password
        echo.
        echo # SendGrid Configuration (alternative to SMTP^)
        echo # SENDGRID_API_KEY=your_sendgrid_api_key
        echo # SENDGRID_FROM_EMAIL=noreply@foodgene.com
        echo.
        echo # Frontend Configuration
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo ⚠️  .env file created - UPDATE WITH YOUR EMAIL CREDENTIALS
    echo.
) else (
    echo ✓ .env file already exists
    echo.
)

echo.
echo ✅ Setup Complete!
echo.
echo Next Steps:
echo.
echo 1. Update .env file with email configuration:
echo    - For Gmail: Get App Password from myaccount.google.com/apppasswords
echo    - For SendGrid: Sign up at sendgrid.com and get API key
echo.
echo 2. Start Backend:
echo    cd ml
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 3. In another terminal, start Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open browser to http://localhost:5173
echo.
echo 📖 See QUICK_START.md for detailed instructions
echo 📖 See docs/FEATURES_GUIDE.md for feature documentation
echo.

pause
