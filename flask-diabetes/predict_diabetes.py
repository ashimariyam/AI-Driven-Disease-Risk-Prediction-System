import pandas as pd
import numpy as np
import joblib
import logging
import os

def load_training_columns():
    # Load the training data and get the columns after one-hot encoding
    train_df = pd.read_excel(os.path.join(os.path.dirname(__file__), '..', 'enhanced_diabetes_dataset.xlsx'))
    # One-hot encode categorical columns
    categorical_cols = train_df.select_dtypes(exclude=[np.number]).columns
    train_encoded = pd.get_dummies(train_df, columns=categorical_cols)
    feature_cols = [col for col in train_encoded.columns if col != 'Outcome']
    return feature_cols

def preprocess_input(sample_dict, feature_cols):
    df = pd.DataFrame([sample_dict])
    # One-hot encode categorical columns
    categorical_cols = df.select_dtypes(exclude=[np.number]).columns
    df_encoded = pd.get_dummies(df, columns=categorical_cols)
    # Add missing columns
    for col in feature_cols:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
    # Ensure correct column order
    df_encoded = df_encoded[feature_cols]
    return df_encoded

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def load_model():
    """Load the trained model from model.pkl"""
    try:
        model = joblib.load('model.pkl')
        logger.info("✅ Model loaded successfully from 'model.pkl'")
        return model
    except FileNotFoundError:
        logger.error("❌ Error: 'model.pkl' not found. Please train the model first.")
        exit(1)

def main():
    # Create a sample input dictionary with all required features
    sample_input = {
        'Pregnancies': 2,
        'Glucose': 150,
        'BloodPressure': 80,
        'SkinThickness': 35,
        'Insulin': 0,
        'BMI': 33.6,
        'DiabetesPedigreeFunction': 0.627,
        'Age': 50,
        'FamilyHistory': 'No',
        'PhysicalActivity': 'Low',
        'SmokingStatus': 'Non-Smoker',
        'AlcoholConsumption': 'None'
    }
    
    # Print the input features
    logger.info("\n📋 Sample Input Features:")
    for feature, value in sample_input.items():
        logger.info(f"{feature}: {value}")
    
    # Load the model
    model = load_model()
    
    # Load training columns
    feature_cols = load_training_columns()
    
    # Preprocess the input
    processed_input = preprocess_input(sample_input, feature_cols)
    
    # Make prediction
    prediction = model.predict(processed_input)[0]
    prediction_proba = model.predict_proba(processed_input)[0]
    
    # Print prediction results
    logger.info("\n🔮 Prediction Results:")
    logger.info(f"Predicted Class: {'Diabetes' if prediction == 1 else 'No Diabetes'}")
    logger.info(f"Confidence Scores:")
    logger.info(f"- No Diabetes: {prediction_proba[0]:.2%}")
    logger.info(f"- Diabetes: {prediction_proba[1]:.2%}")
    
    logger.info("\n✅ Prediction completed successfully!")

if __name__ == "__main__":
    main() 