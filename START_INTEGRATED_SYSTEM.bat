@echo off
REM ============================================
REM AUTOMOTIVE MAINTENANCE - FULL SYSTEM STARTUP
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════╗
echo ║  AUTOMOTIVE MAINTENANCE SYSTEM                ║
echo ║  Backend + AI Agents Integration              ║
echo ║  Date: December 11, 2025                       ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  This script should ideally run as Administrator
    echo    Attempting to continue anyway...
    echo.
)

REM Colors for output (Windows PowerShell compatible)
for /F %%A in ('echo prompt $H ^| cmd') do set "BS=%%A"

echo [Step 1] Starting Backend Server (Port 5000)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%~dp0automotive-maintenance-backend"

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing Backend dependencies...
    call npm install
)

REM Start backend in a new window
start "🟢 Backend Server (Port 5000)" cmd /k "node src/server.js"

REM Wait for backend to start
echo ⏳ Waiting for Backend to initialize...
timeout /t 3 /nobreak

echo.
echo [Step 2] Starting AI Agents Server (Port 8000)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%~dp0automotive-maintenance-frontend"

REM Check if virtual environment exists
if not exist venv (
    echo 🐍 Creating Python virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt -q

REM Start agents server in a new window
start "🟣 AI Agents Server (Port 8000)" cmd /k "python -m uvicorn app.api.main:app --host 0.0.0.0 --port 8000"

echo.
echo [Step 3] System Status
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

timeout /t 2 /nobreak

echo.
echo ✅ SYSTEM STARTUP COMPLETE!
echo.
echo 🔗 Service URLs:
echo   • Backend API:  http://localhost:5000
echo   • AI Agents:    http://localhost:8000
echo   • API Docs:     http://localhost:8000/docs
echo   • Health Check: http://localhost:8000/health
echo.
echo 📊 Next Steps:
echo   1. Open http://localhost:8000/health to verify
echo   2. Run test workflow (see QUICK_START_TESTING.md)
echo   3. Monitor logs in the opened windows
echo.
echo 🛑 To Stop:
echo   • Close both windows or press Ctrl+C in each terminal
echo.

pause
