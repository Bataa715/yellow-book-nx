#!/bin/bash

echo "🚀 Starting Yellow Book Development Servers..."
echo ""

# Start API server in background
echo "📡 Starting API server on http://localhost:3001..."
cd apps/api
npx tsx src/main.ts &
API_PID=$!

# Wait a bit for API to start
sleep 2

# Start Web server
echo "🌐 Starting Web server on http://localhost:9002..."
cd ../web
npm run dev

# Cleanup on exit
trap "kill $API_PID" EXIT
