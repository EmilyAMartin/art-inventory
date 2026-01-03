# Script to find and delete orphaned Fly.io volumes
# This will attempt to find and delete volumes that were associated with deleted apps

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fly.io Volume Deletion Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if fly CLI is installed
$flyCmd = "flyctl"
$flyCheck = & $flyCmd version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Fly CLI not found. Please install it first." -ForegroundColor Red
    exit 1
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

# Known volume names from fly.toml files
$knownVolumes = @(
    @{AppName = "art-portfolio"; VolumeName = "uploads_data"},
    @{AppName = "art-portfolio-db"; VolumeName = "mysqldata"}
)

Write-Host "Attempting to find volumes..." -ForegroundColor Cyan
Write-Host ""

$foundVolumes = @()

# Try to find volumes by attempting to list them for each app
# Note: This might not work if apps are deleted, but we'll try
foreach ($vol in $knownVolumes) {
    Write-Host "Checking for volume '$($vol.VolumeName)' from app '$($vol.AppName)'..." -ForegroundColor Yellow
    
    # Try to list volumes for the app (even though it's deleted)
    $volumeList = & $flyCmd volumes list -a $vol.AppName 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        # Parse volume IDs from the output
        $lines = $volumeList | Where-Object { $_ -match "vol_" }
        foreach ($line in $lines) {
            if ($line -match "(vol_[a-z0-9]+)") {
                $volumeId = $matches[1]
                $foundVolumes += @{
                    Id = $volumeId
                    Name = $vol.VolumeName
                    AppName = $vol.AppName
                }
                Write-Host "  Found volume: $volumeId" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "  Could not list volumes for deleted app (this is expected)" -ForegroundColor Gray
    }
}

Write-Host ""

# Alternative: Try to use Fly.io API to query volumes
Write-Host "Trying alternative method to find volumes..." -ForegroundColor Cyan
Write-Host "Note: You may need to check the Fly.io dashboard manually:" -ForegroundColor Yellow
Write-Host "  https://fly.io/dashboard" -ForegroundColor Yellow
Write-Host ""

if ($foundVolumes.Count -eq 0) {
    Write-Host "No volumes found through app queries." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Volumes may have been automatically deleted with the apps," -ForegroundColor Cyan
    Write-Host "or you may need to delete them manually through the dashboard." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To manually delete volumes:" -ForegroundColor Yellow
    Write-Host "1. Go to https://fly.io/dashboard" -ForegroundColor White
    Write-Host "2. Navigate to your organization" -ForegroundColor White
    Write-Host "3. Look for orphaned volumes" -ForegroundColor White
    Write-Host "4. Delete them from there" -ForegroundColor White
    Write-Host ""
    Write-Host "Or if you know the volume IDs, you can delete them with:" -ForegroundColor Yellow
    Write-Host "  flyctl volumes destroy <volume-id>" -ForegroundColor White
    exit 0
}

# Ask for confirmation to delete found volumes
Write-Host "Found $($foundVolumes.Count) volume(s):" -ForegroundColor Green
foreach ($vol in $foundVolumes) {
    Write-Host "  - $($vol.Id) ($($vol.Name) from $($vol.AppName))" -ForegroundColor White
}
Write-Host ""

# Check if --yes flag is provided
$skipConfirm = $args -contains "--yes" -or $args -contains "-y"

if (-not $skipConfirm) {
    $confirm = Read-Host "Do you want to delete these volumes? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Deletion cancelled." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "Auto-confirming deletion (--yes flag provided)..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Deleting volumes..." -ForegroundColor Cyan
Write-Host ""

# Delete each volume
foreach ($vol in $foundVolumes) {
    Write-Host "Deleting volume $($vol.Id) ($($vol.Name))..." -ForegroundColor Yellow
    $result = & $flyCmd volumes destroy $vol.Id --yes 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Volume $($vol.Id) deleted successfully" -ForegroundColor Green
    } else {
        Write-Host "  Failed to delete volume $($vol.Id)" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Volume deletion process complete" -ForegroundColor Green

