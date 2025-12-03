@echo off
REM ============================================
REM FoodGene - Meal Plan Generator Starter
REM ============================================

echo ========================================
echo FoodGene Meal Plan Generator - Startup
echo ========================================
echo.

REM Set API Keys (update these with your actual keys)
set OPENAI_API_KEY=sk-your-key-here
set SENDGRID_KEY=SG.your-key-here

if "%OPENAI_API_KEY%"=="sk-your-key-here" (
    echo WARNING: Please update OPENAI_API_KEY in this file!
    echo Get your key from: https://platform.openai.com/api-keys
    echo.
)

REM Start Backend
echo Starting Backend API on http://localhost:8000...
start "FoodGene Backend" cmd /k "cd c:\Users\focus\Desktop\FOOD\foodgene && set OPENAI_API_KEY=%OPENAI_API_KEY% && set SENDGRID_KEY=%SENDGRID_KEY% && C:/Python313/python.exe -m uvicorn backend.app:app --reload --port 8000"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo.
echo Starting Frontend on http://localhost:5175...
start "FoodGene Frontend" cmd /k "cd c:\Users\focus\Desktop\FOOD\foodgene\frontend && npm run dev"

REM Summary
echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5175
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C in each terminal to stop
echo ========================================
pause
