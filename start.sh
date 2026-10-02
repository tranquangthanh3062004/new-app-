#!/usr/bin/env bash
set -e

echo "=========================================="
echo "⚡ Starting TRENDSPARK AI"
echo "=========================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Run backend
echo "Starting Backend API on http://localhost:8000 ..."
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Run frontend
echo "Starting Frontend on http://localhost:5173 ..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo "TrendSpark AI is live!"
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"

wait $BACKEND_PID $FRONTEND_PID
