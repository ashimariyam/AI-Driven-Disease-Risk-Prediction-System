/**
 * WellPredict - Results Display JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    initAOS();
    
    // Display prediction results
    displayResults();
    
    // Add event listeners for result actions
    initResultActions();
});

/**
 * Initialize AOS (Animate on Scroll)
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50
        });
    }
}

/**
 * Display Prediction Results
 */
function displayResults() {
    // Get the last assessment type
    const lastAssessment = localStorage.getItem('lastAssessment');
    
    // Use the last assessment to determine which result to display prominently
    let mainResultData;
    let serviceTitle;
    
    // Set default mock data in case no assessment has been completed
    const mockResultData = {
        assessmentDate: "Not yet assessed",
        overallScore: 0,
        riskCategory: "medium",
        primaryInsight: "No assessments have been completed yet. Please complete an assessment to see your results.",
        detailedInsights: [],
        recommendations: [],
        nextSteps: [],
        chartData: {
            healthMetrics: {
                userValues: [0, 0, 0, 0, 0],
                avgValues: [50, 50, 50, 50, 50],
                labels: ['Blood Pressure', 'Cholesterol', 'Blood Sugar', 'BMI', 'Activity']
            },
            riskFactors: {
                values: [0, 0, 0, 0, 0],
                labels: ['Lifestyle', 'Genetic', 'Environmental', 'Medical History', 'Age-Related']
            }
        }
    };
    
    // Load the appropriate result data based on the last assessment
    if (lastAssessment) {
        switch (lastAssessment) {
            case 'heart':
                mainResultData = getHeartRiskData();
                serviceTitle = "Heart Health Assessment";
                break;
            case 'diabetes':
                mainResultData = getDiabetesRiskData();
                serviceTitle = "Diabetes Risk Prediction";
                break;
            case 'lungs':
                mainResultData = getLungCancerRiskData();
                serviceTitle = "Lung Cancer Risk Assessment";
                break;
            case 'symptoms':
                mainResultData = getSymptomCheckerData();
                serviceTitle = "Symptom Checker";
                break;
            case 'health-score':
                mainResultData = getHealthScoreData();
                serviceTitle = "Overall Health Score";
                break;
            default:
                mainResultData = mockResultData;
                serviceTitle = "Health Assessment Results";
        }
    } else {
        mainResultData = mockResultData;
        serviceTitle = "Health Assessment Results";
    }
    
    // Update the main result area with the selected result
    if (mainResultData) {
        updateMainResultArea(mainResultData, serviceTitle);
    }
    
    // Make the result data globally available for chart integration
    window.resultData = mainResultData;
}

/**
 * Get Heart Risk Data
 * @returns {Object} - The heart risk result data, or null if not available
 */
function getHeartRiskData() {
    const heartData = localStorage.getItem('heartRisk');
    if (!heartData) return null;
    
    try {
        const parsedData = JSON.parse(heartData);
        const result = parsedData.result;
        const dateTime = new Date(parsedData.timestamp).toLocaleDateString();
        
        // Format the data for display
        return {
            assessmentDate: dateTime,
            overallScore: result.riskScore,
            riskCategory: result.riskCategory,
            primaryInsight: `Based on your cardiovascular assessment, your heart health shows ${getRiskDescription(result.riskCategory)} risk factors.`,
            detailedInsights: result.insights,
            recommendations: [
                "Maintain a heart-healthy diet rich in fruits, vegetables, and whole grains",
                "Engage in regular aerobic exercise (at least 150 minutes per week)",
                "Monitor your blood pressure regularly",
                "Limit sodium intake to reduce hypertension risk"
            ],
            nextSteps: [
                "Schedule a follow-up with your primary care physician",
                "Consider a comprehensive lipid panel test",
                "Discuss medication options if risk factors persist",
                "Implement stress reduction techniques"
            ],
            chartData: {
                healthMetrics: {
                    userValues: [
                        mapBPToMetric(result.details.bloodPressure), 
                        mapCholesterolToMetric(result.details.cholesterol),
                        50, // Placeholder for blood sugar
                        50, // Placeholder for BMI
                        result.details.smoker === 'Yes' ? 30 : 70 // Activity score lower if smoker
                    ],
                    avgValues: [50, 50, 50, 50, 50],
                    labels: ['Blood Pressure', 'Cholesterol', 'Blood Sugar', 'BMI', 'Activity']
                },
                riskFactors: {
                    values: [30, 25, 15, 20, 10],
                    labels: ['Lifestyle', 'Genetic', 'Environmental', 'Medical History', 'Age-Related']
                }
            }
        };
    } catch (error) {
        console.error("Error parsing heart risk data:", error);
        return null;
    }
}

/**
 * Get Diabetes Risk Data
 * @returns {Object} - The diabetes risk result data, or null if not available
 */
function getDiabetesRiskData() {
    const diabetesData = localStorage.getItem('diabetesRisk');
    if (!diabetesData) return null;
    
    try {
        const parsedData = JSON.parse(diabetesData);
        const result = parsedData.result;
        const dateTime = new Date(parsedData.timestamp).toLocaleDateString();
        
        // Format the data for display
        return {
            assessmentDate: dateTime,
            overallScore: result.riskPercentage,
            riskCategory: result.riskCategory,
            primaryInsight: `Based on your diabetes risk assessment, your profile indicates ${getRiskDescription(result.riskCategory)} risk of developing type 2 diabetes in the next 5 years.`,
            detailedInsights: result.insights,
            recommendations: [
                "Maintain a balanced diet low in refined carbohydrates",
                "Aim for at least 30 minutes of moderate exercise daily",
                "Maintain a healthy BMI (18.5-24.9)",
                "Monitor your blood glucose levels regularly"
            ],
            nextSteps: [
                "Schedule a follow-up with your healthcare provider",
                "Consider regular A1C testing",
                "Join a diabetes prevention program if available",
                "Learn about monitoring blood glucose"
            ],
            chartData: {
                healthMetrics: {
                    userValues: [
                        50, // Placeholder for blood pressure
                        50, // Placeholder for cholesterol
                        mapGlucoseToMetric(result.details.fastingGlucose),
                        mapBMIToMetric(result.details.bmi),
                        mapActivityToMetric(result.details.activityLevel)
                    ],
                    avgValues: [50, 50, 50, 50, 50],
                    labels: ['Blood Pressure', 'Cholesterol', 'Blood Sugar', 'BMI', 'Activity']
                },
                riskFactors: {
                    values: [35, 20, 10, 25, 10],
                    labels: ['Lifestyle', 'Genetic', 'Environmental', 'Medical History', 'Age-Related']
                }
            }
        };
    } catch (error) {
        console.error("Error parsing diabetes risk data:", error);
        return null;
    }
}

/**
 * Get Lung Cancer Risk Data
 * @returns {Object} - The lung cancer risk result data, or null if not available
 */
function getLungCancerRiskData() {
    const lungData = localStorage.getItem('lungCancerRisk');
    if (!lungData) return null;
    
    try {
        const parsedData = JSON.parse(lungData);
        const result = parsedData.result;
        const dateTime = new Date(parsedData.timestamp).toLocaleDateString();
        
        // Map risk level to risk category
        let riskCategory;
        if (result.riskLevel.includes('Low')) riskCategory = 'low';
        else if (result.riskLevel.includes('Slightly') || result.riskLevel.includes('Moderately')) riskCategory = 'medium';
        else riskCategory = 'high';
        
        // Format the data for display
        return {
            assessmentDate: dateTime,
            overallScore: result.riskScore,
            riskCategory: riskCategory,
            primaryInsight: result.riskDescription,
            detailedInsights: result.insights,
            recommendations: [
                "If you smoke, consider smoking cessation programs",
                "Avoid exposure to secondhand smoke",
                "Test your home for radon",
                "Minimize exposure to environmental pollutants"
            ],
            nextSteps: [
                "Discuss lung cancer screening options with your healthcare provider",
                "Consider a pulmonary function test",
                "Learn about warning signs of lung cancer",
                "Create a plan to reduce risk factors"
            ],
            chartData: {
                healthMetrics: {
                    userValues: [
                        50, // Placeholder for blood pressure
                        50, // Placeholder for cholesterol
                        50, // Placeholder for blood sugar
                        50, // Placeholder for BMI
                        mapSmokingToActivityMetric(result.details.smokingStatus)
                    ],
                    avgValues: [50, 50, 50, 50, 50],
                    labels: ['Blood Pressure', 'Cholesterol', 'Blood Sugar', 'BMI', 'Activity']
                },
                riskFactors: {
                    values: [
                        result.details.smokingStatus === 'never' ? 10 : 40, // Lifestyle
                        15, // Genetic
                        25, // Environmental
                        10, // Medical History
                        10  // Age-Related
                    ],
                    labels: ['Lifestyle', 'Genetic', 'Environmental', 'Medical History', 'Age-Related']
                }
            }
        };
    } catch (error) {
        console.error("Error parsing lung cancer risk data:", error);
        return null;
    }
}

/**
 * Get Symptom Checker Data
 * @returns {Object} - The symptom checker result data, or null if not available
 */
function getSymptomCheckerData() {
    const symptomData = localStorage.getItem('symptomResult');
    if (!symptomData) return null;
    
    try {
        const parsedData = JSON.parse(symptomData);
        const result = parsedData.result;
        const dateTime = new Date(parsedData.timestamp).toLocaleDateString();
        
        // Map condition to risk category
        let riskCategory;
        if (result.condition === 'Common Cold' || result.condition === 'Seasonal Allergies') {
            riskCategory = 'low';
        } else if (result.condition === 'Inconclusive' || result.certainty === 'Low') {
            riskCategory = 'medium';
        } else if (result.condition === 'Potential Serious Condition') {
            riskCategory = 'high';
        } else {
            riskCategory = 'medium';
        }
        
        // Calculate a score based on condition severity
        let score;
        if (riskCategory === 'low') score = 25;
        else if (riskCategory === 'medium') score = 50;
        else score = 85;
        
        // Generate insights from symptoms
        const insights = [];
        for (const symptom of result.details.symptoms) {
            insights.push(`Reported symptom: ${formatSymptomName(symptom)}`);
        }
        insights.push(`Symptom duration: ${formatDuration(result.details.duration)}`);
        insights.push(`Symptom severity: ${formatSeverity(result.details.severity)}`);
        
        // Format the data for display
        return {
            assessmentDate: dateTime,
            overallScore: score,
            riskCategory: riskCategory,
            primaryInsight: result.description,
            detailedInsights: insights,
            recommendations: result.recommendations,
            nextSteps: getNextStepsForSymptoms(result.condition, result.certainty),
            chartData: {
                healthMetrics: {
                    userValues: generateSymptomMetrics(result.details.symptoms, result.details.severity),
                    avgValues: [50, 50, 50, 50, 50],
                    labels: ['Respiratory', 'Pain', 'Digestive', 'Energy', 'Sleep']
                },
                riskFactors: {
                    values: [20, 20, 20, 20, 20],
                    labels: ['Viral', 'Bacterial', 'Environmental', 'Lifestyle', 'Genetic']
                }
            }
        };
    } catch (error) {
        console.error("Error parsing symptom data:", error);
        return null;
    }
}

/**
 * Get Health Score Data
 * @returns {Object} - The health score result data, or null if not available
 */
function getHealthScoreData() {
    const healthScoreData = localStorage.getItem('healthScore');
    if (!healthScoreData) return null;
    
    try {
        const parsedData = JSON.parse(healthScoreData);
        const result = parsedData.result;
        const dateTime = new Date(parsedData.timestamp).toLocaleDateString();
        
        // Map health status to risk category
        let riskCategory;
        if (result.healthStatus === 'Excellent') riskCategory = 'low';
        else if (result.healthStatus === 'Good') riskCategory = 'low';
        else if (result.healthStatus === 'Fair') riskCategory = 'medium';
        else riskCategory = 'high';
        
        // Format the data for display
        return {
            assessmentDate: dateTime,
            overallScore: result.healthScore,
            riskCategory: riskCategory,
            primaryInsight: `Your overall health assessment shows a ${result.healthStatus.toLowerCase()} score. ${getHealthStatusDescription(result.healthStatus)}`,
            detailedInsights: result.insights,
            recommendations: result.improvementAreas,
            nextSteps: [
                "Schedule a comprehensive health check-up",
                "Discuss your health score results with your physician",
                "Create a health improvement plan with measurable goals",
                "Consider follow-up assessments every 3-6 months"
            ],
            chartData: {
                healthMetrics: {
                    userValues: [
                        50, // Placeholder
                        50, // Placeholder
                        50, // Placeholder
                        mapBMIToMetric(result.details.bmi),
                        mapExerciseToMetric(result.details.exerciseHours)
                    ],
                    avgValues: [50, 50, 50, 50, 50],
                    labels: ['Blood Pressure', 'Cholesterol', 'Blood Sugar', 'BMI', 'Activity']
                },
                riskFactors: {
                    values: [
                        30, // Lifestyle
                        15, // Genetic
                        15, // Environmental
                        20, // Medical History
                        20  // Age-Related
                    ],
                    labels: ['Lifestyle', 'Genetic', 'Environmental', 'Medical History', 'Age-Related']
                }
            }
        };
    } catch (error) {
        console.error("Error parsing health score data:", error);
        return null;
    }
}

/**
 * Update Main Result Area
 * @param {Object} resultData - The result data to display
 * @param {string} serviceTitle - The title of the service
 */
function updateMainResultArea(resultData, serviceTitle) {
    // Update page title
    document.title = `${serviceTitle} Results | WellPredict`;
    
    // Update assessment date
    document.getElementById('assessment-date').textContent = resultData.assessmentDate;
    
    // Update score
    const scoreElement = document.getElementById('health-score');
    scoreElement.textContent = resultData.overallScore;
    
    // Update risk class
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.className = 'score-circle'; // Reset classes
    scoreCircle.classList.add(`${resultData.riskCategory}-risk`);
    
    // Update risk label
    const scoreLabel = document.querySelector('.score-label');
    scoreLabel.textContent = getRiskLabel(resultData.riskCategory);
    
    // Update primary insight
    document.getElementById('primary-insight').textContent = resultData.primaryInsight;
    
    // Update detailed insights list
    updateList('details-list', resultData.detailedInsights);
    
    // Update recommendations list
    updateList('recommendations-list', resultData.recommendations);
    
    // Update next steps list
    updateList('next-steps-list', resultData.nextSteps);
}

/**
 * Update a List Element
 * @param {string} listId - The ID of the list element to update
 * @param {Array} items - The items to add to the list
 */
function updateList(listId, items) {
    const listElement = document.getElementById(listId);
    if (!listElement) return;
    
    // Clear existing items
    listElement.innerHTML = '';
    
    // Add new items
    if (items && items.length > 0) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listElement.appendChild(li);
        });
    } else {
        // Add a placeholder if no items are available
        const li = document.createElement('li');
        li.textContent = 'No data available';
        listElement.appendChild(li);
    }
}

/**
 * Get Risk Description
 * @param {string} riskCategory - The risk category (low, medium, high)
 * @returns {string} - A description of the risk level
 */
function getRiskDescription(riskCategory) {
    switch (riskCategory) {
        case 'low': return 'a healthy profile with minor';
        case 'medium': return 'moderate';
        case 'high': return 'significant';
        default: return 'unknown';
    }
}

/**
 * Get Risk Label
 * @param {string} riskCategory - The risk category (low, medium, high)
 * @returns {string} - A label for the risk level
 */
function getRiskLabel(riskCategory) {
    switch (riskCategory) {
        case 'low': return 'Low Risk';
        case 'medium': return 'Moderate Risk';
        case 'high': return 'High Risk';
        default: return 'Unknown Risk';
    }
}

/**
 * Get Health Status Description
 * @param {string} healthStatus - The health status
 * @returns {string} - A description of the health status
 */
function getHealthStatusDescription(healthStatus) {
    switch (healthStatus) {
        case 'Excellent': return 'Continue your healthy habits!';
        case 'Good': return 'Some minor improvements could help optimize your health.';
        case 'Fair': return 'Several areas could benefit from improvement.';
        case 'Poor': return 'Multiple areas require attention to improve your overall health status.';
        default: return '';
    }
}

/**
 * Get Next Steps For Symptoms
 * @param {string} condition - The identified condition
 * @param {string} certainty - The certainty level
 * @returns {Array} - Array of next steps
 */
function getNextStepsForSymptoms(condition, certainty) {
    if (condition === 'Potential Serious Condition') {
        return [
            "Seek immediate medical attention",
            "Bring a list of your symptoms to your provider",
            "Document when symptoms began and their progression",
            "Inform healthcare providers of any medications you're taking"
        ];
    } else if (certainty === 'Low') {
        return [
            "Schedule an appointment with your healthcare provider for a proper diagnosis",
            "Keep a symptom journal to track changes",
            "Avoid self-medication until a diagnosis is confirmed",
            "Follow up if symptoms worsen or persist"
        ];
    } else {
        return [
            "Follow the recommended treatment plan",
            "Rest and stay hydrated",
            "Monitor your symptoms for any changes",
            "Consult a healthcare provider if symptoms worsen"
        ];
    }
}

/**
 * Map Blood Pressure to Metric (0-100)
 * @param {string} bpString - Blood pressure string (e.g., "120/80 mmHg")
 * @returns {number} - Metric value (0-100)
 */
function mapBPToMetric(bpString) {
    try {
        const parts = bpString.split('/');
        const systolic = parseInt(parts[0]);
        
        // Lower is better, up to a point
        if (systolic < 120) return 80; // Optimal
        if (systolic < 130) return 70; // Normal
        if (systolic < 140) return 60; // High-normal
        if (systolic < 160) return 40; // Grade 1 hypertension
        if (systolic < 180) return 20; // Grade 2 hypertension
        return 10; // Grade 3 hypertension
    } catch (e) {
        return 50; // Default
    }
}

/**
 * Map Cholesterol to Metric (0-100)
 * @param {number} cholesterol - Total cholesterol value
 * @returns {number} - Metric value (0-100)
 */
function mapCholesterolToMetric(cholesterol) {
    // Lower is better
    if (cholesterol < 180) return 90; // Optimal
    if (cholesterol < 200) return 75; // Desirable
    if (cholesterol < 240) return 50; // Borderline high
    if (cholesterol < 280) return 30; // High
    return 10; // Very high
}

/**
 * Map Glucose to Metric (0-100)
 * @param {number} glucose - Fasting glucose value
 * @returns {number} - Metric value (0-100)
 */
function mapGlucoseToMetric(glucose) {
    // Lower is better
    if (glucose < 100) return 90; // Normal
    if (glucose < 126) return 50; // Prediabetes
    return 20; // Diabetes
}

/**
 * Map BMI to Metric (0-100)
 * @param {number} bmi - BMI value
 * @returns {number} - Metric value (0-100)
 */
function mapBMIToMetric(bmi) {
    // Ideal range is 18.5-24.9
    if (bmi < 18.5) return 60; // Underweight
    if (bmi < 25) return 90; // Normal
    if (bmi < 30) return 60; // Overweight
    if (bmi < 35) return 30; // Obese (Class 1)
    if (bmi < 40) return 20; // Obese (Class 2)
    return 10; // Obese (Class 3)
}

/**
 * Map Activity Level to Metric (0-100)
 * @param {string} activity - Activity level
 * @returns {number} - Metric value (0-100)
 */
function mapActivityToMetric(activity) {
    switch (activity) {
        case 'sedentary': return 20;
        case 'light': return 40;
        case 'moderate': return 60;
        case 'active': return 80;
        case 'veryActive': return 90;
        default: return 50;
    }
}

/**
 * Map Smoking Status to Activity Metric (0-100)
 * @param {string} smokingStatus - Smoking status
 * @returns {number} - Activity metric value (0-100)
 */
function mapSmokingToActivityMetric(smokingStatus) {
    switch (smokingStatus) {
        case 'never': return 90;
        case 'former': return 70;
        case 'current': return 20;
        default: return 50;
    }
}

/**
 * Map Exercise Hours to Metric (0-100)
 * @param {number} hours - Hours of exercise per week
 * @returns {number} - Metric value (0-100)
 */
function mapExerciseToMetric(hours) {
    if (hours < 1) return 20;
    if (hours < 2.5) return 50;
    if (hours < 5) return 80;
    return 90;
}

/**
 * Generate Symptom Metrics
 * @param {Array} symptoms - Array of symptom codes
 * @param {string} severity - Severity level
 * @returns {Array} - Array of metric values for charts
 */
function generateSymptomMetrics(symptoms, severity) {
    // Define symptom categories
    const respiratorySymptoms = ['cough', 'shortness_breath', 'congestion', 'runny_nose', 'sneezing'];
    const painSymptoms = ['headache', 'body_aches', 'chest_pain', 'abdominal_pain', 'joint_pain'];
    const digestiveSymptoms = ['nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal_pain'];
    const energySymptoms = ['fatigue', 'weakness', 'dizziness', 'fainting'];
    const sleepSymptoms = ['insomnia', 'excessive_sleeping', 'night_sweats', 'sleep_apnea'];
    
    // Calculate severity multiplier
    const severityMultiplier = severity === 'severe' ? 1.5 : (severity === 'moderate' ? 1 : 0.5);
    
    // Count symptoms in each category
    const respiratory = respiratorySymptoms.filter(s => symptoms.includes(s)).length * 20 * severityMultiplier;
    const pain = painSymptoms.filter(s => symptoms.includes(s)).length * 20 * severityMultiplier;
    const digestive = digestiveSymptoms.filter(s => symptoms.includes(s)).length * 20 * severityMultiplier;
    const energy = energySymptoms.filter(s => symptoms.includes(s)).length * 20 * severityMultiplier;
    const sleep = sleepSymptoms.filter(s => symptoms.includes(s)).length * 20 * severityMultiplier;
    
    // Return metrics (cap at 100)
    return [
        Math.min(100, respiratory),
        Math.min(100, pain),
        Math.min(100, digestive),
        Math.min(100, energy),
        Math.min(100, sleep)
    ];
}

/**
 * Format Symptom Name
 * @param {string} symptom - The symptom code to format
 * @returns {string} - The formatted symptom name
 */
function formatSymptomName(symptom) {
    return symptom
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format Duration
 * @param {string} duration - The duration code to format
 * @returns {string} - The formatted duration text
 */
function formatDuration(duration) {
    switch (duration) {
        case 'less_than_week': return 'Less than a week';
        case 'one_two_weeks': return '1-2 weeks';
        case 'two_four_weeks': return '2-4 weeks';
        case 'more_than_month': return 'More than a month';
        default: return duration;
    }
}

/**
 * Format Severity
 * @param {string} severity - The severity code to format
 * @returns {string} - The formatted severity text
 */
function formatSeverity(severity) {
    switch (severity) {
        case 'mild': return 'Mild';
        case 'moderate': return 'Moderate';
        case 'severe': return 'Severe';
        default: return severity;
    }
}

/**
 * Initialize Result Actions
 */
function initResultActions() {
    // Print Results button
    const printButton = document.getElementById('print-results');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Share Results button
    const shareButton = document.getElementById('share-results');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            alert('Share functionality would be implemented here.');
        });
    }
    
    // Download PDF button
    const pdfButton = document.getElementById('download-pdf');
    if (pdfButton) {
        pdfButton.addEventListener('click', function() {
            generatePDF();
        });
    }
    
    // Schedule Appointment button
    const scheduleButton = document.getElementById('schedule-appointment');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', function() {
            window.location.href = 'appointment.html';
        });
    }
}

/**
 * Generate and Download PDF of Results
 */
function generatePDF() {
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="loading-spinner"></div><p>Generating PDF...</p>';
    document.body.appendChild(loadingIndicator);
    
    // Get the current date for the filename
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get assessment type for filename
    const lastAssessment = localStorage.getItem('lastAssessment') || 'health';
    const assessmentLabels = {
        'heart': 'Heart_Health',
        'diabetes': 'Diabetes_Risk',
        'lungs': 'Lung_Cancer_Risk',
        'symptoms': 'Symptom_Check',
        'health-score': 'Health_Score'
    };
    const assessmentLabel = assessmentLabels[lastAssessment] || 'Health_Assessment';
    
    // Set filename
    const filename = `WellPredict_${assessmentLabel}_${dateStr}.pdf`;
    
    // Get the elements to include in the PDF
    const heroSection = document.querySelector('.results-hero');
    const resultsContainer = document.querySelector('.results-container');
    const visualizationSection = document.querySelector('.data-visualization');
    
    // Wait for window.jspdf to be loaded
    if (typeof window.jspdf === 'undefined') {
        window.jspdf = window.jspdf || window.jsPDF;
    }
    
    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });
    
    // Define PDF generation steps
    Promise.all([
        // Capture hero section
        html2canvas(heroSection, {
            scale: 2,
            logging: false,
            useCORS: true
        }),
        // Capture results container
        html2canvas(resultsContainer, {
            scale: 2,
            logging: false,
            useCORS: true
        }),
        // Capture visualization section
        html2canvas(visualizationSection, {
            scale: 2,
            logging: false,
            useCORS: true
        })
    ]).then(([heroCanvas, resultsCanvas, visualizationCanvas]) => {
        // Add hero section to PDF
        const heroImgData = heroCanvas.toDataURL('image/png');
        const heroImgProps = doc.getImageProperties(heroImgData);
        const heroPdfWidth = doc.internal.pageSize.getWidth() - 20;
        const heroPdfHeight = (heroImgProps.height * heroPdfWidth) / heroImgProps.width;
        
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80); // Dark blue header
        doc.text('WellPredict Health Assessment', 105, 15, { align: 'center' });
        doc.addImage(heroImgData, 'PNG', 10, 20, heroPdfWidth, heroPdfHeight);
        
        // Add results container to PDF
        const resultsImgData = resultsCanvas.toDataURL('image/png');
        const resultsImgProps = doc.getImageProperties(resultsImgData);
        const resultsPdfWidth = doc.internal.pageSize.getWidth() - 20;
        const resultsPdfHeight = (resultsImgProps.height * resultsPdfWidth) / resultsImgProps.width;
        
        // Check if we need to add a new page
        if (20 + heroPdfHeight + resultsPdfHeight > doc.internal.pageSize.getHeight()) {
            doc.addPage();
            doc.addImage(resultsImgData, 'PNG', 10, 10, resultsPdfWidth, resultsPdfHeight);
        } else {
            doc.addImage(resultsImgData, 'PNG', 10, 20 + heroPdfHeight + 10, resultsPdfWidth, resultsPdfHeight);
        }
        
        // Add visualization section to PDF on a new page
        doc.addPage();
        const visualizationImgData = visualizationCanvas.toDataURL('image/png');
        const visualizationImgProps = doc.getImageProperties(visualizationImgData);
        const visualizationPdfWidth = doc.internal.pageSize.getWidth() - 20;
        const visualizationPdfHeight = (visualizationImgProps.height * visualizationPdfWidth) / visualizationImgProps.width;
        
        doc.addImage(visualizationImgData, 'PNG', 10, 10, visualizationPdfWidth, visualizationPdfHeight);
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Generated by WellPredict on ${date.toLocaleDateString()} | Page ${i} of ${pageCount}`, 
                doc.internal.pageSize.getWidth() / 2, 
                doc.internal.pageSize.getHeight() - 10, 
                { align: 'center' }
            );
        }
        
        // Save the PDF
        doc.save(filename);
        
        // Remove loading indicator
        document.body.removeChild(loadingIndicator);
    }).catch(error => {
        console.error('Error generating PDF:', error);
        // Remove loading indicator
        document.body.removeChild(loadingIndicator);
        // Show error message
        alert('There was an error generating the PDF. Please try again.');
    });
}

// Heart Health Assessment Results Handler
function handleHeartHealthResults(data) {
    // Calculate BMI
    const bmi = calculateBMI(data.weight, data.height);
    
    // Calculate heart risk score (simplified version for demonstration)
    const riskScore = calculateHeartRiskScore(data, bmi);
    
    // Generate risk factors analysis
    const riskFactors = analyzeHeartRiskFactors(data, bmi);
    
    // Create visualizations
    createHeartHealthVisualizations(data, riskScore, riskFactors);
    
    // Generate recommendations
    const recommendations = generateHeartHealthRecommendations(data, riskScore, riskFactors);
    
    // Update UI with results
    updateHeartHealthResultsUI(riskScore, riskFactors, recommendations);
}

function calculateBMI(weight, height) {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

function calculateHeartRiskScore(data, bmi) {
    let score = 0;
    
    // Age factor (0-25 points)
    if (data.age < 40) score += 0;
    else if (data.age < 50) score += 5;
    else if (data.age < 60) score += 10;
    else if (data.age < 70) score += 15;
    else score += 20;
    
    // Gender factor (0-5 points)
    score += data.gender === 'male' ? 5 : 0;
    
    // Blood Pressure factor (0-20 points)
    const bpScore = calculateBPFactor(data.systolic, data.diastolic);
    score += bpScore;
    
    // Cholesterol factor (0-20 points)
    const cholesterolScore = calculateCholesterolFactor(data);
    score += cholesterolScore;
    
    // BMI factor (0-10 points)
    const bmiScore = calculateBMIFactor(bmi);
    score += bmiScore;
    
    // Lifestyle factors (0-20 points)
    const lifestyleScore = calculateLifestyleFactor(data);
    score += lifestyleScore;
    
    // Medical history factor (0-20 points)
    const medicalScore = calculateMedicalHistoryFactor(data);
    score += medicalScore;
    
    // Normalize score to 0-100
    return Math.min(Math.round((score / 120) * 100), 100);
}

function calculateBPFactor(systolic, diastolic) {
    let score = 0;
    
    // Systolic BP
    if (systolic < 120) score += 0;
    else if (systolic < 130) score += 5;
    else if (systolic < 140) score += 10;
    else if (systolic < 160) score += 15;
    else score += 20;
    
    // Diastolic BP
    if (diastolic < 80) score += 0;
    else if (diastolic < 85) score += 2;
    else if (diastolic < 90) score += 5;
    else if (diastolic < 100) score += 8;
    else score += 10;
    
    return Math.min(score, 20);
}

function calculateCholesterolFactor(data) {
    let score = 0;
    
    // Total Cholesterol
    if (data.cholesterol < 200) score += 0;
    else if (data.cholesterol < 240) score += 5;
    else score += 10;
    
    // HDL Cholesterol
    if (data.hdl >= 60) score += 0;
    else if (data.hdl >= 40) score += 5;
    else score += 10;
    
    // LDL Cholesterol
    if (data.ldl < 100) score += 0;
    else if (data.ldl < 130) score += 5;
    else if (data.ldl < 160) score += 8;
    else score += 10;
    
    return Math.min(score, 20);
}

function calculateBMIFactor(bmi) {
    if (bmi < 18.5) return 5;  // Underweight
    if (bmi < 25) return 0;    // Normal
    if (bmi < 30) return 5;    // Overweight
    return 10;                 // Obese
}

function calculateLifestyleFactor(data) {
    let score = 0;
    
    // Smoking
    if (data.heart_smoke === 'current') score += 10;
    else if (data.heart_smoke === 'former') score += 5;
    
    // Physical Activity
    if (data.activity === 'sedentary') score += 10;
    else if (data.activity === 'light') score += 5;
    else if (data.activity === 'moderate') score += 2;
    
    // Alcohol
    if (data.alcohol === 'heavy') score += 10;
    else if (data.alcohol === 'moderate') score += 5;
    
    return Math.min(score, 20);
}

function calculateMedicalHistoryFactor(data) {
    let score = 0;
    
    // Diabetes
    if (data.heart_diabetes === 'yes') score += 10;
    else if (data.heart_diabetes === 'prediabetes') score += 5;
    
    // Family History
    if (data.heart_family === 'yes') score += 5;
    
    // Previous Conditions
    const conditions = data.heart_conditions || [];
    if (conditions.includes('hypertension')) score += 5;
    if (conditions.includes('heartAttack')) score += 10;
    if (conditions.includes('stroke')) score += 10;
    if (conditions.includes('angina')) score += 5;
    
    return Math.min(score, 20);
}

function analyzeHeartRiskFactors(data, bmi) {
    const factors = [];
    
    // Age Analysis
    if (data.age >= 65) {
        factors.push({
            factor: 'Age',
            level: 'high',
            description: 'Age is a significant risk factor for heart disease',
            impact: 'High'
        });
    }
    
    // Blood Pressure Analysis
    if (data.systolic >= 140 || data.diastolic >= 90) {
        factors.push({
            factor: 'Blood Pressure',
            level: 'high',
            description: 'Elevated blood pressure increases heart disease risk',
            impact: 'High'
        });
    }
    
    // Cholesterol Analysis
    if (data.cholesterol >= 240 || data.ldl >= 160 || data.hdl < 40) {
        factors.push({
            factor: 'Cholesterol',
            level: 'high',
            description: 'Unhealthy cholesterol levels increase heart disease risk',
            impact: 'High'
        });
    }
    
    // BMI Analysis
    if (bmi >= 30) {
        factors.push({
            factor: 'BMI',
            level: 'high',
            description: 'Obesity is a significant risk factor for heart disease',
            impact: 'High'
        });
    }
    
    // Lifestyle Analysis
    if (data.heart_smoke === 'current') {
        factors.push({
            factor: 'Smoking',
            level: 'high',
            description: 'Smoking significantly increases heart disease risk',
            impact: 'High'
        });
    }
    
    if (data.activity === 'sedentary') {
        factors.push({
            factor: 'Physical Activity',
            level: 'moderate',
            description: 'Lack of physical activity increases heart disease risk',
            impact: 'Moderate'
        });
    }
    
    // Medical History Analysis
    if (data.heart_diabetes === 'yes') {
        factors.push({
            factor: 'Diabetes',
            level: 'high',
            description: 'Diabetes significantly increases heart disease risk',
            impact: 'High'
        });
    }
    
    if (data.heart_family === 'yes') {
        factors.push({
            factor: 'Family History',
            level: 'moderate',
            description: 'Family history of heart disease increases your risk',
            impact: 'Moderate'
        });
    }
    
    return factors;
}

function generateHeartHealthRecommendations(data, riskScore, riskFactors) {
    const recommendations = [];
    
    // General recommendations based on risk score
    if (riskScore >= 70) {
        recommendations.push({
            category: 'Immediate Action',
            items: [
                'Schedule an appointment with your doctor as soon as possible',
                'Consider getting a comprehensive cardiac evaluation',
                'Monitor your blood pressure daily'
            ]
        });
    } else if (riskScore >= 40) {
        recommendations.push({
            category: 'Priority Actions',
            items: [
                'Schedule a check-up with your doctor',
                'Start monitoring your blood pressure regularly',
                'Consider lifestyle modifications'
            ]
        });
    }
    
    // Specific recommendations based on risk factors
    riskFactors.forEach(factor => {
        switch(factor.factor) {
            case 'Blood Pressure':
                recommendations.push({
                    category: 'Blood Pressure Management',
                    items: [
                        'Reduce sodium intake',
                        'Increase physical activity',
                        'Consider DASH diet',
                        'Monitor blood pressure regularly'
                    ]
                });
                break;
                
            case 'Cholesterol':
                recommendations.push({
                    category: 'Cholesterol Management',
                    items: [
                        'Reduce saturated fat intake',
                        'Increase fiber consumption',
                        'Consider Mediterranean diet',
                        'Regular cholesterol checks'
                    ]
                });
                break;
                
            case 'BMI':
                recommendations.push({
                    category: 'Weight Management',
                    items: [
                        'Create a calorie deficit',
                        'Increase physical activity',
                        'Consider consulting a nutritionist',
                        'Set realistic weight loss goals'
                    ]
                });
                break;
                
            case 'Smoking':
                recommendations.push({
                    category: 'Smoking Cessation',
                    items: [
                        'Consider nicotine replacement therapy',
                        'Join a smoking cessation program',
                        'Set a quit date',
                        'Identify and avoid triggers'
                    ]
                });
                break;
                
            case 'Physical Activity':
                recommendations.push({
                    category: 'Physical Activity',
                    items: [
                        'Start with 30 minutes of moderate exercise daily',
                        'Gradually increase activity level',
                        'Find activities you enjoy',
                        'Consider working with a personal trainer'
                    ]
                });
                break;
                
            case 'Diabetes':
                recommendations.push({
                    category: 'Diabetes Management',
                    items: [
                        'Monitor blood sugar regularly',
                        'Follow a diabetic diet',
                        'Maintain regular exercise',
                        'Keep regular appointments with your doctor'
                    ]
                });
                break;
        }
    });
    
    return recommendations;
}

function createHeartHealthVisualizations(data, riskScore, riskFactors) {
    // Create risk score gauge
    createRiskScoreGauge(riskScore);
    
    // Create risk factors chart
    createRiskFactorsChart(riskFactors);
    
    // Create vital signs chart
    createVitalSignsChart(data);
    
    // Create lifestyle factors chart
    createLifestyleFactorsChart(data);
}

function createRiskScoreGauge(riskScore) {
    const ctx = document.getElementById('riskScoreGauge').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [riskScore, 100 - riskScore],
                backgroundColor: [
                    getRiskColor(riskScore),
                    '#e9ecef'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
    
    // Add center text
    const centerText = document.createElement('div');
    centerText.className = 'gauge-center-text';
    centerText.innerHTML = `
        <span class="score">${riskScore}</span>
        <span class="label">Risk Score</span>
    `;
    document.getElementById('riskScoreGauge').parentNode.appendChild(centerText);
}

function createRiskFactorsChart(riskFactors) {
    const ctx = document.getElementById('riskFactorsChart').getContext('2d');
    
    const data = {
        labels: riskFactors.map(f => f.factor),
        datasets: [{
            data: riskFactors.map(f => f.impact === 'High' ? 100 : 50),
            backgroundColor: riskFactors.map(f => f.impact === 'High' ? '#dc3545' : '#ffc107'),
            borderWidth: 0
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
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
                    max: 100,
                    ticks: {
                        callback: value => value === 100 ? 'High' : value === 50 ? 'Moderate' : ''
                    }
                }
            }
        }
    });
}

function createVitalSignsChart(data) {
    const ctx = document.getElementById('vitalSignsChart').getContext('2d');
    
    const vitalSigns = {
        'Blood Pressure': data.systolic,
        'HDL Cholesterol': data.hdl,
        'LDL Cholesterol': data.ldl,
        'Total Cholesterol': data.cholesterol,
        'Triglycerides': data.triglycerides
    };
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(vitalSigns),
            datasets: [{
                label: 'Your Values',
                data: Object.values(vitalSigns),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createLifestyleFactorsChart(data) {
    const ctx = document.getElementById('lifestyleFactorsChart').getContext('2d');
    
    const lifestyleData = {
        'Physical Activity': getActivityScore(data.activity),
        'Smoking Status': getSmokingScore(data.heart_smoke),
        'Alcohol Consumption': getAlcoholScore(data.alcohol),
        'Diet Type': getDietScore(data.diet)
    };
    
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(lifestyleData),
            datasets: [{
                data: Object.values(lifestyleData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Helper functions for chart data
function getRiskColor(score) {
    if (score >= 70) return '#dc3545';
    if (score >= 40) return '#ffc107';
    return '#28a745';
}

function getActivityScore(activity) {
    const scores = {
        'sedentary': 20,
        'light': 40,
        'moderate': 60,
        'active': 80,
        'veryActive': 100
    };
    return scores[activity] || 0;
}

function getSmokingScore(smoking) {
    const scores = {
        'current': 20,
        'former': 60,
        'never': 100
    };
    return scores[smoking] || 0;
}

function getAlcoholScore(alcohol) {
    const scores = {
        'none': 100,
        'light': 80,
        'moderate': 60,
        'heavy': 20
    };
    return scores[alcohol] || 0;
}

function getDietScore(diet) {
    const scores = {
        'mediterranean': 100,
        'balanced': 80,
        'vegetarian': 70,
        'vegan': 70,
        'highProtein': 60,
        'other': 50
    };
    return scores[diet] || 0;
}

function updateHeartHealthResultsUI(riskScore, riskFactors, recommendations) {
    // Update risk score display
    document.getElementById('riskScore').textContent = riskScore;
    document.getElementById('riskLevel').textContent = getRiskLevel(riskScore);
    document.getElementById('riskLevel').className = `risk-level ${getRiskLevelClass(riskScore)}`;
    
    // Update risk factors list
    const riskFactorsList = document.getElementById('riskFactorsList');
    riskFactorsList.innerHTML = riskFactors.map(factor => `
        <div class="risk-factor ${factor.level}">
            <h4>${factor.factor}</h4>
            <p>${factor.description}</p>
            <span class="impact ${factor.impact.toLowerCase()}">${factor.impact} Impact</span>
        </div>
    `).join('');
    
    // Update recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-category">
            <h4>${rec.category}</h4>
            <ul>
                ${rec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function getRiskLevel(score) {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Moderate Risk';
    return 'Low Risk';
}

function getRiskLevelClass(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
}

// Initialize results page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we have heart health assessment data
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    
    if (service === 'heart') {
        // Get stored assessment data
        const assessmentData = JSON.parse(localStorage.getItem('heartAssessmentData'));
        if (assessmentData) {
            handleHeartHealthResults(assessmentData);
        }
    }
}); 