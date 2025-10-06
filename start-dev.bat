@echo off
echo 🚀 Starting Yellow Book Development Servers...
echo.

echo 📡 Starting API server on http://localhost:3001...
start "API Server" cmd /k "cd apps\api && npx tsx src\main.ts"

timeout /t 3 /nobreak > nul

echo 🌐 Starting Web server on http://localhost:9002...
start "Web Server" cmd /k "cd apps\web && npm run dev"

echo.
echo ✅ Both servers are starting!
echo 📡 API: http://localhost:3001
echo 🌐 Web: http://localhost:9002
echo.
pause
