// Form submission handlers for heart disease and diabetes prediction

document.addEventListener('DOMContentLoaded', function() {
    // Heart Disease Form Handler
    const heartForm = document.getElementById('heart-form');
    if (heartForm) {
        heartForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get the submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading state
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                // Get form data
                const formData = new FormData(this);
                const data = {};
                
                // Convert form data to JSON and ensure numeric values
                for (let [key, value] of formData.entries()) {
                    // Convert numeric strings to numbers
                    data[key] = isNaN(value) ? value : Number(value);
                }
                
                console.log('Sending heart disease data:', data);
                
                // Send data to backend API
                const response = await fetch('http://localhost:3000/api/predict/heart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || errorData.error || 'Failed to get prediction');
                }
                
                const result = await response.json();
                console.log('Heart disease prediction result:', result);
                
                // Store result in localStorage
                localStorage.setItem('heartPredictionResult', JSON.stringify(result));
                
                // Display result on page
                displayResult('heart', result);
                
                // Show success state
                submitBtn.textContent = 'Success!';
                submitBtn.classList.add('btn-success');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('Error submitting heart disease form:', error);
                submitBtn.textContent = error.message || 'Error. Try Again';
                submitBtn.classList.add('btn-error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-error');
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Diabetes Form Handler
    const diabetesForm = document.getElementById('diabetes-form');
    if (diabetesForm) {
        diabetesForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get the submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading state
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                // Get form data
                const formData = new FormData(this);
                const data = {};
                
                // Convert form data to JSON and ensure numeric values
                for (let [key, value] of formData.entries()) {
                    // Convert numeric strings to numbers
                    data[key] = isNaN(value) ? value : Number(value);
                }
                
                console.log('Sending diabetes data:', data);
                
                // Send data to backend API
                const response = await fetch('http://localhost:3000/api/predict/diabetes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || errorData.error || 'Failed to get prediction');
                }
                
                const result = await response.json();
                console.log('Diabetes prediction result:', result);
                
                // Store result in localStorage
                localStorage.setItem('diabetesPredictionResult', JSON.stringify(result));
                
                // Display result on page
                displayResult('diabetes', result);
                
                // Show success state
                submitBtn.textContent = 'Success!';
                submitBtn.classList.add('btn-success');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('Error submitting diabetes form:', error);
                submitBtn.textContent = error.message || 'Error. Try Again';
                submitBtn.classList.add('btn-error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-error');
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // New Prediction Button Handler
    const newPredictionBtn = document.getElementById('new-prediction-btn');
    if (newPredictionBtn) {
        newPredictionBtn.addEventListener('click', function() {
            // Hide results section
            document.getElementById('results-section').style.display = 'none';
            
            // Reset forms
            document.getElementById('heart-form').reset();
            document.getElementById('diabetes-form').reset();
            
            // Show forms container
            document.querySelector('.forms-container').style.display = 'block';
        });
    }
});

// Function to display prediction results
function displayResult(type, result) {
    const resultsSection = document.getElementById('results-section');
    const resultTitle = document.getElementById('result-title');
    const resultContent = document.getElementById('result-content');
    
    // Hide forms and show results
    document.querySelector('.forms-container').style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Set title
    resultTitle.textContent = type === 'heart' ? 'Heart Disease Risk Assessment' : 'Diabetes Risk Assessment';
    
    // Create result HTML
    const riskScoreClass = result.risk_level.toLowerCase();
    const predictionText = type === 'heart' ? 
        (result.prediction === 1 ? 'Heart Disease Detected' : 'No Heart Disease') :
        (result.prediction === 1 ? 'Diabetes Detected' : 'No Diabetes');
    
    const resultHTML = `
        <div class="risk-score ${riskScoreClass}">
            ${(result.risk_score * 100).toFixed(1)}%
        </div>
        <div class="risk-level ${riskScoreClass}">
            ${result.risk_level} Risk
        </div>
        <div class="prediction-details">
            <h3>Prediction Details</h3>
            <div class="detail-item">
                <span class="detail-label">Prediction:</span>
                <span class="detail-value">${predictionText}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Risk Score:</span>
                <span class="detail-value">${(result.risk_score * 100).toFixed(1)}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Confidence:</span>
                <span class="detail-value">${(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Risk Level:</span>
                <span class="detail-value">${result.risk_level}</span>
            </div>
        </div>
    `;
    
    resultContent.innerHTML = resultHTML;
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Validation functions
function validateHeartForm(formData) {
    const errors = [];
    
    // Required fields validation
    const requiredFields = {
        'age': { min: 29, max: 80 },
        'sex': { type: 'radio' },
        'cp': { type: 'select' },
        'trestbps': { min: 80, max: 200 },
        'chol': { min: 100, max: 600 },
        'fbs': { type: 'radio' },
        'restecg': { type: 'select' },
        'thalach': { min: 60, max: 210 },
        'exang': { type: 'radio' },
        'oldpeak': { min: 0, max: 6, step: 0.1 },
        'slope': { type: 'select' },
        'ca': { type: 'select' },
        'thal': { type: 'select' }
    };

    for (const [field, rules] of Object.entries(requiredFields)) {
        const value = formData.get(field);
        
        if (!value) {
            errors.push(`${field} is required`);
            continue;
        }

        if (rules.type === 'radio' || rules.type === 'select') {
            if (!['0', '1', '2', '3'].includes(value)) {
                errors.push(`${field} has invalid value`);
            }
        } else {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                errors.push(`${field} must be a number`);
            } else if (numValue < rules.min || numValue > rules.max) {
                errors.push(`${field} must be between ${rules.min} and ${rules.max}`);
            }
        }
    }

    return errors;
}

function validateDiabetesForm(formData) {
    const errors = [];
    
    // Required fields validation
    const requiredFields = {
        'pregnancies': { min: 0, max: 20 },
        'glucose': { min: 0, max: 300 },
        'blood_pressure': { min: 0, max: 200 },
        'skin_thickness': { min: 0, max: 100 },
        'insulin': { min: 0, max: 1000 },
        'bmi': { min: 10, max: 100 },
        'diabetes_pedigree': { min: 0, max: 3 },
        'age': { min: 20, max: 100 },
        'family_history': { type: 'radio' },
        'physical_activity': { min: 0, max: 20 },
        'smoking': { type: 'radio' },
        'alcohol': { min: 0, max: 30 }
    };

    for (const [field, rules] of Object.entries(requiredFields)) {
        const value = formData.get(field);
        
        if (!value) {
            errors.push(`${field} is required`);
            continue;
        }

        if (rules.type === 'radio') {
            if (!['0', '1'].includes(value)) {
                errors.push(`${field} has invalid value`);
            }
        } else {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                errors.push(`${field} must be a number`);
            } else if (numValue < rules.min || numValue > rules.max) {
                errors.push(`${field} must be between ${rules.min} and ${rules.max}`);
            }
        }
    }

    return errors;
} 