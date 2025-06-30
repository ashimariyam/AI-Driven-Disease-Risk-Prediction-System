from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import logging
from logging.handlers import RotatingFileHandler

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')

handler = RotatingFileHandler('logs/diabetes_prediction.log', maxBytes=10000, backupCount=1)
handler.setFormatter(logging.Formatter(
    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
))
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)

# Load the model
try:
    model = joblib.load('model.pkl')
    app.logger.info('Diabetes prediction model loaded successfully')
except Exception as e:
    app.logger.error(f'Failed to load model: {str(e)}')
    raise

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.get_json()
        
        # Validate input data
        required_fields = [
            'pregnancies', 'glucose', 'blood_pressure', 'skin_thickness',
            'insulin', 'bmi', 'diabetes_pedigree', 'age', 'family_history',
            'physical_activity', 'smoking', 'alcohol'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': 'Missing required field',
                    'field': field
                }), 400

        # Convert boolean fields to numeric
        family_history = 1 if data['family_history'] == 1 else 0
        smoking = 1 if data['smoking'] == 1 else 0

        # Prepare features
        features = np.array([[
            float(data['pregnancies']),
            float(data['glucose']),
            float(data['blood_pressure']),
            float(data['skin_thickness']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['diabetes_pedigree']),
            float(data['age']),
            float(family_history),
            float(data['physical_activity']),
            float(smoking),
            float(data['alcohol'])
        ]])

        # Make prediction
        prediction = model.predict_proba(features)[0]
        risk_score = float(prediction[1])  # Probability of diabetes

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

if __name__ == '__main__':
    port = int(os.environ.get('FLASK_DIABETES_PORT', 5002))
    app.run(host='0.0.0.0', port=port) 