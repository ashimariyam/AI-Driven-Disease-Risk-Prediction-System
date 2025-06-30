"""
Pydantic schemas for request and response models
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class HeartPredictionRequest(BaseModel):
    """Schema for heart disease prediction request"""
    age: int = Field(..., ge=29, le=80, description="Age in years (29-80)")
    sex: int = Field(..., ge=0, le=1, description="Sex (0=female, 1=male)")
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0-3)")
    trestbps: int = Field(..., ge=80, le=200, description="Resting blood pressure (80-200 mm Hg)")
    chol: int = Field(..., ge=100, le=600, description="Serum cholesterol (100-600 mg/dL)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dL (0=no, 1=yes)")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0-2)")
    thalach: int = Field(..., ge=60, le=210, description="Maximum heart rate (60-210 bpm)")
    exang: int = Field(..., ge=0, le=1, description="Exercise induced angina (0=no, 1=yes)")
    oldpeak: float = Field(..., ge=0.0, le=6.0, description="ST depression (0.0-6.0)")
    slope: int = Field(..., ge=0, le=2, description="Slope of peak exercise ST (0-2)")
    ca: int = Field(..., ge=0, le=4, description="Number of major vessels (0-4)")
    thal: int = Field(..., ge=1, le=3, description="Thalassemia (1-3)")

class DiabetesPredictionRequest(BaseModel):
    """Schema for diabetes prediction request"""
    pregnancies: int = Field(..., ge=0, le=20, description="Number of pregnancies (0-20)")
    glucose: int = Field(..., ge=50, le=300, description="Glucose level (50-300 mg/dL)")
    blood_pressure: int = Field(..., ge=40, le=140, description="Blood pressure (40-140 mm Hg)")
    skin_thickness: int = Field(..., ge=0, le=100, description="Skin thickness (0-100 mm)")
    insulin: int = Field(..., ge=0, le=900, description="Insulin level (0-900 mu U/ml)")
    bmi: float = Field(..., ge=10.0, le=70.0, description="BMI (10.0-70.0 kg/m²)")
    diabetes_pedigree: float = Field(..., ge=0.0, le=2.5, description="Diabetes pedigree function (0.0-2.5)")
    age: int = Field(..., ge=10, le=100, description="Age (10-100 years)")
    family_history: int = Field(..., ge=0, le=1, description="Family history of diabetes (0=no, 1=yes)")
    physical_activity: float = Field(..., ge=0.0, le=20.0, description="Physical activity (0-20 hrs/week)")
    smoking: int = Field(..., ge=0, le=1, description="Smoking status (0=no, 1=yes)")
    alcohol: int = Field(..., ge=0, le=30, description="Alcohol consumption (0-30 drinks/week)")

class PredictionResponse(BaseModel):
    """Schema for prediction response"""
    prediction: int = Field(..., description="Prediction result (0=low risk, 1=high risk)")
    probability: float = Field(..., description="Probability of positive prediction")
    risk_level: str = Field(..., description="Risk level description")
    confidence: float = Field(..., description="Model confidence")
    recommendations: List[str] = Field(..., description="Health recommendations")
    risk_factors: List[str] = Field(..., description="Contributing risk factors")
    timestamp: str = Field(..., description="Prediction timestamp")

class ErrorResponse(BaseModel):
    """Schema for error response"""
    error: bool = True
    message: str
    status_code: int
