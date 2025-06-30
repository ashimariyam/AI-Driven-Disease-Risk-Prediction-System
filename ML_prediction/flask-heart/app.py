from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
import logging
from logging.handlers import RotatingFileHandler

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set port
PORT = int(os.environ.get('FLASK_HEART_PORT', 5001))

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')

handler = RotatingFileHandler('logs/heart_prediction.log', maxBytes=10000, backupCount=1)
handler.setFormatter(logging.Formatter(
    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
))
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)

# Load the model and preprocessing pipeline
try:
    pipeline = joblib.load('model.pkl')
    app.logger.info('Heart disease prediction pipeline loaded successfully')
except Exception as e:
    app.logger.error(f'Failed to load pipeline: {str(e)}')
    raise

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': pipeline is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.get_json()
        
        # Validate input data
        required_fields = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
            'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': 'Missing required field',
                    'field': field
                }), 400

        # Create DataFrame in the exact format used during training
        features = pd.DataFrame([{
            "age": float(data['age']),
            "sex": float(data['sex']),
            "cp": float(data['cp']),
            "trestbps": float(data['trestbps']),
            "chol": float(data['chol']),
            "fbs": float(data['fbs']),
            "restecg": float(data['restecg']),
            "thalach": float(data['thalach']),
            "exang": float(data['exang']),
            "oldpeak": float(data['oldpeak']),
            "slope": float(data['slope']),
            "ca": float(data['ca']),
            "thal": float(data['thal'])
        }])

        # Make prediction using the pipeline
        prediction = pipeline.predict_proba(features)[0]
        risk_score = float(prediction[1])  # Probability of heart disease

        # Determine risk level
        if risk_score < 0.3:
            risk_level = 'Low'
        elif risk_score < 0.6:
            risk_level = 'Moderate'
        else:
            risk_level = 'High'

        # Log prediction
        app.logger.info(f'Prediction made - Risk Score: {risk_score:.2f}, Level: {risk_level}')

        return jsonify({
            'risk_score': risk_score,
            'risk_level': risk_level,
            'prediction': int(prediction[1] > 0.5),
            'confidence': float(max(prediction))
        })

    except Exception as e:
        app.logger.error(f'Prediction error: {str(e)}')
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500
        app.logger.error(f'Prediction error: {str(e)}')
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=False)