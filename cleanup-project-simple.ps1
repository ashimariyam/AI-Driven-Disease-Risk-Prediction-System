# PowerShell Script to Clean Up AI-Driven Disease Risk Prediction System
# Usage: .\cleanup-project-simple.ps1 [-DryRun] [-Force]

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

Write-Host "AI-Driven Disease Risk Prediction System Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$projectRoot = $PSScriptRoot
Write-Host "Project Root: $projectRoot" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "`nDRY RUN MODE - No files will be modified" -ForegroundColor Magenta
} else {
    if (-not $Force) {
        $confirm = Read-Host "`nWARNING: This will modify your project structure. Continue? (y/N)"
        if ($confirm -ne 'y' -and $confirm -ne 'Y') {
            Write-Host "Operation cancelled." -ForegroundColor Red
            exit
        }
    }
}

# Create archive directory
$archiveDir = Join-Path $projectRoot "archive"
if (-not $DryRun -and -not (Test-Path $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
    Write-Host "Created archive directory: $archiveDir" -ForegroundColor Green
}

# Function to safely remove or archive files
function Process-Files {
    param($filePaths, $description, $action = "remove")
    
    Write-Host "`n$description" -ForegroundColor Blue
    
    foreach ($filePath in $filePaths) {
        $fullPath = Join-Path $projectRoot $filePath
        if (Test-Path $fullPath) {
            if ($DryRun) {
                Write-Host "  [DRY RUN] Would $action`: $filePath" -ForegroundColor Gray
            } else {
                try {
                    if ($action -eq "archive") {
                        $destPath = Join-Path $archiveDir (Split-Path $filePath -Leaf)
                        if ((Get-Item $fullPath).PSIsContainer) {
                            Copy-Item -Path $fullPath -Destination $archiveDir -Recurse -Force
                        } else {
                            Copy-Item -Path $fullPath -Destination $destPath -Force
                        }
                    }
                    
                    if ((Get-Item $fullPath).PSIsContainer) {
                        Remove-Item -Path $fullPath -Recurse -Force
                        Write-Host "  Removed directory: $filePath" -ForegroundColor Green
                    } else {
                        Remove-Item -Path $fullPath -Force
                        Write-Host "  Removed file: $filePath" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "  Failed to process: $filePath - $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "  Not found: $filePath" -ForegroundColor Yellow
        }
    }
}

# Function to create models directory
function Create-ModelsDirectory {
    Write-Host "`nCreating clean models directory" -ForegroundColor Blue
    
    $modelsDir = Join-Path $projectRoot "models"
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would create models directory and copy .pkl files" -ForegroundColor Gray
        return
    }
    
    if (-not (Test-Path $modelsDir)) {
        New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
        Write-Host "  Created models directory" -ForegroundColor Green
    }
    
    # Copy model files
    $modelFiles = @(
        @{ Source = "ML_prediction\flask-diabetes\model.pkl"; Dest = "diabetes_model.pkl" }
        @{ Source = "ML_prediction\flask-diabetes\scaler.pkl"; Dest = "diabetes_scaler.pkl" }
        @{ Source = "ML_prediction\flask-heart\model.pkl"; Dest = "heart_model.pkl" }
        @{ Source = "ML_prediction\flask-heart\scaler.pkl"; Dest = "heart_scaler.pkl" }
    )
    
    foreach ($file in $modelFiles) {
        $sourcePath = Join-Path $projectRoot $file.Source
        $destPath = Join-Path $modelsDir $file.Dest
        
        if (Test-Path $sourcePath) {
            try {
                Copy-Item -Path $sourcePath -Destination $destPath -Force
                Write-Host "  Copied: $($file.Source) -> models\$($file.Dest)" -ForegroundColor Green
            } catch {
                Write-Host "  Failed to copy: $($file.Source) - $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "  Model file not found: $($file.Source)" -ForegroundColor Yellow
        }
    }
}

# Start cleanup process
Write-Host "`nStarting cleanup process..." -ForegroundColor Cyan

# Step 1: Archive old Flask applications
Process-Files @(
    "ML_prediction\flask-diabetes"
    "ML_prediction\flask-heart"
) "Archiving old Flask applications" "archive"

# Step 2: Remove redundant root files
Process-Files @(
    "server.js"
    "requirements.txt"
    "test-prediction-flow.js"
) "Removing redundant root files" "remove"

# Step 3: Create clean models directory
Create-ModelsDirectory

# Step 4: Move dataset files to data directory
$dataDir = Join-Path $projectRoot "data"
if (-not $DryRun -and -not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
    Write-Host "`nCreated data directory" -ForegroundColor Green
}

$dataFiles = @(
    "ML_prediction\enhanced_diabetes_dataset.xlsx"
    "ML_prediction\heart.xlsx"
)

Write-Host "`nMoving dataset files to data directory" -ForegroundColor Blue
foreach ($file in $dataFiles) {
    $sourcePath = Join-Path $projectRoot $file
    $fileName = Split-Path $file -Leaf
    $destPath = Join-Path $dataDir $fileName
    
    if (Test-Path $sourcePath) {
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would move: $file -> data\$fileName" -ForegroundColor Gray
        } else {
            try {
                Move-Item -Path $sourcePath -Destination $destPath -Force
                Write-Host "  Moved: $file -> data\$fileName" -ForegroundColor Green
            } catch {
                Write-Host "  Failed to move: $file - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "  Dataset file not found: $file" -ForegroundColor Yellow
    }
}

# Step 5: Remove empty ML_prediction directory
$mlPredictionDir = Join-Path $projectRoot "ML_prediction"
if (Test-Path $mlPredictionDir) {
    $items = @(Get-ChildItem $mlPredictionDir -Recurse)
    if ($items.Count -eq 0) {
        if ($DryRun) {
            Write-Host "`n[DRY RUN] Would remove empty ML_prediction directory" -ForegroundColor Gray
        } else {
            Remove-Item -Path $mlPredictionDir -Force
            Write-Host "`nRemoved empty ML_prediction directory" -ForegroundColor Green
        }
    } else {
        Write-Host "`nML_prediction directory not empty, keeping it" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "`nCleanup Summary" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "This was a DRY RUN - no files were modified" -ForegroundColor Magenta
    Write-Host "To execute the cleanup, run the script without -DryRun parameter" -ForegroundColor Magenta
} else {
    Write-Host "Cleanup completed!" -ForegroundColor Green
    if (Test-Path $archiveDir) {
        Write-Host "Archived files are in: $archiveDir" -ForegroundColor Yellow
    }
    
    Write-Host "`nNew project structure:" -ForegroundColor Blue
    Write-Host "  backend/          # FastAPI application" -ForegroundColor White
    Write-Host "  frontend/         # Web interface" -ForegroundColor White
    Write-Host "  models/           # ML model files (.pkl)" -ForegroundColor White
    Write-Host "  data/             # Training datasets" -ForegroundColor White
    Write-Host "  screenshots/      # Documentation images" -ForegroundColor White
    Write-Host "  archive/          # Archived files" -ForegroundColor White
    
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Update backend model loading paths if necessary" -ForegroundColor White
    Write-Host "2. Test the application to ensure it still works" -ForegroundColor White
    Write-Host "3. Update README.md with new structure if needed" -ForegroundColor White
}

Write-Host "`nScript completed!" -ForegroundColor Green
