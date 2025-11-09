#!/bin/bash

echo "========================================"
echo "Road Damage Detection - Backend Server"
echo "========================================"
echo

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo
fi

echo "Activating virtual environment..."
source venv/bin/activate

# Check if requirements are installed
if [ ! -f "venv/lib/python*/site-packages/flask/__init__.py" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    echo
fi

echo "Starting backend server..."
echo "Server will be available at http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo

python app.py

