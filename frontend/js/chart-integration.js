// Chart.js Integration for Results Page

// Function to initialize charts once data is loaded
function initializeCharts() {
    // Check if resultData is available from results.js
    if (!window.resultData) {
        console.warn('Result data not available yet, waiting...');
        setTimeout(initializeCharts, 500);
        return;
    }
    
    // Create risk score gauge chart
    createRiskGaugeChart();
    
    // Create comparison chart (user vs population average)
    createComparisonChart();
    
    // Create health factors breakdown chart
    createFactorsChart();
}

// Create a gauge chart to display the risk score
function createRiskGaugeChart() {
    const gaugeCtx = document.getElementById('riskGaugeChart');
    
    // If chart element doesn't exist, exit function
    if (!gaugeCtx) return;
    
    // Get the risk score from the result data
    const score = window.resultData.overallScore;
    
    // Get risk category for color mapping
    const riskCategory = window.resultData.riskCategory;
    
    // Define colors based on risk category
    let color;
    switch(riskCategory) {
        case 'low':
            color = '#4CAF50'; // Green
            break;
        case 'medium':
            color = '#FFC107'; // Yellow/Amber
            break;
        case 'high':
            color = '#F44336'; // Red
            break;
        default:
            color = '#2196F3'; // Blue default
    }
    
    // Create the gauge chart
    new Chart(gaugeCtx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [
                    color,
                    '#f0f0f0'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            circumference: 180,
            rotation: 270,
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Risk Score',
                    position: 'bottom',
                    font: {
                        size: 16
                    }
                }
            },
            maintainAspectRatio: false
        }
    });
    
    // Add the score text in the center
    const scoreText = document.createElement('div');
    scoreText.style.position = 'absolute';
    scoreText.style.top = '50%';
    scoreText.style.left = '50%';
    scoreText.style.transform = 'translate(-50%, -25%)';
    scoreText.style.fontSize = '28px';
    scoreText.style.fontWeight = 'bold';
    scoreText.textContent = score;
    gaugeCtx.parentNode.style.position = 'relative';
    gaugeCtx.parentNode.appendChild(scoreText);
}

// Create a bar chart comparing user values to population averages
function createComparisonChart() {
    const comparisonCtx = document.getElementById('comparisonChart');
    
    // If chart element doesn't exist, exit function
    if (!comparisonCtx) return;
    
    // Get data from results
    const healthMetrics = window.resultData.chartData.healthMetrics;
    
    new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: healthMetrics.labels,
            datasets: [
                {
                    label: 'Your Results',
                    data: healthMetrics.userValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Population Average',
                    data: healthMetrics.avgValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Your Health Metrics vs. Population Average',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Create a pie chart showing breakdown of health factors
function createFactorsChart() {
    const factorsCtx = document.getElementById('factorsChart');
    
    // If chart element doesn't exist, exit function
    if (!factorsCtx) return;
    
    // Get data from results
    const riskFactors = window.resultData.chartData.riskFactors;
    
    new Chart(factorsCtx, {
        type: 'pie',
        data: {
            labels: riskFactors.labels,
            datasets: [{
                data: riskFactors.values,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Risk Factors Breakdown',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Add window load event to ensure charts are initialized after results are loaded
window.addEventListener('load', function() {
    // Wait for results to load first
    setTimeout(initializeCharts, 1500);
}); 