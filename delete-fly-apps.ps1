# Script to delete all Fly.io applications for art-inventory project
# This will permanently delete:
# - art-portfolio (backend)
# - frontend-wild-violet-7328 (frontend)
# - art-portfolio-db (database)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fly.io App Deletion Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if fly CLI is installed
$flyCmd = "flyctl"
$flyCheck = & $flyCmd version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Fly CLI not found. Installing..." -ForegroundColor Yellow
    powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
    Start-Sleep -Seconds 2
    $flyCheck = & $flyCmd version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Fly CLI installation failed." -ForegroundColor Red
        Write-Host "Please install manually from: https://fly.io/docs/getting-started/installing-flyctl/" -ForegroundColor Yellow
        exit 1
    }
}

# Check if logged in
$authCheck = & $flyCmd auth whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to log in to Fly.io first." -ForegroundColor Yellow
    Write-Host "Running: flyctl auth login" -ForegroundColor Cyan
    & $flyCmd auth login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Login failed. Please try again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Fly CLI found and authenticated" -ForegroundColor Green

Write-Host ""
Write-Host "This will delete the following apps:" -ForegroundColor Yellow
Write-Host "  1. art-portfolio (backend)" -ForegroundColor White
Write-Host "  2. frontend-wild-violet-7328 (frontend)" -ForegroundColor White
Write-Host "  3. art-portfolio-db (database)" -ForegroundColor White
Write-Host ""

# Check if --yes flag is provided
$skipConfirm = $args -contains "--yes" -or $args -contains "-y"

if (-not $skipConfirm) {
    $confirm = Read-Host "Are you sure you want to delete all apps? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Deletion cancelled." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "Auto-confirming deletion (--yes flag provided)..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Deleting apps..." -ForegroundColor Cyan
Write-Host ""

# Delete backend app
Write-Host "[1/3] Deleting art-portfolio (backend)..." -ForegroundColor Yellow
$result = & $flyCmd apps destroy art-portfolio --yes 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "art-portfolio deleted successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to delete art-portfolio" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
}

Write-Host ""

# Delete frontend app
Write-Host "[2/3] Deleting frontend-wild-violet-7328 (frontend)..." -ForegroundColor Yellow
$result = & $flyCmd apps destroy frontend-wild-violet-7328 --yes 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "frontend-wild-violet-7328 deleted successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to delete frontend-wild-violet-7328" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
}

Write-Host ""

# Delete database app
Write-Host "[3/3] Deleting art-portfolio-db (database)..." -ForegroundColor Yellow
$result = & $flyCmd apps destroy art-portfolio-db --yes 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "art-portfolio-db deleted successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to delete art-portfolio-db" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking for volumes..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Volumes may still exist." -ForegroundColor Yellow
Write-Host "You can list them with: $flyCmd volumes list" -ForegroundColor Yellow
Write-Host "And delete them with: $flyCmd volumes destroy [volume-id]" -ForegroundColor Yellow
Write-Host ""

Write-Host "Deletion process complete" -ForegroundColor Green
