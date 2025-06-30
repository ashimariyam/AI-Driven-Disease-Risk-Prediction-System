"""
Heart Disease Prediction Model
"""

import pandas as pd
import numpy as np
import joblib
import logging
import os
from datetime import datetime
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class HeartDiseasePredictor:
    """Heart Disease Risk Prediction Model"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
            'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        self.load_model()
    
    def load_model(self):
        """Load the trained heart disease model and scaler"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ML_prediction', 'flask-heart', 'model.pkl')
            scaler_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ML_prediction', 'flask-heart', 'scaler.pkl')
            
            self.model = joblib.load(model_path)
            logger.info("✅ Heart disease model loaded successfully")
            
            try:
                self.scaler = joblib.load(scaler_path)
                logger.info("✅ Heart disease scaler loaded successfully")
            except FileNotFoundError:
                logger.warning("⚠️ Scaler not found, proceeding without scaling")
                self.scaler = None
                
        except Exception as e:
            logger.error(f"❌ Failed to load heart disease model: {str(e)}")
            raise
    
    def preprocess_input(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """Preprocess input data for prediction"""
        try:
            # Create DataFrame with correct feature order
            df = pd.DataFrame([input_data])
            
            # Ensure all required features are present
            for feature in self.feature_names:
                if feature not in df.columns:
                    raise ValueError(f"Missing required feature: {feature}")
            
            # Select only the required features in correct order
            df = df[self.feature_names]
            
            # Apply scaling if scaler is available
            if self.scaler:
                df_scaled = pd.DataFrame(
                    self.scaler.transform(df),
                    columns=self.feature_names
                )
                return df_scaled
            
            return df
            
        except Exception as e:
            logger.error(f"Error in preprocessing: {str(e)}")
            raise
    
    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make heart disease risk prediction"""
        try:
            # Preprocess input
            processed_data = self.preprocess_input(input_data)
            
            # Make prediction
            prediction = self.model.predict(processed_data)[0]
            prediction_proba = self.model.predict_proba(processed_data)[0]
            
            # Calculate probability and confidence
            probability = float(prediction_proba[1])  # Probability of positive class
            confidence = float(max(prediction_proba))
            
            # Determine risk level
            if probability < 0.3:
                risk_level = "Low Risk"
            elif probability < 0.7:
                risk_level = "Moderate Risk"
            else:
                risk_level = "High Risk"
            
            # Generate recommendations
            recommendations = self._generate_recommendations(input_data, prediction)
            
            # Identify risk factors
            risk_factors = self._identify_risk_factors(input_data)
            
            return {
                "prediction": int(prediction),
                "probability": probability,
                "risk_level": risk_level,
                "confidence": confidence,
                "recommendations": recommendations,
                "risk_factors": risk_factors,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in heart disease prediction: {str(e)}")
            raise
    
    def _generate_recommendations(self, input_data: Dict[str, Any], prediction: int) -> List[str]:
        """Generate health recommendations based on input data and prediction"""
        recommendations = []
        
        if prediction == 1:  # High risk
            recommendations.append("🏥 Consult a cardiologist immediately for comprehensive evaluation")
            recommendations.append("💊 Follow prescribed medications and treatment plan strictly")
        
        # Age-based recommendations
        if input_data.get('age', 0) > 50:
            recommendations.append("📅 Schedule regular cardiac checkups (every 6 months)")
        
        # Blood pressure recommendations
        if input_data.get('trestbps', 0) > 140:
            recommendations.append("🩺 Monitor and manage blood pressure regularly")
            recommendations.append("🧂 Reduce sodium intake and maintain a low-salt diet")
        
        # Cholesterol recommendations
        if input_data.get('chol', 0) > 240:
            recommendations.append("🥗 Follow a heart-healthy diet low in saturated fats")
            recommendations.append("💊 Consider cholesterol-lowering medications if prescribed")
        
        # Heart rate recommendations
        if input_data.get('thalach', 0) < 100:
            recommendations.append("🏃‍♂️ Engage in regular cardiovascular exercise")
        
        # Exercise-induced angina
        if input_data.get('exang', 0) == 1:
            recommendations.append("⚠️ Avoid strenuous physical activities without medical supervision")
        
        # General recommendations
        recommendations.extend([
            "🚭 Quit smoking and avoid secondhand smoke",
            "🥬 Maintain a Mediterranean-style diet rich in fruits and vegetables",
            "⚖️ Maintain a healthy weight (BMI 18.5-24.9)",
            "😴 Ensure adequate sleep (7-8 hours per night)",
            "🧘‍♀️ Practice stress management techniques",
            "🚫 Limit alcohol consumption"
        ])
        
        return recommendations[:8]  # Return top 8 recommendations
    
    def _identify_risk_factors(self, input_data: Dict[str, Any]) -> List[str]:
        """Identify contributing risk factors"""
        risk_factors = []
        
        if input_data.get('age', 0) > 55:
            risk_factors.append("Advanced age (>55 years)")
        
        if input_data.get('sex', 0) == 1:
            risk_factors.append("Male gender")
        
        if input_data.get('cp', 0) in [1, 2]:
            risk_factors.append("Atypical chest pain")
        elif input_data.get('cp', 0) == 0:
            risk_factors.append("Typical angina")
        
        if input_data.get('trestbps', 0) > 140:
            risk_factors.append("High blood pressure")
        
        if input_data.get('chol', 0) > 240:
            risk_factors.append("High cholesterol")
        
        if input_data.get('fbs', 0) == 1:
            risk_factors.append("Elevated fasting blood sugar")
        
        if input_data.get('restecg', 0) != 0:
            risk_factors.append("Abnormal resting ECG")
        
        if input_data.get('thalach', 0) < 100:
            risk_factors.append("Low maximum heart rate")
        
        if input_data.get('exang', 0) == 1:
            risk_factors.append("Exercise-induced angina")
        
        if input_data.get('oldpeak', 0) > 2.0:
            risk_factors.append("Significant ST depression")
        
        if input_data.get('ca', 0) > 0:
            risk_factors.append("Major vessel blockage")
        
        if input_data.get('thal', 0) in [2, 3]:
            risk_factors.append("Thalassemia defect")
        
        return risk_factors
