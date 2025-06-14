import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_preprocessing_pipeline():
    """
    Create a preprocessing pipeline for numerical and categorical features.
    """
    # Define numerical and categorical features
    numerical_features = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                         'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
    categorical_features = ['FamilyHistory', 'PhysicalActivity', 'SmokingStatus', 'AlcoholConsumption']
    
    # Create preprocessing steps
    numerical_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    # Combine preprocessing steps
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return preprocessor

def load_and_preprocess_data():
    """
    Load and preprocess the diabetes dataset.
    """
    try:
        # Load dataset
        file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'enhanced_diabetes_dataset.xlsx')
        df = pd.read_excel(file_path)
        logger.info(f"Dataset loaded successfully. Shape: {df.shape}")
        logger.info(f"Available columns: {df.columns.tolist()}")
        
        # Check for missing values
        missing_values = df.isnull().sum()
        if missing_values.any():
            logger.warning("Missing values found:")
            logger.warning(missing_values[missing_values > 0])
            # Replace missing values with median for numerical columns
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            for col in numeric_columns:
                df[col].fillna(df[col].median(), inplace=True)
        
        # Split features and target
        X = df.drop('Outcome', axis=1)
        y = df['Outcome']
        
        return X, y
    
    except Exception as e:
        logger.error(f"Error in data preprocessing: {str(e)}")
        raise

def train_and_evaluate_model(X, y):
    """
    Train and evaluate the Random Forest model using a complete pipeline.
    """
    try:
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        logger.info(f"Training set size: {X_train.shape[0]}")
        logger.info(f"Test set size: {X_test.shape[0]}")
        
        # Create preprocessing pipeline
        preprocessor = create_preprocessing_pipeline()
        
        # Create complete pipeline with preprocessing and model
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1,
                class_weight='balanced'
            ))
        ])
        
        # Train pipeline
        pipeline.fit(X_train, y_train)
        logger.info("Model training completed")
        
        # Make predictions
        y_pred = pipeline.predict(X_test)
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        conf_matrix = confusion_matrix(y_test, y_pred)
        class_report = classification_report(y_test, y_pred)
        
        # Log metrics
        logger.info("\nModel Evaluation Metrics:")
        logger.info(f"Accuracy: {accuracy:.4f}")
        logger.info("\nConfusion Matrix:")
        logger.info(conf_matrix)
        logger.info("\nClassification Report:")
        logger.info(class_report)
        
        # Get feature names after preprocessing
        feature_names = (
            pipeline.named_steps['preprocessor']
            .named_transformers_['num']
            .named_steps['scaler']
            .get_feature_names_out()
        ).tolist()
        
        # Add categorical feature names
        cat_features = (
            pipeline.named_steps['preprocessor']
            .named_transformers_['cat']
            .named_steps['onehot']
            .get_feature_names_out()
        ).tolist()
        
        feature_names.extend(cat_features)
        
        # Get feature importance
        feature_importance = pd.DataFrame({
            'feature': feature_names,
            'importance': pipeline.named_steps['classifier'].feature_importances_
        }).sort_values('importance', ascending=False)
        
        logger.info("\nFeature Importance:")
        logger.info(feature_importance)
        
        return pipeline, X_test, y_test
    
    except Exception as e:
        logger.error(f"Error in model training and evaluation: {str(e)}")
        raise

def save_pipeline(pipeline):
    """
    Save the complete pipeline.
    """
    try:
        model_path = 'model.pkl'
        joblib.dump(pipeline, model_path)
        logger.info(f"Pipeline saved successfully as '{model_path}'")
    except Exception as e:
        logger.error(f"Error saving pipeline: {str(e)}")
        raise

def test_pipeline(pipeline, X_test, y_test):
    """
    Test the pipeline with sample cases.
    """
    try:
        # Sample test cases
        sample_cases = [
            # High risk case
            pd.DataFrame([{
                "Pregnancies": 6,
                "Glucose": 148,
                "BloodPressure": 72,
                "SkinThickness": 35,
                "Insulin": 0,
                "BMI": 33.6,
                "DiabetesPedigreeFunction": 0.627,
                "Age": 50,
                "FamilyHistory": "Yes",
                "PhysicalActivity": "Low",
                "SmokingStatus": "Current",
                "AlcoholConsumption": "Moderate"
            }]),
            # Low risk case
            pd.DataFrame([{
                "Pregnancies": 1,
                "Glucose": 85,
                "BloodPressure": 66,
                "SkinThickness": 29,
                "Insulin": 0,
                "BMI": 26.6,
                "DiabetesPedigreeFunction": 0.351,
                "Age": 31,
                "FamilyHistory": "No",
                "PhysicalActivity": "High",
                "SmokingStatus": "Never",
                "AlcoholConsumption": "None"
            }])
        ]
        
        logger.info("\nTesting Pipeline with Sample Cases:")
        for i, case in enumerate(sample_cases, 1):
            # Make prediction
            prediction = pipeline.predict_proba(case)[0]
            risk_score = prediction[1]
            
            logger.info(f"\nSample Test Case {i}:")
            logger.info(f"Input:\n{case}")
            logger.info(f"Risk Score: {risk_score:.2f}")
            logger.info(f"Prediction: {'High Risk' if risk_score > 0.5 else 'Low Risk'}")
    
    except Exception as e:
        logger.error(f"Error testing pipeline: {str(e)}")
        raise

def main():
    try:
        # Load and preprocess data
        X, y = load_and_preprocess_data()
        
        # Train and evaluate model
        pipeline, X_test, y_test = train_and_evaluate_model(X, y)
        
        # Save pipeline
        save_pipeline(pipeline)
        
        # Test pipeline with sample cases
        test_pipeline(pipeline, X_test, y_test)
        
        logger.info("\nModel training and evaluation completed successfully")
        
    except Exception as e:
        logger.error(f"Error in main process: {str(e)}")
        raise

if __name__ == "__main__":
    main() 