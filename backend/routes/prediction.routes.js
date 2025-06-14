const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/prediction.controller');

// Heart disease prediction endpoint
router.post('/heart', predictionController.predictHeartDisease);

// Diabetes prediction endpoint
router.post('/diabetes', predictionController.predictDiabetes);

// Get prediction history (optional)
router.get('/history', predictionController.getPredictionHistory);

module.exports = router; 