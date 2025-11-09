@echo off
echo ========================================
echo Road Damage Detection - Frontend
echo ========================================
echo.

cd frontend_standalone

echo Opening frontend in default browser...
echo.
echo The frontend will be available at: http://localhost:8000
echo.
echo Make sure the backend is running at http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Start simple HTTP server
python -m http.server 8000

pause

