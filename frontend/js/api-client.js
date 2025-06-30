/**
 * API Client for AI-Driven Disease Risk Prediction System
 * Connects frontend to FastAPI backend
 */

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

/**
 * API Client Class
 */
class PredictionAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Make HTTP request to API
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    /**
     * Predict heart disease risk
     */
    async predictHeartDisease(formData) {
        return await this.makeRequest('/predict/heart', 'POST', formData);
    }

    /**
     * Predict diabetes risk
     */
    async predictDiabetes(formData) {
        return await this.makeRequest('/predict/diabetes', 'POST', formData);
    }

    /**
     * Health check
     */
    async healthCheck() {
        return await this.makeRequest('/health');
    }
}

// Create global API instance
const predictionAPI = new PredictionAPI();

/**
 * Updated form submission handlers for FastAPI integration
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check API health on page load
    checkAPIHealth();
    
    // Initialize form handlers
    initializeFormHandlers();
});

async function checkAPIHealth() {
    try {
        const health = await predictionAPI.healthCheck();
        console.log('✅ API Health Check:', health);
        
        // Hide status indicator when everything is working
        const statusIndicator = document.getElementById('api-status');
        if (statusIndicator) {
            statusIndicator.style.display = 'none';
        }
    } catch (error) {
        console.error('❌ API Health Check Failed:', error);
        
        // Only show status when there's a problem
        const statusIndicator = document.getElementById('api-status');
        if (statusIndicator) {
            statusIndicator.textContent = '⚠️ Server Offline';
            statusIndicator.className = 'api-status disconnected';
            statusIndicator.style.display = 'flex';
            statusIndicator.style.opacity = '1';
            statusIndicator.style.transform = 'translateX(0)';
        }
    }
}

function initializeFormHandlers() {
    console.log('🔧 Initializing form handlers...');
    
    // Heart Disease Form Handler
    const heartForm = document.getElementById('heart-form');
    if (heartForm) {
        console.log('✅ Found heart form, attaching handler');
        heartForm.addEventListener('submit', handleHeartFormSubmission);
    } else {
        console.log('❌ Heart form not found');
    }

    // Diabetes Form Handler
    const diabetesForm = document.getElementById('diabetes-form');
    if (diabetesForm) {
        console.log('✅ Found diabetes form, attaching handler');
        diabetesForm.addEventListener('submit', handleDiabetesFormSubmission);
    } else {
        console.log('❌ Diabetes form not found');
    }
}

/**
 * Handle Heart Disease Form Submission
 */
async function handleHeartFormSubmission(e) {
    e.preventDefault();
    console.log('🚀 Heart form submitted!');
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Extract form data
        const formData = extractHeartFormData(form);
        console.log('Heart form data:', formData);
        
        // Make API request
        const result = await predictionAPI.predictHeartDisease(formData);
        console.log('Heart prediction result:', result);
        
        // Store result for results page
        localStorage.setItem('heartPredictionResult', JSON.stringify(result));
        localStorage.setItem('predictionType', 'heart');
        
        // Show success and redirect
        submitBtn.textContent = 'Success! Redirecting...';
        submitBtn.classList.add('btn-success');
        
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 1000);
        
    } catch (error) {
        console.error('Heart prediction error:', error);
        
        // Show error state
        submitBtn.textContent = 'Error. Try Again';
        submitBtn.classList.add('btn-error');
        
        // Show error message to user
        showErrorMessage('Heart prediction failed: ' + error.message);
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-error');
            submitBtn.disabled = false;
        }, 3000);
    }
}

/**
 * Handle Diabetes Form Submission
 */
async function handleDiabetesFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Extract form data
        const formData = extractDiabetesFormData(form);
        console.log('Diabetes form data:', formData);
        
        // Make API request
        const result = await predictionAPI.predictDiabetes(formData);
        console.log('Diabetes prediction result:', result);
        
        // Store result for results page
        localStorage.setItem('diabetesPredictionResult', JSON.stringify(result));
        localStorage.setItem('predictionType', 'diabetes');
        
        // Show success and redirect
        submitBtn.textContent = 'Success! Redirecting...';
        submitBtn.classList.add('btn-success');
        
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 1000);
        
    } catch (error) {
        console.error('Diabetes prediction error:', error);
        
        // Show error state
        submitBtn.textContent = 'Error. Try Again';
        submitBtn.classList.add('btn-error');
        
        // Show error message to user
        showErrorMessage('Diabetes prediction failed: ' + error.message);
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-error');
            submitBtn.disabled = false;
        }, 3000);
    }
}

/**
 * Extract Heart Disease Form Data
 */
function extractHeartFormData(form) {
    return {
        age: parseInt(form.querySelector('#heart-age').value),
        sex: parseInt(form.querySelector('input[name="sex"]:checked').value),
        cp: parseInt(form.querySelector('#cp').value),
        trestbps: parseInt(form.querySelector('#trestbps').value),
        chol: parseInt(form.querySelector('#chol').value),
        fbs: parseInt(form.querySelector('input[name="fbs"]:checked').value),
        restecg: parseInt(form.querySelector('#restecg').value),
        thalach: parseInt(form.querySelector('#thalach').value),
        exang: parseInt(form.querySelector('input[name="exang"]:checked').value),
        oldpeak: parseFloat(form.querySelector('#oldpeak').value),
        slope: parseInt(form.querySelector('#slope').value),
        ca: parseInt(form.querySelector('#ca').value),
        thal: parseInt(form.querySelector('#thal').value)
    };
}

/**
 * Extract Diabetes Form Data
 */
function extractDiabetesFormData(form) {
    return {
        pregnancies: parseInt(form.querySelector('#diabetes-pregnancies').value),
        glucose: parseInt(form.querySelector('#diabetes-glucose').value),
        blood_pressure: parseInt(form.querySelector('#diabetes-bp').value),
        skin_thickness: parseInt(form.querySelector('#diabetes-skin').value),
        insulin: parseInt(form.querySelector('#diabetes-insulin').value),
        bmi: parseFloat(form.querySelector('#diabetes-bmi').value),
        diabetes_pedigree: parseFloat(form.querySelector('#diabetes-pedigree').value),
        age: parseInt(form.querySelector('#diabetes-age').value),
        family_history: parseInt(form.querySelector('input[name="family_history"]:checked').value),
        physical_activity: parseFloat(form.querySelector('#diabetes-activity').value),
        smoking: parseInt(form.querySelector('input[name="smoking"]:checked').value),
        alcohol: parseInt(form.querySelector('#diabetes-alcohol').value)
    };
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

/**
 * CSS for error notifications and API status
 */
const additionalStyles = `
    .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
    
    .api-status {
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .api-status::before {
        content: '●';
        font-size: 10px;
        animation: pulse 2s infinite;
    }
    
    .api-status.connected {
        background: rgba(46, 204, 113, 0.9);
        color: white;
        border-color: rgba(39, 174, 96, 0.3);
    }
    
    .api-status.disconnected {
        background: rgba(231, 76, 60, 0.9);
        color: white;
        border-color: rgba(192, 57, 43, 0.3);
    }
    
    .api-status.checking {
        background: rgba(243, 156, 18, 0.9);
        color: white;
        border-color: rgba(230, 126, 34, 0.3);
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    /* Hide API status on small screens to avoid clutter */
    @media (max-width: 768px) {
        .api-status {
            top: 60px;
            right: 10px;
            font-size: 0.75rem;
            padding: 6px 12px;
        }
    }
    
    .btn-success {
        background-color: #27ae60 !important;
        border-color: #27ae60 !important;
    }
    
    .btn-error {
        background-color: #e74c3c !important;
        border-color: #e74c3c !important;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
