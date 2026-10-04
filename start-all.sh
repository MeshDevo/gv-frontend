#!/bin/bash

# Golden Voice - Start Backend & Frontend Together
# This script starts both services in parallel

echo "================================"
echo "Starting Golden Voice Platform"
echo "================================"
echo ""

# Get the backend directory (parent of parent of current dir)
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../goldenvoice-backend/gv" && pwd)"
FRONTEND_DIR="$(pwd)"

echo "Backend:  $BACKEND_DIR"
echo "Frontend: $FRONTEND_DIR"
echo ""

# Check if backend node_modules exists
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  echo "[1/3] Installing backend dependencies..."
  cd "$BACKEND_DIR"
  npm install
  cd "$FRONTEND_DIR"
fi

# Check if frontend node_modules exists
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "[2/3] Installing frontend dependencies..."
  npm install
fi

echo "[3/3] Starting services..."
echo ""

# Start backend in background
echo "Starting Backend on http://localhost:4000..."
cd "$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting Frontend on http://localhost:5173..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "✓ Backend:  http://localhost:4000"
echo "✓ Frontend: http://localhost:5173"
echo "================================"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
