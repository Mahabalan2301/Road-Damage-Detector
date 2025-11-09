#!/bin/bash

echo "========================================"
echo "Road Damage Management System"
echo "========================================"
echo

echo "[1/2] Starting Backend Server..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

sleep 3

echo "[2/2] Starting Frontend Server..."
cd frontend_app
python3 -m http.server 8000 &
FRONTEND_PID=$!
cd ..

sleep 2

echo
echo "========================================"
echo "System Started Successfully!"
echo "========================================"
echo
echo "Backend API: http://localhost:5000"
echo "Frontend:    http://localhost:8000"
echo
echo "Default Admin Login:"
echo "  Username: admin"
echo "  Password: admin123"
echo
echo "Opening browser..."
sleep 1

# Open browser (try different commands for different OS)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:8000
elif command -v open > /dev/null; then
    open http://localhost:8000
fi

echo
echo "Press Ctrl+C to stop all servers..."

# Trap Ctrl+C and clean up
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for interrupt
wait

