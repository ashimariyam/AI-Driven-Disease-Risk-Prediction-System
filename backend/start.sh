#!/bin/bash
# Startup script for FastAPI Backend

echo "🚀 Starting AI-Driven Disease Risk Prediction Backend"

# Check if Python is installed
if ! command -v python &> /dev/null
then
    echo "❌ Python could not be found. Please install Python 3.8 or higher."
    exit
fi

# Check if pip is installed
if ! command -v pip &> /dev/null
then
    echo "❌ pip could not be found. Please install pip."
    exit
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create logs directory
mkdir -p logs

# Check if ML models exist
echo "🔍 Checking ML models..."
if [ ! -f "../ML_prediction/flask-heart/model.pkl" ]; then
    echo "⚠️  Heart disease model not found. Please train the model first."
fi

if [ ! -f "../ML_prediction/flask-diabetes/model.pkl" ]; then
    echo "⚠️  Diabetes model not found. Please train the model first."
fi

# Start the FastAPI server
echo "🌟 Starting FastAPI server on http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
