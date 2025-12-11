#!/usr/bin/env powershell

# Automotive Maintenance Dashboard - Verification & Launch Script
# This script checks everything is ready and launches the system

Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║     🚗 AUTOMOTIVE MAINTENANCE DASHBOARD                       ║" -ForegroundColor Cyan
Write-Host "║     Agentic AI for Predictive Vehicle Maintenance              ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Check Node.js
Write-Host "📋 CHECKING PREREQUISITES..." -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  Checking Node.js..." -NoNewline
$nodeCheck = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host " ✅ Found: $nodeCheck" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    Write-Host "   Install from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
Write-Host "2️⃣  Checking npm..." -NoNewline
$npmCheck = npm --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host " ✅ Found: $npmCheck" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    exit 1
}

# Check backend folder
Write-Host "3️⃣  Checking backend folder..." -NoNewline
if (Test-Path "c:\kathir\EY-Hackthon\automotive-maintenance-backend") {
    Write-Host " ✅ EXISTS" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    exit 1
}

# Check frontend folder
Write-Host "4️⃣  Checking frontend folder..." -NoNewline
if (Test-Path "c:\kathir\EY-Hackthon\automotive-maintenance-frontend") {
    Write-Host " ✅ EXISTS" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    exit 1
}

# Check backend package.json
Write-Host "5️⃣  Checking backend package.json..." -NoNewline
if (Test-Path "c:\kathir\EY-Hackthon\automotive-maintenance-backend\package.json") {
    Write-Host " ✅ EXISTS" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    exit 1
}

# Check frontend package.json
Write-Host "6️⃣  Checking frontend package.json..." -NoNewline
if (Test-Path "c:\kathir\EY-Hackthon\automotive-maintenance-frontend\package.json") {
    Write-Host " ✅ EXISTS" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    exit 1
}

# Check frontend HTML
Write-Host "7️⃣  Checking frontend index.html..." -NoNewline
if (Test-Path "c:\kathir\EY-Hackthon\automotive-maintenance-frontend\index.html") {
    Write-Host " ✅ EXISTS" -ForegroundColor Green
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    exit 1
}

Write-Host "`n"
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ ALL PREREQUISITES MET!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"

# Project Structure
Write-Host "📁 PROJECT STRUCTURE:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   c:\kathir\EY-Hackthon\"
Write-Host "   ├── automotive-maintenance-backend/"
Write-Host "   │   ├── src/"
Write-Host "   │   │   ├── server.js"
Write-Host "   │   │   ├── controllers/"
Write-Host "   │   │   ├── services/"
Write-Host "   │   │   ├── routes/"
Write-Host "   │   │   ├── middleware/"
Write-Host "   │   │   ├── config/"
Write-Host "   │   │   └── data/"
Write-Host "   │   ├── package.json"
Write-Host "   │   └── init-database.js"
Write-Host "   │"
Write-Host "   └── automotive-maintenance-frontend/"
Write-Host "       ├── public/"
Write-Host "       ├── index.html          (Complete dashboard)"
Write-Host "       ├── package.json"
Write-Host "       ├── README.md"
Write-Host "       └── node_modules/       (Dependencies installed)"
Write-Host "`n"

# System Info
Write-Host "🎯 DASHBOARD PAGES (7 Total):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. 📊 Dashboard        - Fleet overview & metrics"
Write-Host "   2. 🚗 Vehicle Fleet    - All vehicles with status"
Write-Host "   3. 📈 Telemetry        - Real-time sensor data"
Write-Host "   4. 🔧 Maintenance      - Service history"
Write-Host "   5. 📅 Service Bookings - Appointment scheduling"
Write-Host "   6. 🔐 Security (UEBA)  - Agent audit log"
Write-Host "   7. 🔔 Notifications    - Alert center"
Write-Host "`n"

# Startup Instructions
Write-Host "🚀 HOW TO RUN:" -ForegroundColor Cyan
Write-Host ""
Write-Host "STEP 1: Start the Backend (Keep this terminal running)"
Write-Host "   cd c:\kathir\EY-Hackthon\automotive-maintenance-backend"
Write-Host "   npm start"
Write-Host "   → Should show: ✅ Server running on port 5000"
Write-Host ""
Write-Host "STEP 2: Open a NEW terminal and start the Frontend"
Write-Host "   cd c:\kathir\EY-Hackthon\automotive-maintenance-frontend"
Write-Host "   npm start"
Write-Host "   → Should auto-open: http://localhost:3000"
Write-Host "`n"

Write-Host "📌 IMPORTANT NOTES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   ✓ Keep BOTH terminals running (don't close them)"
Write-Host "   ✓ Backend must be running before frontend (or frontend won't load data)"
Write-Host "   ✓ If port 3000/5000 already in use, change port in scripts"
Write-Host "   ✓ Database must be initialized (check backend folder)"
Write-Host "   ✓ Clear browser cache (Ctrl+Shift+Delete) if seeing old data"
Write-Host "`n"

Write-Host "🔗 ACCESS POINTS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Backend API:    http://localhost:5000"
Write-Host "   Frontend App:   http://localhost:3000"
Write-Host "   Database:       PostgreSQL (localhost:5432)"
Write-Host "   API Docs:       See README.md in backend folder"
Write-Host "`n"

Write-Host "✨ FEATURES:" -ForegroundColor Green
Write-Host ""
Write-Host "   ✅ Real-time vehicle monitoring"
Write-Host "   ✅ Predictive maintenance alerts"
Write-Host "   ✅ Automated appointment booking"
Write-Host "   ✅ Security audit logging (UEBA)"
Write-Host "   ✅ Multi-agent orchestration"
Write-Host "   ✅ Responsive design (mobile/tablet/desktop)"
Write-Host "   ✅ Production-ready architecture"
Write-Host "`n"

Write-Host "🆘 TROUBLESHOOTING:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Issue: Frontend shows 'Cannot GET /'          → Clear cache, reload"
Write-Host "   Issue: 'Failed to fetch' errors               → Start backend first"
Write-Host "   Issue: No vehicle data loading                → Check backend DB"
Write-Host "   Issue: Port already in use                    → Kill process or use different port"
Write-Host "   Issue: npm install fails                      → Delete node_modules, try again"
Write-Host "`n"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 YOU'RE ALL SET! Ready to launch your dashboard!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"

# Offer to start
Write-Host "Would you like to start the backend now? (y/n): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'yes') {
    Write-Host "`nStarting backend..." -ForegroundColor Green
    cd "c:\kathir\EY-Hackthon\automotive-maintenance-backend"
    npm start
} else {
    Write-Host "`n💡 Remember to start the backend before the frontend!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "See FRONTEND_SETUP.md for detailed instructions." -ForegroundColor Cyan
}
