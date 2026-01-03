# Script to find and delete orphaned Fly.io volumes using the API
# This queries the Fly.io GraphQL API to find volumes in your organization

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fly.io Volume Deletion Script (API Method)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if fly CLI is installed
$flyCmd = "flyctl"
$flyCheck = & $flyCmd version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Fly CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if logged in and get access token
$authCheck = & $flyCmd auth whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to log in to Fly.io first." -ForegroundColor Yellow
    & $flyCmd auth login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Login failed. Please try again." -ForegroundColor Red
        exit 1
    }
}

# Get access token
$tokenOutput = & $flyCmd config save 2>&1
$tokenPath = "$env:USERPROFILE\.fly\access-token"
$accessToken = $null

if (Test-Path $tokenPath) {
    $accessToken = Get-Content $tokenPath -Raw | ForEach-Object { $_.Trim() }
}

if (-not $accessToken) {
    Write-Host "Could not retrieve access token. Trying alternative method..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please use the Fly.io dashboard to delete volumes:" -ForegroundColor Yellow
    Write-Host "1. Go to https://fly.io/dashboard" -ForegroundColor White
    Write-Host "2. Navigate to your organization" -ForegroundColor White
    Write-Host "3. Look for volumes section" -ForegroundColor White
    Write-Host "4. Delete any orphaned volumes" -ForegroundColor White
    exit 0
}

Write-Host "Access token found" -ForegroundColor Green
Write-Host ""

# Get organization info
$orgInfo = & $flyCmd orgs list --json 2>&1 | ConvertFrom-Json
if ($orgInfo.Count -eq 0) {
    Write-Host "No organizations found." -ForegroundColor Red
    exit 1
}

$orgSlug = $orgInfo[0].Slug
Write-Host "Using organization: $orgSlug" -ForegroundColor Cyan
Write-Host ""

# GraphQL query to find volumes
$query = @"
query {
  organization(slug: "$orgSlug") {
    volumes {
      nodes {
        id
        name
        app {
          name
        }
        region
        sizeGb
        attached
      }
    }
  }
}
"@

Write-Host "Querying Fly.io API for volumes..." -ForegroundColor Cyan
Write-Host ""

# Make API request
$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type" = "application/json"
}

$body = @{
    query = $query
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.machines.dev/v1" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    
    # Try alternative endpoint
    if (-not $response) {
        $response = Invoke-RestMethod -Uri "https://api.fly.io/graphql" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    }
} catch {
    Write-Host "API query failed. Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use the Fly.io dashboard to delete volumes:" -ForegroundColor Yellow
    Write-Host "1. Go to https://fly.io/dashboard" -ForegroundColor White
    Write-Host "2. Navigate to your organization" -ForegroundColor White
    Write-Host "3. Look for volumes section" -ForegroundColor White
    Write-Host "4. Delete any orphaned volumes" -ForegroundColor White
    Write-Host ""
    Write-Host "Or check your volumes manually with:" -ForegroundColor Yellow
    Write-Host "  flyctl volumes list -a <app-name>" -ForegroundColor White
    exit 1
}

# Parse volumes from response
$volumes = @()
if ($response.data -and $response.data.organization -and $response.data.organization.volumes) {
    $volumes = $response.data.organization.volumes.nodes
}

if ($volumes.Count -eq 0) {
    Write-Host "No volumes found in your organization." -ForegroundColor Green
    Write-Host "All volumes may have been automatically deleted with the apps." -ForegroundColor Cyan
    exit 0
}

Write-Host "Found $($volumes.Count) volume(s):" -ForegroundColor Green
Write-Host ""

foreach ($vol in $volumes) {
    $appName = if ($vol.app) { $vol.app.name } else { "Orphaned" }
    $status = if ($vol.attached) { "Attached" } else { "Unattached" }
    Write-Host "  Volume ID: $($vol.id)" -ForegroundColor White
    Write-Host "    Name: $($vol.name)" -ForegroundColor Gray
    Write-Host "    App: $appName" -ForegroundColor Gray
    Write-Host "    Region: $($vol.region)" -ForegroundColor Gray
    Write-Host "    Size: $($vol.sizeGb) GB" -ForegroundColor Gray
    Write-Host "    Status: $status" -ForegroundColor Gray
    Write-Host ""
}

# Filter for orphaned volumes (no app or from deleted apps)
$orphanedVolumes = $volumes | Where-Object { -not $_.app -or $_.app.name -in @("art-portfolio", "art-portfolio-db", "frontend-wild-violet-7328") }

if ($orphanedVolumes.Count -eq 0) {
    Write-Host "No orphaned volumes found from your deleted apps." -ForegroundColor Green
    exit 0
}

Write-Host "Found $($orphanedVolumes.Count) orphaned volume(s) from deleted apps:" -ForegroundColor Yellow
foreach ($vol in $orphanedVolumes) {
    Write-Host "  - $($vol.id) ($($vol.name))" -ForegroundColor White
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
foreach ($vol in $orphanedVolumes) {
    Write-Host "Deleting volume $($vol.id) ($($vol.name))..." -ForegroundColor Yellow
    $result = & $flyCmd volumes destroy $vol.id --yes 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Volume $($vol.id) deleted successfully" -ForegroundColor Green
    } else {
        Write-Host "  Failed to delete volume $($vol.id)" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Volume deletion process complete" -ForegroundColor Green

