# Quick Start Script for Automotive Maintenance System (Windows PowerShell)
# Run all three services: Backend, AI Agents, Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Automotive Maintenance System - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will start:" -ForegroundColor Blue
Write-Host "  1. Node.js Backend API (Port 5000)"
Write-Host "  2. Python AI Agents Server (Port 8000)"
Write-Host "  3. React Frontend (Port 3000)"
Write-Host ""

Write-Host "Make sure you have:" -ForegroundColor Yellow
Write-Host "  - Node.js installed"
Write-Host "  - Python 3.8+ installed"
Write-Host "  - Backend and Frontend dependencies installed"
Write-Host ""

Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

$rootPath = Get-Location

# Terminal 1: Backend
Write-Host "[1/3] Starting Backend API on Port 5000..." -ForegroundColor Green
$backendPath = Join-Path $rootPath "automotive-maintenance-backend"
Set-Location $backendPath

# Start backend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; node src/server.js"

Start-Sleep -Seconds 3

# Terminal 2: AI Agents
Write-Host "[2/3] Starting AI Agents Server on Port 8000..." -ForegroundColor Green
$agentsPath = Join-Path $rootPath "predictive_maintenance_ai-main"
Set-Location $agentsPath

# Start agents in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$agentsPath'; uvicorn app.api.main:app --port 8000 --reload"

Start-Sleep -Seconds 3

# Terminal 3: Frontend
Write-Host "[3/3] Starting Frontend on Port 3000..." -ForegroundColor Green
$frontendPath = Join-Path $rootPath "automotive-maintenance-frontend"
Set-Location $frontendPath

# Start frontend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm start"

Set-Location $rootPath

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""

Write-Host "Access the system:" -ForegroundColor Blue
Write-Host "  Frontend:   http://localhost:3000"
Write-Host "  Backend:    http://localhost:5000"
Write-Host "  Agents API: http://localhost:8000"
Write-Host "  Agents Docs: http://localhost:8000/docs"
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Wait for all services to fully start (30-60 seconds)"
Write-Host "  2. Open http://localhost:3000 in your browser"
Write-Host "  3. Test the dashboard"
Write-Host "  4. Check http://localhost:8000/docs for agent API docs"
Write-Host ""

Write-Host "To stop all services:" -ForegroundColor Yellow
Write-Host "  - Close each PowerShell window"
Write-Host "  - Or press Ctrl+C in each window"
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  - Integration Guide: AGENT_INTEGRATION_GUIDE.md"
Write-Host "  - Summary: INTEGRATION_SUMMARY.md"
Write-Host "  - Analysis: PREDICTIVE_AI_ANALYSIS.md"
Write-Host ""
