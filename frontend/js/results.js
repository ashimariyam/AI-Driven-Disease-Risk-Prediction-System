/**
 * Enhanced Results Page JavaScript for HealthPredict AI
 * Displays beautiful prediction results with visualizations and interactions
 */

let currentResult = null;
let charts = {
    pie: null,
    bar: null,
    line: null
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Results page loaded - starting initialization');
    
    // Force immediate debug check
    debugLocalStorage();
    
    // Add a 1 second delay to ensure localStorage is fully available
    setTimeout(() => {
        console.log('🔄 Attempting to load results after delay...');
        loadResults();
    }, 100);
    
    initializeActionButtons();
    
    // Add emergency fallback after 3 seconds
    setTimeout(() => {
        const assessmentDate = document.getElementById('assessment-date');
        if (assessmentDate && assessmentDate.textContent === 'Loading...') {
            console.log('⚠️ Results still loading after 3 seconds, checking localStorage again...');
            debugLocalStorage();
            
            // Try loading again
            loadResults();
        }
    }, 3000);
});

// Debug function to check localStorage contents
function debugLocalStorage() {
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('predictionType:', localStorage.getItem('predictionType'));
    console.log('heartPredictionResult:', localStorage.getItem('heartPredictionResult'));
    console.log('diabetesPredictionResult:', localStorage.getItem('diabetesPredictionResult'));
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('========================');
}

// Main function to load and display results
function loadResults() {
    try {
        // Debug localStorage first
        debugLocalStorage();
        
        // Get prediction type and result data from localStorage
        const predictionType = localStorage.getItem('predictionType');
        const resultData = predictionType === 'heart' ? 
            localStorage.getItem('heartPredictionResult') : 
            localStorage.getItem('diabetesPredictionResult');
        
        console.log('🔍 Loading results:', { predictionType, resultData });
        
        if (!resultData) {
            console.log('❌ No result data found in localStorage');
            showError();
            return;
        }
        
        currentResult = JSON.parse(resultData);
        console.log('📊 Parsed result data:', currentResult);
        
        // Ensure the result has the expected structure
        currentResult = normalizeResultData(currentResult, predictionType);
        currentResult.prediction_type = predictionType;
        
        // Display the results based on type
        if (predictionType === 'heart') {
            displayHeartResults(currentResult);
        } else if (predictionType === 'diabetes') {
            displayDiabetesResults(currentResult);
        } else {
            showError();
            return;
        }
        
        // Initialize visualizations after a short delay
        setTimeout(() => {
            initializeCharts();
        }, 500);
        
    } catch (error) {
        console.error('Error loading results:', error);
        showError();
    }
}

function displayHeartResults(result) {
    console.log('💖 Displaying heart results:', result);
    updatePageHeader('Heart Disease Risk Assessment Results', result);
    const resultsHTML = createResultsHTML(result, 'heart');
    console.log('📄 Generated HTML length:', resultsHTML.length);
    insertResults(resultsHTML);
}

function displayDiabetesResults(result) {
    console.log('🩺 Displaying diabetes results:', result);
    updatePageHeader('Diabetes Risk Assessment Results', result);
    const resultsHTML = createResultsHTML(result, 'diabetes');
    console.log('📄 Generated HTML length:', resultsHTML.length);
    insertResults(resultsHTML);
}

function updatePageHeader(title, result) {
    console.log('📝 Updating page header with:', { title, result });
    
    document.title = title;
    const heroTitle = document.querySelector('#hero-title');
    if (heroTitle) {
        heroTitle.textContent = title;
        console.log('✅ Updated hero title');
    } else {
        console.log('❌ Hero title element not found');
    }
    
    const assessmentDate = document.getElementById('assessment-date');
    if (assessmentDate) {
        const date = result.timestamp ? new Date(result.timestamp).toLocaleDateString() : new Date().toLocaleDateString();
        assessmentDate.textContent = date;
        console.log('✅ Updated assessment date to:', date);
    } else {
        console.log('❌ Assessment date element not found');
    }
}

function createResultsHTML(result, type) {
    return `
        <!-- Results Grid -->
        <div class="results-grid">
            <!-- Overall Risk Assessment Card -->
            <div class="result-card fade-in-up">
                <div class="card-header">
                    <div class="card-icon" style="background: var(--gradient-primary);">
                        <i class="fas fa-${type === 'heart' ? 'heartbeat' : 'tint'}"></i>
                    </div>
                    <h3 class="card-title">Overall Risk Assessment</h3>
                </div>
                <div class="risk-display">
                    <div class="risk-gauge-container">
                        <div class="risk-gauge" style="background: conic-gradient(from 0deg, ${getRiskGradient(result.risk_level)} ${(result.probability * 360)}deg, #e2e8f0 ${(result.probability * 360)}deg);">
                            <div class="gauge-inner">
                                <div class="risk-percentage">${(result.probability * 100).toFixed(1)}%</div>
                                <div class="risk-label">Risk Level</div>
                            </div>
                        </div>
                    </div>
                    <div class="risk-level-badge ${getRiskLevelClass(result.risk_level)}">${result.risk_level}</div>
                    <p style="margin-top: 1.5rem; color: #64748b; font-size: 1.1rem; line-height: 1.6;">
                        ${getRiskDescription(result.risk_level, type)}
                    </p>
                </div>
            </div>

            <!-- Model Confidence Card -->
            <div class="result-card fade-in-up">
                <div class="card-header">
                    <div class="card-icon" style="background: var(--gradient-info);">
                        <i class="fas fa-shield-check"></i>
                    </div>
                    <h3 class="card-title">Model Confidence</h3>
                </div>
                <div class="risk-display">
                    <div class="risk-gauge-container">
                        <div class="risk-gauge" style="background: conic-gradient(from 0deg, var(--gradient-info) ${(result.confidence * 360)}deg, #e2e8f0 ${(result.confidence * 360)}deg);">
                            <div class="gauge-inner">
                                <div class="risk-percentage">${(result.confidence * 100).toFixed(1)}%</div>
                                <div class="risk-label">Confidence</div>
                            </div>
                        </div>
                    </div>
                    <p style="margin-top: 1.5rem; color: #64748b; font-size: 1.1rem;">
                        AI model prediction accuracy and reliability score
                    </p>
                </div>
            </div>

            <!-- Risk Factors Card -->
            <div class="result-card fade-in-up">
                <div class="card-header">
                    <div class="card-icon" style="background: var(--gradient-warning);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 class="card-title">Contributing Risk Factors</h3>
                </div>
                <ul class="enhanced-list">
                    ${result.risk_factors.map(factor => `
                        <li>
                            <div class="list-icon" style="background: var(--gradient-warning);">
                                <i class="fas fa-exclamation"></i>
                            </div>
                            <div class="list-content">
                                <div class="list-title">${formatText(factor)}</div>
                                <div class="list-description">This factor contributes to your overall ${type} risk assessment</div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- Health Recommendations Card -->
            <div class="result-card fade-in-up">
                <div class="card-header">
                    <div class="card-icon" style="background: var(--gradient-success);">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3 class="card-title">Personalized Recommendations</h3>
                </div>
                <ul class="enhanced-list">
                    ${result.recommendations.map(rec => `
                        <li>
                            <div class="list-icon" style="background: var(--gradient-success);">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="list-content">
                                <div class="list-title">${formatText(rec)}</div>
                                <div class="list-description">Recommended action to improve your health outcomes</div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>

        <!-- Health Data Visualizations -->
        <section class="charts-section full-width fade-in-up">
            <div class="card-header">
                <div class="card-icon" style="background: var(--gradient-primary);">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <h3 class="card-title">Health Data Visualizations</h3>
            </div>
            <div class="charts-grid">
                <div class="chart-container">
                    <h4 class="chart-title">Risk Distribution Analysis</h4>
                    <canvas id="riskPieChart" width="400" height="300"></canvas>
                </div>
                <div class="chart-container">
                    <h4 class="chart-title">Health Metrics Comparison</h4>
                    <canvas id="metricsBarChart" width="400" height="300"></canvas>
                </div>
                <div class="chart-container">
                    <h4 class="chart-title">Risk Timeline Projection</h4>
                    <canvas id="riskLineChart" width="400" height="300"></canvas>
                </div>
            </div>
        </section>

        <!-- Next Steps & Action Plan -->
        <section class="result-card full-width fade-in-up" style="margin-bottom: 3rem;">
            <div class="card-header">
                <div class="card-icon" style="background: var(--gradient-primary);">
                    <i class="fas fa-route"></i>
                </div>
                <h3 class="card-title">Your Health Action Plan</h3>
            </div>
            <div class="resources-grid">
                ${getActionPlanCards(type)}
            </div>
        </section>

        <!-- Health Resources -->
        <section class="resources-section full-width fade-in-up">
            <div class="card-header">
                <div class="card-icon" style="background: var(--gradient-pink);">
                    <i class="fas fa-book-medical"></i>
                </div>
                <h3 class="card-title">Additional Health Resources</h3>
            </div>
            <div class="resources-grid">
                ${getHealthResourceCards(type)}
            </div>
        </section>

        <!-- Footer Note -->
        <div class="result-card fade-in-up" style="text-align: center; background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
            <p style="font-size: 1.1rem; margin-bottom: 1rem;"><strong>Important Disclaimer</strong></p>
            <p style="opacity: 0.9; line-height: 1.6;">
                This health risk assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. 
                Always consult with qualified healthcare providers regarding any health concerns or before making medical decisions.
            </p>
        </div>
    `;
}

function insertResults(resultsHTML) {
    console.log('📝 Inserting results HTML...');
    const container = document.querySelector('.results-container');
    if (container) {
        console.log('✅ Container found, inserting HTML');
        container.innerHTML = resultsHTML;
        
        // Re-apply animations
        const elements = container.querySelectorAll('.fade-in-up');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
        console.log(`🎬 Applied animations to ${elements.length} elements`);
    } else {
        console.error('❌ Results container not found!');
    }
}

// Normalize result data to ensure it has all required fields
function normalizeResultData(result, type) {
    // Ensure required fields exist with default values
    const normalized = {
        prediction: result.prediction || 0,
        probability: result.probability || result.risk_percentage / 100 || 0.5,
        risk_level: result.risk_level || 'Moderate',
        confidence: result.confidence || 0.85,
        recommendations: result.recommendations || [],
        risk_factors: result.risk_factors || [],
        timestamp: result.timestamp || new Date().toISOString()
    };
    
    // Ensure probability is between 0 and 1
    if (normalized.probability > 1) {
        normalized.probability = normalized.probability / 100;
    }
    
    // Ensure arrays are actually arrays
    if (!Array.isArray(normalized.recommendations)) {
        normalized.recommendations = [];
    }
    if (!Array.isArray(normalized.risk_factors)) {
        normalized.risk_factors = [];
    }
    
    // Add default recommendations if empty
    if (normalized.recommendations.length === 0) {
        if (type === 'heart') {
            normalized.recommendations = [
                "Maintain regular physical activity",
                "Follow a heart-healthy diet",
                "Monitor blood pressure regularly",
                "Reduce stress levels"
            ];
        } else {
            normalized.recommendations = [
                "Maintain healthy blood glucose levels",
                "Follow a balanced diet low in sugar",
                "Engage in regular physical activity",
                "Monitor weight regularly"
            ];
        }
    }
    
    // Add default risk factors if empty
    if (normalized.risk_factors.length === 0) {
        if (type === 'heart') {
            normalized.risk_factors = [
                "Age and gender factors",
                "Blood pressure levels",
                "Cholesterol levels",
                "Exercise capacity"
            ];
        } else {
            normalized.risk_factors = [
                "Blood glucose levels",
                "BMI and weight factors",
                "Age and family history",
                "Lifestyle factors"
            ];
        }
    }
    
    console.log('✅ Normalized result data:', normalized);
    return normalized;
}

// Helper functions
function getRiskGradient(riskLevel) {
    switch (riskLevel.toLowerCase()) {
        case 'low': return '#00d4aa';
        case 'moderate': return '#ffa726';
        case 'high': return '#f44336';
        default: return '#2196f3';
    }
}

function getRiskLevelClass(riskLevel) {
    switch (riskLevel.toLowerCase()) {
        case 'low': return 'risk-low';
        case 'moderate': return 'risk-moderate';
        case 'high': return 'risk-high';
        default: return 'risk-moderate';
    }
}

function getRiskDescription(riskLevel, type) {
    const disease = type === 'heart' ? 'cardiovascular disease' : 'diabetes';
    
    switch (riskLevel.toLowerCase()) {
        case 'low':
            return `Based on your current health metrics, you have a low risk of developing ${disease}. Continue maintaining your healthy lifestyle!`;
        case 'moderate':
            return `Your assessment indicates a moderate risk for ${disease}. Consider implementing the recommended lifestyle changes to reduce your risk.`;
        case 'high':
            return `The analysis shows a higher risk for ${disease}. It's recommended to consult with a healthcare provider and implement preventive measures.`;
        default:
            return `Your ${disease} risk assessment has been completed. Please review the recommendations below.`;
    }
}

function formatText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getActionPlanCards(type) {
    if (type === 'heart') {
        return `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <h4 class="resource-title">Consult Cardiologist</h4>
                <p class="resource-description">Schedule an appointment with a heart specialist to discuss these results and develop a comprehensive cardiovascular health plan.</p>
                <a href="#" class="resource-link">Find Specialists <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <h4 class="resource-title">Monitor Heart Health</h4>
                <p class="resource-description">Regular monitoring of blood pressure, cholesterol, and other cardiovascular markers.</p>
                <a href="#" class="resource-link">Learn More <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-running"></i>
                </div>
                <h4 class="resource-title">Exercise Program</h4>
                <p class="resource-description">Start a heart-healthy exercise routine tailored to your fitness level and health condition.</p>
                <a href="#" class="resource-link">Get Started <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
    } else {
        return `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <h4 class="resource-title">Consult Endocrinologist</h4>
                <p class="resource-description">Discuss these results with a diabetes specialist for comprehensive evaluation and treatment planning.</p>
                <a href="#" class="resource-link">Find Specialists <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h4 class="resource-title">Monitor Blood Sugar</h4>
                <p class="resource-description">Regular glucose monitoring to track your metabolic health and response to lifestyle changes.</p>
                <a href="#" class="resource-link">Learn More <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-apple-alt"></i>
                </div>
                <h4 class="resource-title">Dietary Management</h4>
                <p class="resource-description">Follow recommended dietary guidelines to manage blood sugar levels and prevent diabetes.</p>
                <a href="#" class="resource-link">Get Started <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
    }
}

function getHealthResourceCards(type) {
    return `
        <div class="resource-card">
            <div class="resource-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <h4 class="resource-title">Health Education</h4>
            <p class="resource-description">Learn more about ${type === 'heart' ? 'cardiovascular health' : 'diabetes prevention'} with evidence-based educational materials.</p>
            <a href="https://www.mayoclinic.org/" class="resource-link" target="_blank">Mayo Clinic <i class="fas fa-external-link-alt"></i></a>
        </div>
        <div class="resource-card">
            <div class="resource-icon">
                <i class="fas fa-users"></i>
            </div>
            <h4 class="resource-title">Support Communities</h4>
            <p class="resource-description">Connect with others who share similar health journeys and experiences.</p>
            <a href="https://www.healthunlocked.com/" class="resource-link" target="_blank">HealthUnlocked <i class="fas fa-external-link-alt"></i></a>
        </div>
        <div class="resource-card">
            <div class="resource-icon">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <h4 class="resource-title">Health Tracking Apps</h4>
            <p class="resource-description">Monitor your progress with recommended health and fitness tracking applications.</p>
            <a href="#" class="resource-link">Explore Apps <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="resource-card">
            <div class="resource-icon">
                <i class="fas fa-phone"></i>
            </div>
            <h4 class="resource-title">Emergency Contacts</h4>
            <p class="resource-description">Important phone numbers and emergency contacts for immediate health concerns.</p>
            <a href="tel:911" class="resource-link">Emergency: 911 <i class="fas fa-phone"></i></a>
        </div>
    `;
}

function showError() {
    const container = document.querySelector('.results-container');
    if (container) {
        container.innerHTML = `
            <div class="result-card fade-in-up" style="text-align: center; padding: 4rem;">
                <div class="card-icon" style="background: var(--gradient-danger); margin: 0 auto 2rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>No Results Found</h3>
                <p style="color: #64748b; margin: 1rem 0 2rem;">
                    We couldn't find any assessment results. Please complete a health assessment first.
                </p>
                <a href="predict.html" class="btn btn-primary">
                    <i class="fas fa-chart-line"></i> Start New Assessment
                </a>
            </div>
        `;
    }
    showNotification('No results data found. Please complete an assessment first.', 'error');
}

// Chart initialization functions
function initializeCharts() {
    if (!currentResult) return;
    
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // Initialize new charts
    setTimeout(() => {
        initRiskPieChart();
        initMetricsBarChart();
        initRiskLineChart();
    }, 100);
}

function initRiskPieChart() {
    const ctx = document.getElementById('riskPieChart');
    if (!ctx) return;
    
    const probability = currentResult.probability;
    const safeProbability = 1 - probability;
    
    charts.pie = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Risk Level', 'Safety Margin'],
            datasets: [{
                data: [probability * 100, safeProbability * 100],
                backgroundColor: [
                    getRiskGradient(currentResult.risk_level),
                    '#e2e8f0'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(1) + '%';
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function initMetricsBarChart() {
    const ctx = document.getElementById('metricsBarChart');
    if (!ctx) return;
    
    charts.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Risk Score', 'Model Confidence', 'Health Score'],
            datasets: [{
                label: 'Health Metrics (%)',
                data: [
                    currentResult.probability * 100,
                    currentResult.confidence * 100,
                    (1 - currentResult.probability) * 100
                ],
                backgroundColor: [
                    'rgba(255, 107, 157, 0.8)',
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(0, 212, 170, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 107, 157, 1)',
                    'rgba(33, 150, 243, 1)',
                    'rgba(0, 212, 170, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

function initRiskLineChart() {
    const ctx = document.getElementById('riskLineChart');
    if (!ctx) return;
    
    // Generate sample timeline data
    const months = ['Current', '3 Months', '6 Months', '1 Year', '2 Years', '5 Years'];
    const currentRisk = currentResult.probability * 100;
    const projectedRisk = [
        currentRisk,
        Math.max(currentRisk - 5, 0),
        Math.max(currentRisk - 10, 0),
        Math.max(currentRisk - 15, 0),
        Math.max(currentRisk - 20, 0),
        Math.max(currentRisk - 25, 0)
    ];
    
    charts.line = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Projected Risk Reduction (%)',
                data: projectedRisk,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(currentRisk + 10, 50),
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Risk Level: ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Enhanced action buttons functionality
function initializeActionButtons() {
    // Print functionality
    const printBtn = document.getElementById('print-results');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
            showNotification('Preparing results for printing...', 'info');
        });
    }
    
    // Share functionality
    const shareBtn = document.getElementById('share-results');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Health Risk Assessment Results',
                        text: 'Check out my health risk assessment results from HealthPredict AI',
                        url: window.location.href
                    });
                    showNotification('Results shared successfully!', 'success');
                } catch (error) {
                    console.log('Error sharing:', error);
                    fallbackShare();
                }
            } else {
                fallbackShare();
            }
        });
    }
    
    // Download PDF functionality
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            generatePDF();
        });
    }
}

function fallbackShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Results link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Unable to share results. Please copy the URL manually.', 'error');
    });
}

function generatePDF() {
    showNotification('Generating PDF...', 'info');
    
    try {
        // Using jsPDF for PDF generation
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get current results data
        const predictionType = localStorage.getItem('predictionType');
        const resultData = predictionType === 'heart' ? 
            localStorage.getItem('heartPredictionResult') : 
            localStorage.getItem('diabetesPredictionResult');
        
        if (!resultData) {
            showNotification('No results data found for PDF generation', 'error');
            return;
        }
        
        const result = JSON.parse(resultData);
        const title = predictionType === 'heart' ? 'Heart Disease Risk Assessment' : 'Diabetes Risk Assessment';
        
        // PDF Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text(title, 20, 30);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
        
        // Risk Overview
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('Risk Assessment Results', 20, 65);
        
        doc.setFontSize(12);
        doc.text(`Risk Level: ${result.risk_level}`, 20, 80);
        doc.text(`Probability: ${(result.probability * 100).toFixed(1)}%`, 20, 95);
        doc.text(`Model Confidence: ${(result.confidence * 100).toFixed(1)}%`, 20, 110);
        
        // Risk Factors
        if (result.risk_factors && result.risk_factors.length > 0) {
            doc.setFontSize(14);
            doc.text('Risk Factors:', 20, 130);
            doc.setFontSize(11);
            result.risk_factors.forEach((factor, index) => {
                doc.text(`• ${factor}`, 25, 145 + (index * 12));
            });
        }
        
        // Recommendations
        if (result.recommendations && result.recommendations.length > 0) {
            const startY = 130 + (result.risk_factors ? result.risk_factors.length * 12 + 30 : 30);
            doc.setFontSize(14);
            doc.text('Recommendations:', 20, startY);
            doc.setFontSize(11);
            result.recommendations.forEach((rec, index) => {
                doc.text(`• ${rec}`, 25, startY + 15 + (index * 12));
            });
        }
        
        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('HealthPredict AI - AI-Driven Disease Risk Prediction System', 20, pageHeight - 20);
        doc.text('This report is for informational purposes only. Consult a healthcare professional.', 20, pageHeight - 10);
        
        // Save the PDF
        const filename = `${predictionType}_risk_assessment_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        showNotification('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function updateConfidenceDisplay(result) {
    const confidencePercentage = document.getElementById('confidence-percentage');
    const confidence = (result.confidence * 100).toFixed(1);
    
    // Animate the confidence percentage
    animateCounter(confidencePercentage, 0, parseFloat(confidence), 2000, '%');
    
    // Update confidence gauge
    const confidenceContainer = confidencePercentage.closest('.risk-gauge-container');
    if (confidenceContainer) {
        const gauge = confidenceContainer.querySelector('.risk-gauge');
        gauge.style.background = `conic-gradient(from 0deg, var(--gradient-info) 0deg, var(--gradient-info) ${confidence * 3.6}deg, #e2e8f0 ${confidence * 3.6}deg)`;
    }
}

function updateRiskFactors(riskFactors) {
    const riskFactorsList = document.getElementById('risk-factors-list');
    
    if (!riskFactors || riskFactors.length === 0) {
        riskFactorsList.innerHTML = `
            <li>
                <div class="list-icon" style="background: var(--info-color);">
                    <i class="fas fa-info"></i>
                </div>
                <div class="list-content">
                    <div class="list-title">No significant risk factors identified</div>
                    <div class="list-description">Your current health profile shows minimal concerning indicators</div>
                </div>
            </li>
        `;
        return;
    }
    
    riskFactorsList.innerHTML = riskFactors.map((factor, index) => `
        <li class="fade-in-up" style="animation-delay: ${index * 0.1}s;">
            <div class="list-icon" style="background: var(--warning-color);">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="list-content">
                <div class="list-title">${formatRiskFactor(factor)}</div>
                <div class="list-description">${getRiskFactorDescription(factor)}</div>
            </div>
        </li>
    `).join('');
}

function updateRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendations-list');
    
    if (!recommendations || recommendations.length === 0) {
        recommendationsList.innerHTML = `
            <li>
                <div class="list-icon" style="background: var(--success-color);">
                    <i class="fas fa-thumbs-up"></i>
                </div>
                <div class="list-content">
                    <div class="list-title">Maintain current healthy lifestyle</div>
                    <div class="list-description">Continue your current health practices and regular check-ups</div>
                </div>
            </li>
        `;
        return;
    }
    
    recommendationsList.innerHTML = recommendations.map((rec, index) => `
        <li class="fade-in-up" style="animation-delay: ${index * 0.1}s;">
            <div class="list-icon" style="background: var(--success-color);">
                <i class="fas fa-lightbulb"></i>
            </div>
            <div class="list-content">
                <div class="list-title">${formatRecommendation(rec)}</div>
                <div class="list-description">${getRecommendationDescription(rec)}</div>
            </div>
        </li>
    `).join('');
}

function initializeCharts(result, type) {
    createRiskPieChart(result);
    createMetricsBarChart(result, type);
    createRiskLineChart(result);
}

function createRiskPieChart(result) {
    const ctx = document.getElementById('riskPieChart');
    if (!ctx) return;
    
    const riskPercentage = result.probability * 100;
    const safePercentage = 100 - riskPercentage;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Risk Level', 'Safe Zone'],
            datasets: [{
                data: [riskPercentage, safePercentage],
                backgroundColor: [
                    getRiskColor(result.risk_level),
                    '#00d4aa'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function createMetricsBarChart(result, type) {
    const ctx = document.getElementById('metricsBarChart');
    if (!ctx) return;
    
    const metrics = getHealthMetrics(result, type);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: metrics.labels,
            datasets: [{
                label: 'Your Values',
                data: metrics.values,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#ff6b9d',
                    '#00d4aa'
                ],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createRiskLineChart(result) {
    const ctx = document.getElementById('riskLineChart');
    if (!ctx) return;
    
    // Generate timeline data (example projection)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentRisk = result.probability * 100;
    const riskProjection = [
        currentRisk,
        currentRisk * 0.95,
        currentRisk * 0.9,
        currentRisk * 0.85,
        currentRisk * 0.8,
        currentRisk * 0.75
    ];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Projected Risk Reduction',
                data: riskProjection,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...riskProjection) + 10,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Helper Functions
function animateCounter(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current * 10) / 10 + suffix;
    }, 16);
}

function getRiskClass(riskLevel) {
    const level = riskLevel.toLowerCase();
    if (level === 'low') return 'success';
    if (level === 'moderate') return 'warning';
    return 'danger';
}

function getRiskColor(riskLevel) {
    const level = riskLevel.toLowerCase();
    if (level === 'low') return '#00d4aa';
    if (level === 'moderate') return '#ffa726';
    return '#f44336';
}

function getRiskDescription(riskLevel, probability) {
    const percentage = (probability * 100).toFixed(1);
    const level = riskLevel.toLowerCase();
    
    if (level === 'low') {
        return `Your risk assessment shows a ${percentage}% probability, indicating a low likelihood of developing the condition. Continue maintaining your healthy lifestyle.`;
    } else if (level === 'moderate') {
        return `Your risk assessment shows a ${percentage}% probability, indicating moderate risk. Consider implementing preventive measures and consulting with healthcare providers.`;
    } else {
        return `Your risk assessment shows a ${percentage}% probability, indicating higher risk. It's important to seek medical consultation and implement immediate lifestyle changes.`;
    }
}

function formatRiskFactor(factor) {
    return factor.charAt(0).toUpperCase() + factor.slice(1);
}

function getRiskFactorDescription(factor) {
    const descriptions = {
        'age': 'Age is a non-modifiable risk factor that increases likelihood over time',
        'high blood pressure': 'Elevated blood pressure puts additional strain on your cardiovascular system',
        'high cholesterol': 'Elevated cholesterol levels can lead to arterial blockages',
        'smoking': 'Tobacco use significantly increases risk of multiple health conditions',
        'diabetes': 'Diabetic condition affects multiple organ systems',
        'family history': 'Genetic predisposition increases your baseline risk',
        'obesity': 'Excess weight contributes to multiple health complications',
        'sedentary lifestyle': 'Lack of physical activity reduces overall health resilience'
    };
    
    return descriptions[factor.toLowerCase()] || 'This factor contributes to your overall health risk profile';
}

function formatRecommendation(rec) {
    return rec.charAt(0).toUpperCase() + rec.slice(1);
}

function getRecommendationDescription(rec) {
    const descriptions = {
        'regular exercise': 'Aim for 150 minutes of moderate aerobic activity per week',
        'healthy diet': 'Focus on fruits, vegetables, lean proteins, and whole grains',
        'quit smoking': 'Smoking cessation shows immediate and long-term health benefits',
        'weight management': 'Maintain a healthy BMI through balanced diet and exercise',
        'stress management': 'Practice relaxation techniques, meditation, or counseling',
        'regular checkups': 'Schedule periodic health screenings and monitoring',
        'medication compliance': 'Take prescribed medications as directed by your healthcare provider',
        'limit alcohol': 'Moderate alcohol consumption or consider abstaining completely'
    };
    
    return descriptions[rec.toLowerCase()] || 'This recommendation can help improve your overall health outlook';
}

function getHealthMetrics(result, type) {
    // This would typically use actual user input data
    // For now, we'll create representative data based on the prediction type
    
    if (type === 'heart') {
        return {
            labels: ['Blood Pressure', 'Cholesterol', 'Heart Rate', 'BMI', 'Exercise'],
            values: [75, 65, 80, 70, 60] // Normalized percentages
        };
    } else {
        return {
            labels: ['Blood Sugar', 'BMI', 'Age Factor', 'Activity Level', 'Diet Score'],
            values: [70, 75, 85, 65, 70] // Normalized percentages
        };
    }
}

function showNoResultsMessage() {
    const container = document.querySelector('.results-grid');
    if (container) {
        container.innerHTML = `
            <div class="result-card full-width" style="text-align: center; padding: 4rem 2rem;">
                <div style="font-size: 4rem; color: #64748b; margin-bottom: 2rem;">
                    <i class="fas fa-search"></i>
                </div>
                <h2 style="color: var(--dark-color); margin-bottom: 1rem;">No Results Found</h2>
                <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 2rem;">
                    We couldn't find any prediction results. Please complete a health assessment first.
                </p>
                <a href="predict.html" class="btn btn-primary">
                    <i class="fas fa-chart-line"></i> Start New Assessment
                </a>
            </div>
        `;
    }
}

function showErrorMessage() {
    const container = document.querySelector('.results-grid');
    if (container) {
        container.innerHTML = `
            <div class="result-card full-width" style="text-align: center; padding: 4rem 2rem;">
                <div style="font-size: 4rem; color: #f44336; margin-bottom: 2rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 style="color: var(--dark-color); margin-bottom: 1rem;">Error Loading Results</h2>
                <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 2rem;">
                    There was an error loading your prediction results. Please try again.
                </p>
                <a href="predict.html" class="btn btn-primary">
                    <i class="fas fa-redo"></i> Try Again
                </a>
            </div>
        `;
    }
}

function initializeResultsPage() {
    // Add any additional initialization here
    console.log('Results page initialized');
}
// Enhanced action buttons functionality
function initializeActionButtons() {
    // Print functionality
    const printBtn = document.getElementById('print-results');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
            showNotification('Preparing results for printing...', 'info');
        });
    }
    
    // Share functionality
    const shareBtn = document.getElementById('share-results');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Health Risk Assessment Results',
                        text: 'Check out my health risk assessment results from AI-Driven Disease Prediction System',
                        url: window.location.href
                    });
                    showNotification('Results shared successfully!', 'success');
                } catch (error) {
                    console.log('Error sharing:', error);
                    fallbackShare();
                }
            } else {
                fallbackShare();
            }
        });
    }
    
    // Download PDF functionality
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            generatePDF();
        });
    }
}

function fallbackShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Results link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Unable to share results. Please copy the URL manually.', 'error');
    });
}

function generatePDF() {
    showNotification('Generating PDF...', 'info');
    
    try {
        // Using jsPDF for PDF generation
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get current results data
        const predictionType = localStorage.getItem('predictionType');
        const resultData = predictionType === 'heart' ? 
            localStorage.getItem('heartPredictionResult') : 
            localStorage.getItem('diabetesPredictionResult');
        
        if (!resultData) {
            showNotification('No results data found for PDF generation', 'error');
            return;
        }
        
        const result = JSON.parse(resultData);
        const title = predictionType === 'heart' ? 'Heart Disease Risk Assessment' : 'Diabetes Risk Assessment';
        
        // PDF Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text(title, 20, 30);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
        
        // Risk Overview
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('Risk Assessment Results', 20, 65);
        
        doc.setFontSize(12);
        doc.text(`Risk Level: ${result.risk_level}`, 20, 80);
        doc.text(`Probability: ${(result.probability * 100).toFixed(1)}%`, 20, 95);
        doc.text(`Model Confidence: ${(result.confidence * 100).toFixed(1)}%`, 20, 110);
        
        // Risk Factors
        if (result.risk_factors && result.risk_factors.length > 0) {
            doc.setFontSize(14);
            doc.text('Risk Factors:', 20, 130);
            doc.setFontSize(11);
            result.risk_factors.forEach((factor, index) => {
                doc.text(`• ${factor}`, 25, 145 + (index * 12));
            });
        }
        
        // Recommendations
        if (result.recommendations && result.recommendations.length > 0) {
            const startY = 130 + (result.risk_factors ? result.risk_factors.length * 12 + 30 : 30);
            doc.setFontSize(14);
            doc.text('Recommendations:', 20, startY);
            doc.setFontSize(11);
            result.recommendations.forEach((rec, index) => {
                doc.text(`• ${rec}`, 25, startY + 15 + (index * 12));
            });
        }
        
        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('AI-Driven Disease Risk Prediction System', 20, pageHeight - 20);
        doc.text('This report is for informational purposes only. Consult a healthcare professional.', 20, pageHeight - 10);
        
        // Save the PDF
        const filename = `${predictionType}_risk_assessment_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        showNotification('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getRiskLevelClass(riskLevel) {
    switch (riskLevel.toLowerCase()) {
        case 'low risk':
            return 'low-risk';
        case 'moderate risk':
            return 'moderate-risk';
        case 'high risk':
            return 'high-risk';
        default:
            return 'unknown-risk';
    }
}

function getRiskDescription(riskLevel, type) {
    const descriptions = {
        'heart': {
            'Low Risk': 'Your cardiovascular risk is currently low. Continue maintaining healthy lifestyle habits.',
            'Moderate Risk': 'You have moderate cardiovascular risk. Consider lifestyle modifications and regular monitoring.',
            'High Risk': 'You have high cardiovascular risk. Immediate medical consultation is strongly recommended.'
        },
        'diabetes': {
            'Low Risk': 'Your diabetes risk is currently low. Continue maintaining healthy lifestyle habits.',
            'Moderate Risk': 'You have moderate diabetes risk. Consider lifestyle modifications and regular monitoring.',
            'High Risk': 'You have high diabetes risk. Immediate medical consultation is strongly recommended.'
        }
    };
    
    return descriptions[type]?.[riskLevel] || 'Risk assessment completed. Please consult with a healthcare provider.';
}

function showNoResultsMessage() {
    const container = document.querySelector('.results-container') || document.querySelector('main');
    if (container) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-info-circle"></i>
                <h2>No Results Found</h2>
                <p>No prediction results were found. Please complete a health assessment first.</p>
                <a href="predict.html" class="btn-primary">Take Assessment</a>
            </div>
        `;
    }
}

function showErrorMessage() {
    const container = document.querySelector('.results-container') || document.querySelector('main');
    if (container) {
        container.innerHTML = `
            <div class="error-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Error Loading Results</h2>
                <p>There was an error loading your results. Please try taking the assessment again.</p>
                <a href="predict.html" class="btn-primary">Retake Assessment</a>
            </div>
        `;
    }
}

function initializeResultsPage() {
    // Print functionality
    const printBtn = document.getElementById('print-results');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // Share functionality
    const shareBtn = document.getElementById('share-results');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Health Risk Assessment Results',
                        text: 'Check out my health risk assessment results from AI-Driven Disease Prediction System',
                        url: window.location.href
                    });
                } catch (error) {
                    console.log('Error sharing:', error);
                }
            } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(window.location.href);
                alert('Results link copied to clipboard!');
            }
        });
    }
    
    // Download PDF functionality (placeholder)
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert('PDF download feature will be implemented in a future update.');
        });
    }
}

// Additional CSS for results display
const resultsStyles = `
    .prediction-results {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .risk-overview {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        margin-bottom: 3rem;
        padding: 2rem;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .risk-level {
        text-align: center;
        padding: 2rem;
        border-radius: 12px;
    }
    
    .risk-level.low-risk {
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
    }
    
    .risk-level.moderate-risk {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
    }
    
    .risk-level.high-risk {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
    }
    
    .risk-percentage {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem 0;
    }
    
    .confidence-score {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .confidence-bar {
        width: 100%;
        height: 20px;
        background: #ecf0f1;
        border-radius: 10px;
        overflow: hidden;
        margin: 1rem 0;
    }
    
    .confidence-fill {
        height: 100%;
        background: #3498db;
        transition: width 1s ease-in-out;
    }
    
    .risk-factors-section,
    .recommendations-section {
        background: #fff;
        padding: 2rem;
        margin-bottom: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .risk-factors-list,
    .recommendations-list {
        list-style: none;
        padding: 0;
    }
    
    .risk-factors-list li,
    .recommendations-list li {
        padding: 0.75rem;
        margin: 0.5rem 0;
        background: #f8f9fa;
        border-left: 4px solid #3498db;
        border-radius: 4px;
    }
    
    .next-steps {
        background: #fff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .action-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
    }
    
    .action-card {
        text-align: center;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        transition: transform 0.3s ease;
    }
    
    .action-card:hover {
        transform: translateY(-5px);
    }
    
    .action-card i {
        font-size: 2rem;
        color: #3498db;
        margin-bottom: 1rem;
    }
    
    .no-results,
    .error-results {
        text-align: center;
        padding: 4rem 2rem;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 2rem auto;
        max-width: 600px;
    }
    
    .no-results i,
    .error-results i {
        font-size: 3rem;
        color: #95a5a6;
        margin-bottom: 1rem;
    }
    
    .btn-primary {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        transition: background-color 0.3s ease;
        margin-top: 1rem;
    }
    
    .btn-primary:hover {
        background-color: #2980b9;
    }
    
    @media (max-width: 768px) {
        .risk-overview {
            grid-template-columns: 1fr;
        }
        
        .action-cards {
            grid-template-columns: 1fr;
        }
        
        .prediction-results {
            padding: 1rem;
        }
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = resultsStyles;
document.head.appendChild(styleSheet);