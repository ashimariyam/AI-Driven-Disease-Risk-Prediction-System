# AI-Driven Disease Risk Prediction System - Backend Setup Guide

## Overview
This project has been successfully migrated from Node.js to FastAPI for better integration with machine learning models. The system now provides accurate heart disease and diabetes risk predictions using trained ML models.

## Project Structure

```
AI-Driven-Disease-Risk-Prediction-System/
├── backend/                    # FastAPI Backend (NEW)
│   ├── main.py                # Main FastAPI application
│   ├── models/                # ML model wrappers
│   │   ├── heart_model.py     # Heart disease prediction
│   │   ├── diabetes_model.py  # Diabetes prediction
│   │   └── __init__.py
│   ├── schemas/               # Pydantic schemas
│   │   ├── prediction_schemas.py
│   │   └── __init__.py
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── start.bat             # Windows startup script
│   ├── start.sh              # Linux/Mac startup script
│   ├── venv/                 # Virtual environment
│   └── logs/                 # Application logs
├── frontend/                  # React/HTML Frontend
│   ├── js/
│   │   ├── api-client.js     # NEW: API integration
│   │   ├── results.js        # UPDATED: Display API results
│   │   └── ...
│   ├── predict.html          # UPDATED: URL parameter handling
│   └── ...
├── ML_prediction/            # ML Models & Training
│   ├── flask-heart/          # Heart disease model
│   │   ├── model.pkl         # Trained model
│   │   ├── scaler.pkl        # Feature scaler
│   │   └── ...
│   ├── flask-diabetes/       # Diabetes model
│   │   ├── model.pkl         # Trained model
│   │   ├── scaler.pkl        # Feature scaler
│   │   └── ...
│   └── ...
└── README.md
```

## Features Implemented

### ✅ Backend (FastAPI)
- **Clean FastAPI Architecture**: Modern, fast, and well-documented API
- **ML Model Integration**: Direct integration with trained models
- **Real-time Predictions**: Heart disease and diabetes risk assessment
- **CORS Support**: Frontend-backend communication enabled
- **Error Handling**: Comprehensive error handling and logging
- **Health Monitoring**: API health check endpoints
- **Automatic Documentation**: Interactive API docs at `/docs`

### ✅ Frontend Integration
- **API Client**: Modern fetch-based API communication
- **URL Parameter Handling**: `predict.html?service=heart` now works correctly
- **Real-time Results**: Display actual ML predictions from backend
- **Error Handling**: User-friendly error messages and loading states
- **Responsive Design**: Mobile-friendly interface

### ✅ ML Model Features
- **Heart Disease Prediction**: 13-feature cardiovascular risk assessment
- **Diabetes Risk Prediction**: 12-feature diabetes risk evaluation
- **Risk Level Classification**: Low, Moderate, High risk categories
- **Confidence Scores**: Model confidence indicators
- **Personalized Recommendations**: Health advice based on risk factors
- **Risk Factor Analysis**: Identification of contributing factors

## Quick Start

### 1. Start the Backend
```bash
# Windows
cd backend
start.bat

# Linux/Mac
cd backend
chmod +x start.sh
./start.sh
```

### 2. Access the Frontend
Open your web browser and navigate to:
- **Prediction Interface**: `file:///path/to/frontend/predict.html`
- **Heart Disease Assessment**: `file:///path/to/frontend/predict.html?service=heart`
- **Diabetes Assessment**: `file:///path/to/frontend/predict.html?service=diabetes`

### 3. API Documentation
- **Interactive Docs**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health
- **API Root**: http://localhost:8000/

## API Endpoints

### Core Endpoints
- `GET /` - API information and available endpoints
- `GET /health` - Health check and model status
- `POST /predict/heart` - Heart disease risk prediction
- `POST /predict/diabetes` - Diabetes risk prediction

### Heart Disease Prediction
**Endpoint**: `POST /predict/heart`

**Required Parameters**:
- `age` (29-80): Age in years
- `sex` (0-1): Gender (0=female, 1=male)
- `cp` (0-3): Chest pain type
- `trestbps` (80-200): Resting blood pressure (mm Hg)
- `chol` (100-600): Serum cholesterol (mg/dL)
- `fbs` (0-1): Fasting blood sugar > 120 mg/dL
- `restecg` (0-2): Resting ECG results
- `thalach` (60-210): Maximum heart rate (bpm)
- `exang` (0-1): Exercise induced angina
- `oldpeak` (0.0-6.0): ST depression
- `slope` (0-2): Slope of peak exercise ST
- `ca` (0-4): Number of major vessels
- `thal` (1-3): Thalassemia type

### Diabetes Risk Prediction
**Endpoint**: `POST /predict/diabetes`

**Required Parameters**:
- `pregnancies` (0-20): Number of pregnancies
- `glucose` (50-300): Glucose level (mg/dL)
- `blood_pressure` (40-140): Blood pressure (mm Hg)
- `skin_thickness` (0-100): Skin thickness (mm)
- `insulin` (0-900): Insulin level (mu U/ml)
- `bmi` (10.0-70.0): BMI (kg/m²)
- `diabetes_pedigree` (0.0-2.5): Diabetes pedigree function
- `age` (10-100): Age in years
- `family_history` (0-1): Family history of diabetes
- `physical_activity` (0.0-20.0): Physical activity (hrs/week)
- `smoking` (0-1): Smoking status
- `alcohol` (0-30): Alcohol consumption (drinks/week)

## Response Format

All prediction endpoints return:
```json
{
  "prediction": 0,              // 0=low risk, 1=high risk
  "probability": 0.23,          // Probability score (0-1)
  "risk_level": "Low Risk",     // Risk level description
  "confidence": 0.87,           // Model confidence (0-1)
  "recommendations": [...],     // Health recommendations
  "risk_factors": [...],        // Contributing risk factors
  "timestamp": "2025-06-29T19:24:36"
}
```

## Technical Details

### Dependencies
- **Python 3.8+**: Required for FastAPI
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Scikit-learn**: Machine learning
- **Joblib**: Model serialization

### Environment Variables
The backend uses the following environment variables (defined in `.env`):
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Debug mode (default: True)
- `LOG_LEVEL`: Logging level (default: INFO)

### Logging
- Application logs are stored in `backend/logs/app.log`
- Console logging with timestamps and log levels
- Error tracking for model loading and predictions

## Troubleshooting

### Common Issues

1. **Unicode Logging Warnings**: These are cosmetic and don't affect functionality
2. **Model Loading Errors**: Ensure ML models exist in `ML_prediction/` folders
3. **Port Already in Use**: Change port in main.py or kill existing process
4. **CORS Errors**: Backend CORS is configured for all origins in development

### Checking API Status
```bash
# Test API health
curl http://localhost:8000/health

# Test heart prediction (example)
curl -X POST "http://localhost:8000/predict/heart" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 45, "sex": 1, "cp": 0, "trestbps": 130,
    "chol": 200, "fbs": 0, "restecg": 0, "thalach": 150,
    "exang": 0, "oldpeak": 1.0, "slope": 1, "ca": 0, "thal": 2
  }'
```

## Security Notes

- **Development Mode**: CORS is open for all origins
- **Production Deployment**: Update CORS settings for specific domains
- **API Keys**: Consider implementing API key authentication for production
- **HTTPS**: Use HTTPS in production environments
- **Rate Limiting**: Consider implementing rate limiting for API endpoints

## Future Enhancements

1. **User Authentication**: Login/signup system integration
2. **Data Persistence**: Store prediction history
3. **Model Versioning**: Track and manage different model versions
4. **Real-time Monitoring**: Advanced logging and monitoring
5. **Additional Models**: Lung cancer and other disease predictions
6. **Mobile App**: React Native or Flutter mobile application

## Support

For issues or questions:
1. Check the application logs in `backend/logs/app.log`
2. Verify ML models are properly trained and saved
3. Ensure all dependencies are installed correctly
4. Test API endpoints using the interactive documentation at `/docs`

The system is now fully functional with FastAPI backend providing accurate disease risk predictions!
