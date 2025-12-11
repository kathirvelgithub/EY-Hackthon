# Script to temporarily enable trust authentication for PostgreSQL (Development only)
# Run this script as Administrator

Write-Host "🔧 PostgreSQL Authentication Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$pgHbaPath = "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
$backupPath = "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup"

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    # Backup original file
    Write-Host "📋 Creating backup of pg_hba.conf..." -ForegroundColor Yellow
    Copy-Item -Path $pgHbaPath -Destination $backupPath -Force
    Write-Host "✅ Backup created: $backupPath" -ForegroundColor Green
    Write-Host ""

    # Read current content
    $content = Get-Content -Path $pgHbaPath

    # Replace scram-sha-256 with trust for localhost
    Write-Host "🔄 Modifying authentication method..." -ForegroundColor Yellow
    $newContent = $content -replace 'host\s+all\s+all\s+127\.0\.0\.1/32\s+scram-sha-256', 'host    all             all             127.0.0.1/32            trust'
    $newContent = $newContent -replace 'host\s+all\s+all\s+::1/128\s+scram-sha-256', 'host    all             all             ::1/128                 trust'

    # Write modified content
    Set-Content -Path $pgHbaPath -Value $newContent -Force
    Write-Host "✅ Configuration updated" -ForegroundColor Green
    Write-Host ""

    # Restart PostgreSQL service
    Write-Host "🔄 Restarting PostgreSQL service..." -ForegroundColor Yellow
    Restart-Service -Name "postgresql-x64-17" -Force
    Start-Sleep -Seconds 3
    
    $service = Get-Service -Name "postgresql-x64-17"
    if ($service.Status -eq "Running") {
        Write-Host "✅ PostgreSQL restarted successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️ PostgreSQL service status: $($service.Status)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "✅ Trust authentication enabled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now connect to PostgreSQL without password." -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  SECURITY WARNING:" -ForegroundColor Red
    Write-Host "   This configuration is for DEVELOPMENT ONLY!" -ForegroundColor Yellow
    Write-Host "   Anyone can connect to your database without password." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To restore security later:" -ForegroundColor White
    Write-Host "   1. Copy $backupPath" -ForegroundColor Gray
    Write-Host "   2. Back to $pgHbaPath" -ForegroundColor Gray
    Write-Host "   3. Restart PostgreSQL service" -ForegroundColor Gray
    Write-Host ""

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "If backup exists, you can restore with:" -ForegroundColor Yellow
    Write-Host "Copy-Item '$backupPath' '$pgHbaPath' -Force" -ForegroundColor Gray
    exit 1
}

Write-Host "Press Enter to continue..."
Read-Host
