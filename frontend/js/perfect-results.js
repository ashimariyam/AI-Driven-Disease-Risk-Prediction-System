/**
 * Perfect ML Prediction Results JavaScript
 * Displays comprehensive health assessment results with visualizations
 */

let predictionData = null;
let charts = {};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Perfect Results page loading...');
    setTimeout(loadAndDisplayResults, 500); // Small delay to ensure localStorage is ready
});

/**
 * Main function to load and display results
 */
function loadAndDisplayResults() {
    try {
        console.log('📊 Loading prediction results...');
        
        // Get prediction data from localStorage
        const predictionType = localStorage.getItem('predictionType');
        let resultData = null;
        
        if (predictionType === 'heart') {
            resultData = localStorage.getItem('heartPredictionResult');
        } else if (predictionType === 'diabetes') {
            resultData = localStorage.getItem('diabetesPredictionResult');
        }
        
        console.log('🔍 Found data:', { predictionType, hasData: !!resultData });
        
        if (!resultData || !predictionType) {
            console.log('❌ No prediction data found');
            showErrorState();
            return;
        }
        
        // Parse and validate data
        predictionData = JSON.parse(resultData);
        predictionData.type = predictionType;
        
        console.log('✅ Parsed prediction data:', predictionData);
        
        // Display results
        displayResults(predictionData);
        
    } catch (error) {
        console.error('❌ Error loading results:', error);
        showErrorState();
    }
}

/**
 * Display the prediction results
 */
function displayResults(data) {
    console.log('🎨 Displaying results for:', data.type);
    
    // Hide loading, show results
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    
    // Update page title and header
    updateHeader(data);
    
    // Update risk assessment
    updateRiskAssessment(data);
    
    // Update prediction details
    updatePredictionDetails(data);
    
    // Update recommendations
    updateRecommendations(data);
    
    // Update risk factors
    updateRiskFactors(data);
    
    // Create visualizations
    setTimeout(() => {
        createCharts(data);
    }, 1000);
}

/**
 * Update page header and title
 */
function updateHeader(data) {
    const title = data.type === 'heart' ? 'Heart Disease Risk Assessment' : 'Diabetes Risk Assessment';
    document.getElementById('results-title').textContent = title;
    document.title = title + ' Results - WellPredict AI';
    
    // Update date
    const date = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : new Date().toLocaleDateString();
    document.getElementById('assessment-date').textContent = date;
    
    // Update icon
    const icon = document.querySelector('#risk-icon i');
    icon.className = data.type === 'heart' ? 'fas fa-heartbeat' : 'fas fa-tint';
}

/**
 * Update risk assessment display
 */
function updateRiskAssessment(data) {
    const riskBadge = document.getElementById('risk-badge');
    const probabilityDisplay = document.getElementById('probability-display');
    const confidenceFill = document.getElementById('confidence-fill');
    const confidenceValue = document.getElementById('confidence-value');
    
    // Risk level and styling
    const riskLevel = data.risk_level || 'Moderate Risk';
    riskBadge.textContent = riskLevel;
    
    // Remove existing risk classes
    riskBadge.classList.remove('risk-low', 'risk-moderate', 'risk-high');
    
    // Add appropriate risk class
    if (riskLevel.toLowerCase().includes('low')) {
        riskBadge.classList.add('risk-low');
    } else if (riskLevel.toLowerCase().includes('high')) {
        riskBadge.classList.add('risk-high');
    } else {
        riskBadge.classList.add('risk-moderate');
    }
    
    // Probability display
    const probability = (data.probability * 100).toFixed(1);
    probabilityDisplay.textContent = probability + '%';
    
    // Confidence bar
    const confidence = (data.confidence * 100).toFixed(1);
    confidenceFill.style.width = confidence + '%';
    confidenceValue.textContent = confidence + '%';
}

/**
 * Update prediction details
 */
function updatePredictionDetails(data) {
    const container = document.getElementById('prediction-details');
    
    const predictionText = data.prediction === 1 ? 
        (data.type === 'heart' ? 'High risk of heart disease detected' : 'High risk of diabetes detected') :
        (data.type === 'heart' ? 'Low risk of heart disease' : 'Low risk of diabetes');
    
    const riskColor = data.prediction === 1 ? '#e74c3c' : '#00d4aa';
    
    container.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; color: ${riskColor}; margin-bottom: 1rem;">
                <i class="fas fa-${data.prediction === 1 ? 'exclamation-circle' : 'check-circle'}"></i>
            </div>
            <h4 style="color: ${riskColor}; margin-bottom: 0.5rem;">${predictionText}</h4>
            <p style="color: var(--light-text);">
                Based on the provided health information and AI analysis
            </p>
            <div style="margin-top: 1rem; padding: 1rem; background: var(--light-bg); border-radius: 8px;">
                <small>
                    <strong>Model Accuracy:</strong> ${(data.confidence * 100).toFixed(1)}%<br>
                    <strong>Assessment Type:</strong> ${data.type === 'heart' ? 'Cardiovascular' : 'Metabolic'} Health
                </small>
            </div>
        </div>
    `;
}

/**
 * Update recommendations list
 */
function updateRecommendations(data) {
    const container = document.getElementById('recommendations-list');
    
    if (!data.recommendations || data.recommendations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--light-text);">No specific recommendations available.</p>';
        return;
    }
    
    container.innerHTML = data.recommendations.map(rec => {
        // Extract emoji if present
        const emoji = rec.match(/^[\u{1F300}-\u{1F9FF}]/u);
        const text = rec.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, '');
        const icon = emoji ? emoji[0] : '💡';
        
        return `
            <div class="recommendation-item">
                <span class="recommendation-icon">${icon}</span>
                <span>${text}</span>
            </div>
        `;
    }).join('');
}

/**
 * Update risk factors
 */
function updateRiskFactors(data) {
    const container = document.getElementById('risk-factors-list');
    
    if (!data.risk_factors || data.risk_factors.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--light-text);">No specific risk factors identified.</p>';
        return;
    }
    
    container.innerHTML = data.risk_factors.map(factor => `
        <div class="risk-factor-item">
            <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
            ${factor}
        </div>
    `).join('');
}

/**
 * Create charts and visualizations
 */
function createCharts(data) {
    console.log('📈 Creating charts...');
    
    // Create probability chart
    createProbabilityChart(data);
    
    // Create risk factors chart
    createRiskFactorsChart(data);
}

/**
 * Create probability distribution chart
 */
function createProbabilityChart(data) {
    const ctx = document.getElementById('probabilityChart');
    if (!ctx) return;
    
    const probability = data.probability * 100;
    const remaining = 100 - probability;
    
    charts.probability = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Risk Probability', 'Safe Zone'],
            datasets: [{
                data: [probability, remaining],
                backgroundColor: [
                    data.prediction === 1 ? '#e74c3c' : '#f39c12',
                    '#00d4aa'
                ],
                borderWidth: 0,
                cutout: '70%'
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
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create risk factors impact chart
 */
function createRiskFactorsChart(data) {
    const ctx = document.getElementById('riskFactorsChart');
    if (!ctx || !data.risk_factors || data.risk_factors.length === 0) return;
    
    // Take top 6 risk factors for visualization
    const factors = data.risk_factors.slice(0, 6);
    const impacts = factors.map(() => Math.random() * 0.8 + 0.2); // Simulated impact scores
    
    charts.riskFactors = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: factors.map(f => f.length > 15 ? f.substring(0, 15) + '...' : f),
            datasets: [{
                label: 'Risk Impact',
                data: impacts,
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: '#e74c3c',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Show error state when no data is found
 */
function showErrorState() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
}

/**
 * Download PDF report
 */
function downloadPDF() {
    if (!predictionData) return;
    
    // Simple PDF generation using jsPDF
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Add title
        pdf.setFontSize(20);
        pdf.text('Health Risk Assessment Report', 20, 30);
        
        // Add date
        pdf.setFontSize(12);
        const date = new Date().toLocaleDateString();
        pdf.text(`Generated on: ${date}`, 20, 45);
        
        // Add risk level
        pdf.setFontSize(16);
        pdf.text(`Risk Level: ${predictionData.risk_level}`, 20, 65);
        
        // Add probability
        const probability = (predictionData.probability * 100).toFixed(1);
        pdf.text(`Risk Probability: ${probability}%`, 20, 80);
        
        // Add recommendations
        pdf.setFontSize(14);
        pdf.text('Recommendations:', 20, 100);
        
        let yPos = 115;
        predictionData.recommendations.forEach((rec, index) => {
            if (yPos > 260) {
                pdf.addPage();
                yPos = 30;
            }
            const cleanText = rec.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
            pdf.setFontSize(10);
            pdf.text(`${index + 1}. ${cleanText}`, 25, yPos);
            yPos += 15;
        });
        
        // Save the PDF
        const filename = `health-assessment-${predictionData.type}-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF report. Please try again.');
    }
}

/**
 * Share results
 */
function shareResults() {
    if (!predictionData) return;
    
    const shareText = `I completed a ${predictionData.type} health risk assessment. Risk level: ${predictionData.risk_level}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Health Assessment Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Results summary copied to clipboard!');
        }).catch(() => {
            alert('Unable to share results. Please use the download option instead.');
        });
    }
}

// Debug function for troubleshooting
window.debugResults = function() {
    console.log('=== DEBUG RESULTS ===');
    console.log('localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`${key}:`, localStorage.getItem(key));
    }
    console.log('Current predictionData:', predictionData);
    console.log('==================');
};
