@echo off
echo ========================================
echo Road Damage Management System
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak > NUL

echo [2/2] Starting Frontend Server...
start cmd /k "cd frontend_app && python -m http.server 8000"

timeout /t 2 /nobreak > NUL

echo.
echo ========================================
echo System Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:8000
echo.
echo Default Admin Login:
echo   Username: admin
echo   Password: admin123
echo.
echo Opening browser...
timeout /t 2 /nobreak > NUL

start http://localhost:8000

echo.
echo Press any key to stop all servers...
pause > NUL

taskkill /F /FI "WINDOWTITLE eq *backend*"
taskkill /F /FI "WINDOWTITLE eq *frontend_app*"

