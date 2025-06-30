"""
FastAPI Backend for AI-Driven Disease Risk Prediction System
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from typing import Dict, Any
import os
import sys

# Add the parent directory to the path to import ML models
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from models.heart_model import HeartDiseasePredictor
from models.diabetes_model import DiabetesPredictor
from schemas.prediction_schemas import HeartPredictionRequest, DiabetesPredictionRequest, PredictionResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI-Driven Disease Risk Prediction API",
    description="FastAPI backend for predicting heart disease and diabetes risk using machine learning models",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
heart_predictor = None
diabetes_predictor = None

@app.on_event("startup")
async def startup_event():
    """Initialize ML models on startup"""
    global heart_predictor, diabetes_predictor
    
    try:
        logger.info("Initializing ML models...")
        heart_predictor = HeartDiseasePredictor()
        diabetes_predictor = DiabetesPredictor()
        logger.info("✅ All ML models initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize ML models: {str(e)}")
        raise

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Driven Disease Risk Prediction API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "heart_prediction": "/predict/heart",
            "diabetes_prediction": "/predict/diabetes",
            "health_check": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models": {
            "heart_model": "loaded" if heart_predictor else "not loaded",
            "diabetes_model": "loaded" if diabetes_predictor else "not loaded"
        }
    }

@app.post("/predict/heart", response_model=PredictionResponse)
async def predict_heart_disease(request: HeartPredictionRequest):
    """
    Predict heart disease risk based on user input
    """
    try:
        logger.info(f"Received heart disease prediction request: {request.dict()}")
        
        if not heart_predictor:
            raise HTTPException(status_code=500, detail="Heart disease model not loaded")
        
        # Make prediction
        prediction_result = heart_predictor.predict(request.dict())
        
        logger.info(f"Heart disease prediction result: {prediction_result}")
        
        return PredictionResponse(**prediction_result)
        
    except Exception as e:
        logger.error(f"Error in heart disease prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/diabetes", response_model=PredictionResponse)
async def predict_diabetes_risk(request: DiabetesPredictionRequest):
    """
    Predict diabetes risk based on user input
    """
    try:
        logger.info(f"Received diabetes prediction request: {request.dict()}")
        
        if not diabetes_predictor:
            raise HTTPException(status_code=500, detail="Diabetes model not loaded")
        
        # Make prediction
        prediction_result = diabetes_predictor.predict(request.dict())
        
        logger.info(f"Diabetes prediction result: {prediction_result}")
        
        return PredictionResponse(**prediction_result)
        
    except Exception as e:
        logger.error(f"Error in diabetes prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )

if __name__ == "__main__":
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
