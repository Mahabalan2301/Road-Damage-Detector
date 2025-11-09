@echo off
echo ========================================
echo Road Damage Detection - Backend Server
echo ========================================
echo.

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

REM Check if requirements are installed
if not exist "venv\Lib\site-packages\flask" (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

echo Starting backend server...
echo Server will be available at http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py

pause

