# Start All Services with Voice Assistant
# This script starts Backend, AI Agents (with TTS), and Frontend

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Automotive Maintenance System with Voice AI  " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param($Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Kill processes on required ports
Write-Host "Checking ports..." -ForegroundColor Yellow
$ports = @(3000, 5000, 8000)
foreach ($port in $ports) {
    if (Test-Port $port) {
        Write-Host "  Port $port is in use, attempting to free..." -ForegroundColor Yellow
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 1
        }
    }
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Green
Write-Host ""

# Start Backend (Node.js - Port 5000)
Write-Host "[1/3] Starting Backend API (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\automotive-maintenance-backend'; Write-Host '🚀 Backend API Server' -ForegroundColor Green; npm start"
Start-Sleep -Seconds 3

# Start AI Agents with TTS (FastAPI - Port 8000)
Write-Host "[2/3] Starting AI Agents with Voice TTS (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\predictive_maintenance_ai-main'; Write-Host '🤖 AI Agents + Voice TTS Server' -ForegroundColor Magenta; uvicorn app.api.main:app --reload --port 8000"
Start-Sleep -Seconds 4

# Start Frontend (Next.js - Port 3000)
Write-Host "[3/3] Starting Frontend Dashboard (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '🎨 Frontend Dashboard' -ForegroundColor Blue; npm run dev"
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  All Services Started Successfully! ✅        " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Yellow
Write-Host "  Frontend:        http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API:     http://localhost:5000" -ForegroundColor White
Write-Host "  AI Agents + TTS: http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs:        http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Voice Assistant Features:" -ForegroundColor Yellow
Write-Host "  - Navigate to http://localhost:3000/voice" -ForegroundColor White
Write-Host "  - Click microphone to interact" -ForegroundColor White
Write-Host "  - AI responses are spoken using gTTS" -ForegroundColor White
Write-Host "  - Supports 16+ languages" -ForegroundColor White
Write-Host ""
Write-Host "Testing Voice TTS:" -ForegroundColor Yellow
Write-Host "  Run: python test_tts_integration.py" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to run TTS integration test..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Run TTS test
Write-Host ""
Write-Host "Running TTS Integration Test..." -ForegroundColor Cyan
python "$PSScriptRoot\test_tts_integration.py"

Write-Host ""
Write-Host "Setup Complete! Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
