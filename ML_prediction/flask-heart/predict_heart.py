import pandas as pd
import numpy as np
import joblib
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def load_model():
    """Load the trained heart disease prediction pipeline."""
    try:
        model = joblib.load('model.pkl')
        logger.info("✅ Heart disease prediction model loaded successfully from 'model.pkl'")
        return model
    except FileNotFoundError:
        logger.error("❌ Error: 'model.pkl' not found. Please train the model first.")
        exit(1)

def main():
    # Create a sample input dictionary with all required features
    sample_input = {
        'age': 63,
        'sex': 1,  # 1 = male, 0 = female
        'cp': 3,   # chest pain type (0-3)
        'trestbps': 145,  # resting blood pressure
        'chol': 233,  # serum cholesterol
        'fbs': 1,  # fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
        'restecg': 0,  # resting electrocardiographic results (0-2)
        'thalach': 150,  # maximum heart rate achieved
        'exang': 0,  # exercise induced angina (1 = yes, 0 = no)
        'oldpeak': 2.3,  # ST depression induced by exercise
        'slope': 0,  # slope of peak exercise ST segment (0-2)
        'ca': 0,  # number of major vessels colored by fluoroscopy (0-3)
        'thal': 1  # thalassemia (0 = normal, 1 = fixed defect, 2 = reversible defect)
    }

    # Log the input features
    logger.info("\n📋 Sample Input Features:")
    for feature, value in sample_input.items():
        logger.info(f"{feature}: {value}")

    # Load the model
    model = load_model()

    # Convert input to DataFrame
    input_df = pd.DataFrame([sample_input])

    # Make prediction
    prediction = model.predict(input_df)[0]
    prediction_proba = model.predict_proba(input_df)[0]

    # Log prediction results
    logger.info("\n🔮 Prediction Results:")
    logger.info(f"Predicted Class: {'Heart Disease' if prediction == 1 else 'No Heart Disease'}")
    logger.info(f"Confidence Scores:")
    logger.info(f"- No Heart Disease: {prediction_proba[0]:.2%}")
    logger.info(f"- Heart Disease: {prediction_proba[1]:.2%}")

    # Determine risk level
    risk_score = prediction_proba[1]
    if risk_score < 0.3:
        risk_level = 'Low'
    elif risk_score < 0.6:
        risk_level = 'Moderate'
    else:
        risk_level = 'High'
    
    logger.info(f"Risk Level: {risk_level}")
    logger.info("\n✅ Prediction completed successfully!")

if __name__ == "__main__":
    main() 