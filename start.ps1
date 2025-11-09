# Road Damage Detection System - Startup Script
# Windows PowerShell Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Road Damage Detection System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get project root
$projectRoot = "D:\project\roadDamageDetector"

# Verify backend
if (!(Test-Path "$projectRoot\backend\app.py")) {
    Write-Host "[ERROR] Backend not found!" -ForegroundColor Red
    exit 1
}

# Verify frontend
if (!(Test-Path "$projectRoot\frontend_next\package.json")) {
    Write-Host "[ERROR] Frontend not found!" -ForegroundColor Red
    exit 1
}

Write-Host "[1] Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    Write-Host '========================================' -ForegroundColor Cyan
    Write-Host 'BACKEND SERVER' -ForegroundColor Cyan
    Write-Host '========================================' -ForegroundColor Cyan
    Write-Host ''
    cd '$projectRoot\backend'
    .\venv\Scripts\Activate.ps1
    Write-Host 'Running system verification...' -ForegroundColor Yellow
    python verify_system.py
    Write-Host ''
    Write-Host 'Starting Flask application...' -ForegroundColor Green
    python app.py
"@

Write-Host "[2] Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 7

# Test backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"username":"admin","password":"admin123"}' `
        -ErrorAction Stop
    
    Write-Host "[SUCCESS] Backend is running on http://localhost:5000" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Backend might still be starting..." -ForegroundColor Yellow
    Write-Host "          Check the backend terminal for status" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[3] Starting Frontend Server..." -ForegroundColor Green
Write-Host ""

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    Write-Host '========================================' -ForegroundColor Cyan
    Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan
    Write-Host '========================================' -ForegroundColor Cyan
    Write-Host ''
    cd '$projectRoot\frontend_next'
    Write-Host 'Installing dependencies (if needed)...' -ForegroundColor Yellow
    npm install --silent
    Write-Host ''
    Write-Host 'Starting Next.js development server...' -ForegroundColor Green
    npm run dev
"@

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "[SUCCESS] System Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend:     http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Login Credentials:" -ForegroundColor Yellow
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "System Features:" -ForegroundColor Magenta
Write-Host "  - MongoDB Atlas (Cloud Database)" -ForegroundColor Gray
Write-Host "  - YOLOv8 Segmentation (AI Model)" -ForegroundColor Gray
Write-Host "  - Next.js Frontend" -ForegroundColor Gray
Write-Host "  - Flask Backend" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop servers" -ForegroundColor DarkGray
Write-Host ""

