@echo off
REM Windows startup script for FastAPI Backend

echo 🚀 Starting AI-Driven Disease Risk Prediction Backend

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python could not be found. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip could not be found. Please install pip.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Create logs directory
if not exist "logs" mkdir logs

REM Check if ML models exist
echo 🔍 Checking ML models...
if not exist "..\ML_prediction\flask-heart\model.pkl" (
    echo ⚠️  Heart disease model not found. Please train the model first.
)

if not exist "..\ML_prediction\flask-diabetes\model.pkl" (
    echo ⚠️  Diabetes model not found. Please train the model first.
)

REM Start the FastAPI server
echo 🌟 Starting FastAPI server on http://localhost:8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause
