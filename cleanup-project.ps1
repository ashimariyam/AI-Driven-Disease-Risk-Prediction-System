# PowerShell Script to Clean Up AI-Driven Disease Risk Prediction System
# This script archives redundant files and reorganizes the project structure

param(
    [switch]$DryRun = $false,  # Use -DryRun to see what would happen without making changes
    [switch]$Force = $false    # Use -Force to skip confirmation prompts
)

Write-Host "AI-Driven Disease Risk Prediction System Cleanup Script" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Get the script directory (project root)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Project Root: $projectRoot" -ForegroundColor Yellow

# Backup directory
$backupDir = Join-Path $projectRoot "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$archiveDir = Join-Path $projectRoot "archive"

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
    
    # Create backup and archive directories
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Write-Host "✅ Created backup directory: $backupDir" -ForegroundColor Green
    }
    
    if (-not (Test-Path $archiveDir)) {
        New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
        Write-Host "✅ Created archive directory: $archiveDir" -ForegroundColor Green
    }
}

function Remove-FilesSafely {
    param($filePaths, $description)
    
    Write-Host "`n📁 $description" -ForegroundColor Blue
    
    foreach ($filePath in $filePaths) {
        $fullPath = Join-Path $projectRoot $filePath
        if (Test-Path $fullPath) {
            if ($DryRun) {
                Write-Host "  [DRY RUN] Would remove: $filePath" -ForegroundColor Gray
            } else {
                try {
                    if ((Get-Item $fullPath).PSIsContainer) {
                        Remove-Item -Path $fullPath -Recurse -Force
                        Write-Host "  ✅ Removed directory: $filePath" -ForegroundColor Green
                    } else {
                        Remove-Item -Path $fullPath -Force
                        Write-Host "  ✅ Removed file: $filePath" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "  ❌ Failed to remove: $filePath - $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "  ⚠️  Not found: $filePath" -ForegroundColor Yellow
        }
    }
}

function Archive-Files {
    param($filePaths, $description, $destinationSubdir = "")
    
    Write-Host "`n📦 $description" -ForegroundColor Blue
    
    $archiveSubDir = if ($destinationSubdir) { 
        Join-Path $archiveDir $destinationSubdir 
    } else { 
        $archiveDir 
    }
    
    foreach ($filePath in $filePaths) {
        $fullPath = Join-Path $projectRoot $filePath
        if (Test-Path $fullPath) {
            if ($DryRun) {
                Write-Host "  [DRY RUN] Would archive: $filePath" -ForegroundColor Gray
            } else {
                try {
                    if (-not (Test-Path $archiveSubDir)) {
                        New-Item -ItemType Directory -Path $archiveSubDir -Force | Out-Null
                    }
                    
                    $fileName = Split-Path $filePath -Leaf
                    $destination = Join-Path $archiveSubDir $fileName
                    
                    if ((Get-Item $fullPath).PSIsContainer) {
                        Copy-Item -Path $fullPath -Destination $archiveSubDir -Recurse -Force
                        Remove-Item -Path $fullPath -Recurse -Force
                        Write-Host "  ✅ Archived directory: $filePath" -ForegroundColor Green
                    } else {
                        Copy-Item -Path $fullPath -Destination $destination -Force
                        Remove-Item -Path $fullPath -Force
                        Write-Host "  ✅ Archived file: $filePath" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "  ❌ Failed to archive: $filePath - $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "  ⚠️  Not found: $filePath" -ForegroundColor Yellow
        }
    }
}

function Create-ModelsDirectory {
    Write-Host "`n📁 Creating clean models directory" -ForegroundColor Blue
    
    $modelsDir = Join-Path $projectRoot "models"
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would create models directory and copy .pkl files" -ForegroundColor Gray
        return
    }
    
    # Create models directory
    if (-not (Test-Path $modelsDir)) {
        New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
        Write-Host "  ✅ Created models directory" -ForegroundColor Green
    }
    
    # Copy model files
    $modelFiles = @(
        @{ Source = "ML_prediction\flask-diabetes\model.pkl"; Dest = "diabetes_model.pkl" },
        @{ Source = "ML_prediction\flask-diabetes\scaler.pkl"; Dest = "diabetes_scaler.pkl" },
        @{ Source = "ML_prediction\flask-heart\model.pkl"; Dest = "heart_model.pkl" },
        @{ Source = "ML_prediction\flask-heart\scaler.pkl"; Dest = "heart_scaler.pkl" }
    )
    
    foreach ($file in $modelFiles) {
        $sourcePath = Join-Path $projectRoot $file.Source
        $destPath = Join-Path $modelsDir $file.Dest
        
        if (Test-Path $sourcePath) {
            try {
                Copy-Item -Path $sourcePath -Destination $destPath -Force
                Write-Host "  ✅ Copied: $($file.Source) → models\$($file.Dest)" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Failed to copy: $($file.Source) - $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "  ⚠️  Model file not found: $($file.Source)" -ForegroundColor Yellow
        }
    }
}

function Create-DataDirectory {
    Write-Host "`n📁 Creating data directory for training datasets" -ForegroundColor Blue
    
    $dataDir = Join-Path $projectRoot "data"
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would create data directory and move dataset files" -ForegroundColor Gray
        return
    }
    
    # Create data directory
    if (-not (Test-Path $dataDir)) {
        New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
        Write-Host "  ✅ Created data directory" -ForegroundColor Green
    }
    
    # Move dataset files
    $dataFiles = @(
        "ML_prediction\enhanced_diabetes_dataset.xlsx",
        "ML_prediction\heart.xlsx"
    )
    
    foreach ($file in $dataFiles) {
        $sourcePath = Join-Path $projectRoot $file
        $fileName = Split-Path $file -Leaf
        $destPath = Join-Path $dataDir $fileName
        
        if (Test-Path $sourcePath) {
            try {
                Move-Item -Path $sourcePath -Destination $destPath -Force
                Write-Host "  ✅ Moved: $file → data\$fileName" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Failed to move: $file - $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "  ⚠️  Dataset file not found: $file" -ForegroundColor Yellow
        }
    }
}

# Start cleanup process
Write-Host "`n🧹 Starting cleanup process..." -ForegroundColor Cyan

# Step 1: Archive old Flask applications
Archive-Files @(
    "ML_prediction\flask-diabetes",
    "ML_prediction\flask-heart"
) "Archiving old Flask applications" "old-flask-apps"

# Step 2: Remove redundant root files
Remove-FilesSafely @(
    "server.js",
    "requirements.txt",
    "test-prediction-flow.js"
) "Removing redundant root files"

# Step 3: Create clean models directory
Create-ModelsDirectory

# Step 4: Create data directory for datasets
Create-DataDirectory

# Step 5: Remove empty ML_prediction directory
$mlPredictionDir = Join-Path $projectRoot "ML_prediction"
if (Test-Path $mlPredictionDir) {
    $isEmpty = @(Get-ChildItem $mlPredictionDir -Recurse).Count -eq 0
    if ($isEmpty) {
        if ($DryRun) {
            Write-Host "`n[DRY RUN] Would remove empty ML_prediction directory" -ForegroundColor Gray
        } else {
            Remove-Item -Path $mlPredictionDir -Force
            Write-Host "`n✅ Removed empty ML_prediction directory" -ForegroundColor Green
        }
    } else {
        Write-Host "`n⚠️  ML_prediction directory not empty, keeping it" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "`n📋 Cleanup Summary" -ForegroundColor Cyan
Write-Host "=" * 30 -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "🔍 This was a DRY RUN - no files were modified" -ForegroundColor Magenta
    Write-Host "To execute the cleanup, run the script without -DryRun parameter" -ForegroundColor Magenta
} else {
    Write-Host "✅ Cleanup completed!" -ForegroundColor Green
    Write-Host "📦 Archived files are in: $archiveDir" -ForegroundColor Yellow
    Write-Host "💾 Backup created at: $backupDir" -ForegroundColor Yellow
    
    Write-Host "`n📁 New project structure:" -ForegroundColor Blue
    Write-Host "  ├── backend/          # FastAPI application" -ForegroundColor White
    Write-Host "  ├── frontend/         # Web interface" -ForegroundColor White
    Write-Host "  ├── models/           # ML model files (.pkl)" -ForegroundColor White
    Write-Host "  ├── data/             # Training datasets" -ForegroundColor White
    Write-Host "  ├── screenshots/      # Documentation images" -ForegroundColor White
    Write-Host "  ├── archive/          # Archived files" -ForegroundColor White
    Write-Host "  └── backup_*/         # Backup directory" -ForegroundColor White
    
    Write-Host "`n⚠️  Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update backend model loading paths if necessary" -ForegroundColor White
    Write-Host "2. Test the application to ensure it still works" -ForegroundColor White
    Write-Host "3. Update README.md with new structure if needed" -ForegroundColor White
}

Write-Host "`n🎉 Script completed!" -ForegroundColor Green
