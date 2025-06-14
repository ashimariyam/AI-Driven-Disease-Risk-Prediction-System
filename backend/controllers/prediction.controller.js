const axios = require('axios');
const { logger } = require('../utils/logger');
const db = require('../services/db');

// Flask service URLs
const FLASK_HEART_URL = `http://localhost:${process.env.FLASK_HEART_PORT || 5001}/predict`;
const FLASK_DIABETES_URL = `http://localhost:${process.env.FLASK_DIABETES_PORT || 5002}/predict`;

// Heart disease prediction handler
async function predictHeartDisease(req, res) {
    try {
        const inputData = req.body;
        
        // Validate required fields
        const requiredFields = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
            'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ];
        
        for (const field of requiredFields) {
            if (inputData[field] === undefined) {
                return res.status(400).json({
                    error: 'Missing required field',
                    field
                });
            }
        }

        // Forward to Flask service
        const response = await axios.post(FLASK_HEART_URL, inputData);
        const prediction = response.data;

        // Store prediction in database
        await db.query(
            'INSERT INTO predictions (prediction_type, input_data, prediction_result) VALUES (?, ?, ?)',
            ['heart', JSON.stringify(inputData), JSON.stringify(prediction)]
        );

        res.json(prediction);
    } catch (error) {
        logger.error('Heart disease prediction error:', error);
        
        if (error.response) {
            // Flask service error
            res.status(error.response.status).json(error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            // Flask service not running
            res.status(503).json({
                error: 'Prediction service unavailable',
                message: 'The prediction service is currently unavailable. Please try again later.'
            });
        } else {
            // Other errors
            res.status(500).json({
                error: 'Prediction failed',
                message: 'An error occurred while processing your prediction request.'
            });
        }
    }
}

// Diabetes prediction handler
async function predictDiabetes(req, res) {
    try {
        const inputData = req.body;
        
        // Validate required fields
        const requiredFields = [
            'pregnancies', 'glucose', 'blood_pressure', 'skin_thickness',
            'insulin', 'bmi', 'diabetes_pedigree', 'age', 'family_history',
            'physical_activity', 'smoking', 'alcohol'
        ];
        
        for (const field of requiredFields) {
            if (inputData[field] === undefined) {
                return res.status(400).json({
                    error: 'Missing required field',
                    field
                });
            }
        }

        // Forward to Flask service
        const response = await axios.post(FLASK_DIABETES_URL, inputData);
        const prediction = response.data;

        // Store prediction in database
        await db.query(
            'INSERT INTO predictions (prediction_type, input_data, prediction_result) VALUES (?, ?, ?)',
            ['diabetes', JSON.stringify(inputData), JSON.stringify(prediction)]
        );

        res.json(prediction);
    } catch (error) {
        logger.error('Diabetes prediction error:', error);
        
        if (error.response) {
            // Flask service error
            res.status(error.response.status).json(error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            // Flask service not running
            res.status(503).json({
                error: 'Prediction service unavailable',
                message: 'The prediction service is currently unavailable. Please try again later.'
            });
        } else {
            // Other errors
            res.status(500).json({
                error: 'Prediction failed',
                message: 'An error occurred while processing your prediction request.'
            });
        }
    }
}

// Get prediction history
async function getPredictionHistory(req, res) {
    try {
        const [rows] = await db.query(
            'SELECT * FROM predictions ORDER BY created_at DESC LIMIT 100'
        );
        
        res.json(rows);
    } catch (error) {
        logger.error('Error fetching prediction history:', error);
        res.status(500).json({
            error: 'Failed to fetch prediction history',
            message: 'An error occurred while retrieving prediction history.'
        });
    }
}

module.exports = {
    predictHeartDisease,
    predictDiabetes,
    getPredictionHistory
}; 