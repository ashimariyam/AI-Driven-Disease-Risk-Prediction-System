"""
Diabetes Risk Prediction Model
"""

import pandas as pd
import numpy as np
import joblib
import logging
import os
from datetime import datetime
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class DiabetesPredictor:
    """Diabetes Risk Prediction Model"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        # These are the exact features the model expects (in order)
        self.expected_features = [
            'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
            'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age',
            'PhysicalActivity', 'AlcoholConsumption',  # Numerical categorical
            'FamilyHistory_No', 'FamilyHistory_Yes',    # One-hot encoded
            'SmokingStatus_Non-Smoker', 'SmokingStatus_Smoker'  # One-hot encoded
        ]
        self.load_model()
    
    def load_model(self):
        """Load the trained diabetes model and scaler"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ML_prediction', 'flask-diabetes', 'model.pkl')
            scaler_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ML_prediction', 'flask-diabetes', 'scaler.pkl')
            
            self.model = joblib.load(model_path)
            logger.info("Diabetes model loaded successfully")
            
            try:
                self.scaler = joblib.load(scaler_path)
                logger.info("Diabetes scaler loaded successfully")
            except FileNotFoundError:
                logger.warning("Scaler not found, proceeding without scaling")
                self.scaler = None
                
        except Exception as e:
            logger.error(f"Failed to load diabetes model: {str(e)}")
            raise
    
    def _prepare_input_data(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """Prepare input data to match the exact format expected by the trained model"""
        try:
            # Initialize feature vector with default values
            features = {
                'Pregnancies': 0,
                'Glucose': 100,
                'BloodPressure': 80,
                'SkinThickness': 20,
                'Insulin': 0,
                'BMI': 25.0,
                'DiabetesPedigreeFunction': 0.5,
                'Age': 25,
                'PhysicalActivity': 5,  # Default moderate activity
                'AlcoholConsumption': 0,  # Default no alcohol
                'FamilyHistory_No': 1,
                'FamilyHistory_Yes': 0,
                'SmokingStatus_Non-Smoker': 1,
                'SmokingStatus_Smoker': 0
            }
            
            # Map input field names to model feature names
            field_mapping = {
                'pregnancies': 'Pregnancies',
                'glucose': 'Glucose', 
                'blood_pressure': 'BloodPressure',
                'skin_thickness': 'SkinThickness',
                'insulin': 'Insulin',
                'bmi': 'BMI',
                'diabetes_pedigree': 'DiabetesPedigreeFunction',
                'age': 'Age'
            }
            
            # Update numerical features
            for input_key, model_key in field_mapping.items():
                if input_key in input_data:
                    features[model_key] = float(input_data[input_key])
            
            # Handle categorical features
            # Physical Activity - convert text to number if needed
            if 'physical_activity' in input_data:
                activity = input_data['physical_activity']
                if isinstance(activity, str):
                    activity_map = {
                        'sedentary': 0, 'low': 2, 'light': 2,
                        'moderate': 5, 'active': 7, 'high': 9
                    }
                    features['PhysicalActivity'] = activity_map.get(activity.lower(), 5)
                else:
                    features['PhysicalActivity'] = int(activity)
            
            # Alcohol Consumption - convert text to number if needed  
            if 'alcohol' in input_data:
                alcohol = input_data['alcohol']
                if isinstance(alcohol, str):
                    alcohol_map = {
                        'none': 0, 'light': 3, 'moderate': 7, 'heavy': 12
                    }
                    features['AlcoholConsumption'] = alcohol_map.get(alcohol.lower(), 0)
                else:
                    features['AlcoholConsumption'] = int(alcohol)
            
            # Family History - one-hot encoding
            if 'family_history' in input_data:
                has_family_history = input_data['family_history']
                if isinstance(has_family_history, str):
                    has_family_history = has_family_history.lower() in ['yes', 'true', '1']
                else:
                    has_family_history = bool(int(has_family_history))
                
                features['FamilyHistory_Yes'] = 1 if has_family_history else 0
                features['FamilyHistory_No'] = 0 if has_family_history else 1
            
            # Smoking Status - one-hot encoding
            if 'smoking' in input_data:
                is_smoker = input_data['smoking']
                if isinstance(is_smoker, str):
                    is_smoker = is_smoker.lower() in ['smoker', 'yes', 'true', '1', 'current']
                else:
                    is_smoker = bool(int(is_smoker))
                
                features['SmokingStatus_Smoker'] = 1 if is_smoker else 0
                features['SmokingStatus_Non-Smoker'] = 0 if is_smoker else 1
            
            # Create DataFrame with features in the exact order expected by the model
            feature_values = [features[feat] for feat in self.expected_features]
            df = pd.DataFrame([feature_values], columns=self.expected_features)
            
            logger.info(f"Prepared input data shape: {df.shape}")
            logger.info(f"Feature values: {df.iloc[0].to_dict()}")
            
            return df
            
        except Exception as e:
            logger.error(f"Error in preparing input data: {str(e)}")
            raise
    
    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make diabetes risk prediction"""
        try:
            # Prepare input data to match model expectations
            processed_data = self._prepare_input_data(input_data)
            
            # Make prediction (no additional scaling needed as model expects raw features)
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
            logger.error(f"Error in diabetes prediction: {str(e)}")
            raise
    
    def _generate_recommendations(self, input_data: Dict[str, Any], prediction: int) -> List[str]:
        """Generate health recommendations based on input data and prediction"""
        recommendations = []
        
        if prediction == 1:  # High risk
            recommendations.append("🏥 Consult an endocrinologist for comprehensive diabetes screening")
            recommendations.append("🩸 Schedule regular blood glucose monitoring")
        
        # Glucose level recommendations
        glucose = input_data.get('glucose', 0)
        if glucose > 140:
            recommendations.append("⚠️ Your glucose levels are elevated - seek immediate medical attention")
        elif glucose > 100:
            recommendations.append("📊 Monitor blood glucose levels regularly")
        
        # BMI recommendations
        bmi = input_data.get('bmi', 0)
        if bmi > 30:
            recommendations.append("⚖️ Work on weight reduction with a structured diet plan")
        elif bmi > 25:
            recommendations.append("🥗 Maintain a healthy weight through balanced nutrition")
        
        # Age-based recommendations
        if input_data.get('age', 0) > 45:
            recommendations.append("📅 Schedule annual diabetes screening tests")
        
        # Blood pressure recommendations
        if input_data.get('blood_pressure', 0) > 130:
            recommendations.append("🩺 Monitor and manage blood pressure regularly")
        
        # Pregnancy-related recommendations
        if input_data.get('pregnancies', 0) > 0 and glucose > 140:
            recommendations.append("🤰 Monitor for gestational diabetes in future pregnancies")
        
        # General recommendations
        recommendations.extend([
            "🥬 Follow a low-glycemic diet rich in fiber",
            "🏃‍♀️ Engage in regular physical activity (150 minutes per week)",
            "💧 Stay well-hydrated and limit sugary beverages",
            "😴 Maintain regular sleep patterns (7-8 hours per night)",
            "🧘‍♀️ Practice stress management techniques",
            "📱 Use diabetes tracking apps to monitor progress"
        ])
        
        return recommendations[:8]  # Return top 8 recommendations
    
    def _identify_risk_factors(self, input_data: Dict[str, Any]) -> List[str]:
        """Identify contributing risk factors"""
        risk_factors = []
        
        if input_data.get('age', 0) > 45:
            risk_factors.append("Advanced age (>45 years)")
        
        if input_data.get('bmi', 0) > 25:
            risk_factors.append("Overweight/Obesity")
        
        if input_data.get('glucose', 0) > 100:
            risk_factors.append("Elevated glucose levels")
        
        if input_data.get('blood_pressure', 0) > 130:
            risk_factors.append("High blood pressure")
        
        if input_data.get('family_history', 0) == 1:
            risk_factors.append("Family history of diabetes")
        
        if input_data.get('pregnancies', 0) > 0 and input_data.get('glucose', 0) > 140:
            risk_factors.append("History of gestational diabetes")
        
        if input_data.get('physical_activity', 0) < 3:
            risk_factors.append("Sedentary lifestyle")
        
        if input_data.get('smoking', 0) == 1:
            risk_factors.append("Smoking")
        
        if input_data.get('alcohol', 0) > 14:
            risk_factors.append("Excessive alcohol consumption")
        
        if input_data.get('diabetes_pedigree', 0) > 0.5:
            risk_factors.append("Strong genetic predisposition")
        
        if input_data.get('insulin', 0) == 0 and input_data.get('glucose', 0) > 140:
            risk_factors.append("Insulin resistance indicators")
        
        return risk_factors
