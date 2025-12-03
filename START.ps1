# FoodGene Startup Script
# Run this PowerShell script to start both backend and frontend

param(
    [string]$OpenAIKey = "",
    [string]$SendGridKey = ""
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "FoodGene - Meal Plan Generator" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Set API keys if provided
if ($OpenAIKey -ne "") {
    $env:OPENAI_API_KEY = $OpenAIKey
    Write-Host "[OK] OpenAI API key set" -ForegroundColor Green
} else {
    Write-Host "[WARNING] OpenAI API key not provided" -ForegroundColor Yellow
    Write-Host "         Usage: .\START.ps1 -OpenAIKey 'sk-...' -SendGridKey 'SG...'" -ForegroundColor Yellow
}

if ($SendGridKey -ne "") {
    $env:SENDGRID_KEY = $SendGridKey
    Write-Host "[OK] SendGrid API key set" -ForegroundColor Green
} else {
    Write-Host "[WARNING] SendGrid API key not provided" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Write-Host "Starting backend server on http://localhost:8000" -ForegroundColor Blue
$backendPath = Join-Path (Get-Location) "backend"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$((Get-Location).Path)'; C:/Python313/python.exe -m uvicorn backend.app:app --reload --port 8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "Starting frontend server on http://localhost:5175" -ForegroundColor Blue
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$((Get-Location).Path)\frontend'; npm run dev"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Services Started!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API:  http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend:     http://localhost:5175" -ForegroundColor Green
Write-Host "API Docs:     http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop services" -ForegroundColor Yellow
Write-Host ""

# Keep this window open
Read-Host "Press Enter to exit (this will NOT close the other windows)"
