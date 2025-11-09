@echo off
echo ========================================
echo Setting Up Road Damage Detection Backend
echo ========================================
echo.

REM Activate virtual environment
echo [1/3] Activating virtual environment...
call venv\Scripts\activate

REM Upgrade pip tools
echo.
echo [2/3] Upgrading pip, setuptools, and wheel...
python -m pip install --upgrade pip setuptools wheel

REM Install requirements
echo.
echo [3/3] Installing dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Place your YOLO model at: backend\models\best.pt
echo 2. Run: python app.py
echo.
pause


