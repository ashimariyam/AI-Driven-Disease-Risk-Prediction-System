/**
 * WellPredict - Prediction Interface JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initTabs();
    
    // Initialize range sliders
    initRangeSliders();
    
    // Initialize conditional form fields
    initConditionalFields();
    
    // Initialize form submission handlers
    initFormHandlers();
    
    // Check if a service was selected from the services page
    checkSelectedService();
});

/**
 * Initialize Tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initialize Range Sliders
 */
function initRangeSliders() {
    // Sleep hours range
    const sleepRange = document.getElementById('sleep-hours');
    const sleepValue = document.getElementById('sleep-value');
    if (sleepRange && sleepValue) {
        sleepValue.textContent = sleepRange.value;
        sleepRange.addEventListener('input', function() {
            sleepValue.textContent = this.value;
        });
    }
    
    // Exercise hours range
    const exerciseRange = document.getElementById('exercise-hours');
    const exerciseValue = document.getElementById('exercise-value');
    if (exerciseRange && exerciseValue) {
        exerciseValue.textContent = exerciseRange.value;
        exerciseRange.addEventListener('input', function() {
            exerciseValue.textContent = this.value;
        });
    }
    
    // Stress level range
    const stressRange = document.getElementById('stress-level');
    const stressValue = document.getElementById('stress-value');
    if (stressRange && stressValue) {
        stressValue.textContent = stressRange.value;
        stressRange.addEventListener('input', function() {
            stressValue.textContent = this.value;
        });
    }
    
    // Diet quality range
    const dietRange = document.getElementById('diet-quality');
    const dietValue = document.getElementById('diet-value');
    if (dietRange && dietValue) {
        dietValue.textContent = dietRange.value;
        dietRange.addEventListener('input', function() {
            dietValue.textContent = this.value;
        });
    }
}

/**
 * Initialize Conditional Form Fields
 */
function initConditionalFields() {
    // Show/hide smoking details based on smoking status
    const smokingStatus = document.getElementById('lungs-smoking');
    const smokingDetails = document.querySelectorAll('.smoking-details');
    
    if (smokingStatus) {
        smokingStatus.addEventListener('change', function() {
            const showDetails = this.value === 'former' || this.value === 'current';
            smokingDetails.forEach(detail => {
                detail.style.display = showDetails ? 'block' : 'none';
                
                // Make fields required only if they're visible
                const inputs = detail.querySelectorAll('input');
                inputs.forEach(input => {
                    if (showDetails) {
                        input.setAttribute('required', '');
                    } else {
                        input.removeAttribute('required');
                    }
                });
            });
        });
    }
}

/**
 * Initialize Form Submission Handlers
 */
function initFormHandlers() {
    // Heart Health Assessment Form
    const heartForm = document.getElementById('heart-form');
    if (heartForm) {
        heartForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const result = calculateHeartRisk(this);
            storeHeartResult(result);
            window.location.href = 'results.html';
        });
    }
    
    // Diabetes Risk Assessment Form
    const diabetesForm = document.getElementById('diabetes-form');
    if (diabetesForm) {
        diabetesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const result = calculateDiabetesRisk(this);
            storeDiabetesResult(result);
            window.location.href = 'results.html';
        });
    }
    
    // Lung Cancer Risk Assessment Form
    const lungsForm = document.getElementById('lungs-form');
    if (lungsForm) {
        lungsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const result = calculateLungCancerRisk(this);
            storeLungCancerResult(result);
            window.location.href = 'results.html';
        });
    }
    
    // Symptom Checker Form
    const symptomsForm = document.getElementById('symptoms-form');
    if (symptomsForm) {
        symptomsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const result = checkSymptoms(this);
            storeSymptomResult(result);
            window.location.href = 'results.html';
        });
    }
    
    // Health Score Calculator Form
    const healthScoreForm = document.getElementById('health-score-form');
    if (healthScoreForm) {
        healthScoreForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const result = calculateHealthScore(this);
            storeHealthScoreResult(result);
            window.location.href = 'results.html';
        });
    }
}

/**
 * Calculate Heart Risk
 * @param {HTMLFormElement} form - The heart health form
 * @returns {Object} - The heart risk assessment result
 */
function calculateHeartRisk(form) {
    // Get form data
    const age = parseInt(form.querySelector('#heart-age').value);
    const gender = form.querySelector('#heart-gender').value;
    const systolic = parseInt(form.querySelector('#heart-systolic').value);
    const diastolic = parseInt(form.querySelector('#heart-diastolic').value);
    const cholesterol = parseInt(form.querySelector('#heart-cholesterol').value);
    const hdl = parseInt(form.querySelector('#heart-hdl').value);
    const smoker = form.querySelector('input[name="heart-smoke"]:checked').value === 'yes';
    const diabetic = form.querySelector('input[name="heart-diabetes"]:checked').value === 'yes';
    
    // Calculate risk score (simplified algorithm for demo)
    let score = 0;
    
    // Age factor (higher age = higher risk)
    if (age < 40) score += 10;
    else if (age < 60) score += 25;
    else score += 40;
    
    // Blood pressure factor
    if (systolic >= 140 || diastolic >= 90) score += 20;
    else if (systolic >= 120 || diastolic >= 80) score += 10;
    
    // Cholesterol factor
    if (cholesterol > 240) score += 20;
    else if (cholesterol > 200) score += 10;
    
    // HDL factor (higher is better)
    if (hdl < 40) score += 15;
    else if (hdl < 60) score += 5;
    
    // Smoking factor
    if (smoker) score += 15;
    
    // Diabetes factor
    if (diabetic) score += 15;
    
    // Gender factor
    if (gender === 'male') score += 5;
    
    // Calculate total risk (0-100)
    let riskScore = Math.min(100, Math.max(0, score));
    
    // Determine risk category
    let riskCategory;
    if (riskScore < 30) riskCategory = 'low';
    else if (riskScore < 70) riskCategory = 'medium';
    else riskCategory = 'high';
    
    // Generate insights
    const insights = [];
    if (systolic >= 140 || diastolic >= 90) {
        insights.push('Your blood pressure readings indicate hypertension. Consider lifestyle changes and medical consultation.');
    }
    if (cholesterol > 200) {
        insights.push('Your cholesterol levels are elevated. Consider dietary modifications and regular exercise.');
    }
    if (smoker) {
        insights.push('Smoking significantly increases your cardiovascular risk. Consider smoking cessation programs.');
    }
    if (diabetic) {
        insights.push('Diabetes is a significant risk factor for heart disease. Ensure proper management of your condition.');
    }
    
    // Return the result object
    return {
        riskScore: riskScore,
        riskCategory: riskCategory,
        details: {
            age: age,
            gender: gender,
            bloodPressure: `${systolic}/${diastolic} mmHg`,
            cholesterol: cholesterol,
            hdl: hdl,
            smoker: smoker ? 'Yes' : 'No',
            diabetic: diabetic ? 'Yes' : 'No'
        },
        insights: insights
    };
}

/**
 * Calculate Diabetes Risk
 * @param {HTMLFormElement} form - The diabetes risk form
 * @returns {Object} - The diabetes risk assessment result
 */
function calculateDiabetesRisk(form) {
    // Get form data
    const age = parseInt(form.querySelector('#diabetes-age').value);
    const gender = form.querySelector('#diabetes-gender').value;
    const weight = parseFloat(form.querySelector('#diabetes-weight').value);
    const height = parseInt(form.querySelector('#diabetes-height').value);
    const fastingGlucose = parseInt(form.querySelector('#diabetes-fasting-glucose').value);
    const familyHistory = form.querySelector('input[name="diabetes-family"]:checked').value === 'yes';
    const activityLevel = form.querySelector('#diabetes-activity').value;
    const hypertension = form.querySelector('input[name="diabetes-hypertension"]:checked').value === 'yes';
    
    // Calculate BMI
    const bmi = weight / ((height / 100) * (height / 100));
    
    // Calculate risk score (simplified algorithm for demo)
    let score = 0;
    
    // Age factor
    if (age < 40) score += 10;
    else if (age < 60) score += 25;
    else score += 35;
    
    // BMI factor
    if (bmi >= 30) score += 30;
    else if (bmi >= 25) score += 15;
    
    // Fasting glucose factor
    if (fastingGlucose >= 126) score += 40;
    else if (fastingGlucose >= 100) score += 25;
    
    // Family history factor
    if (familyHistory) score += 15;
    
    // Activity level factor
    switch (activityLevel) {
        case 'sedentary': score += 15; break;
        case 'light': score += 10; break;
        case 'moderate': score += 5; break;
        case 'active': score += 0; break;
        case 'veryActive': score -= 5; break;
    }
    
    // Hypertension factor
    if (hypertension) score += 10;
    
    // Calculate total risk (0-100)
    let riskPercentage = Math.min(100, Math.max(0, score));
    
    // Determine risk category
    let riskCategory;
    if (riskPercentage < 20) riskCategory = 'low';
    else if (riskPercentage < 50) riskCategory = 'medium';
    else riskCategory = 'high';
    
    // Generate insights
    const insights = [];
    if (bmi >= 25) {
        insights.push(`Your BMI is ${bmi.toFixed(1)}, which puts you in the ${bmi >= 30 ? 'obese' : 'overweight'} category.`);
    }
    if (fastingGlucose >= 100) {
        insights.push('Your fasting glucose level indicates prediabetes or diabetes risk.');
    }
    if (familyHistory) {
        insights.push('Family history of diabetes increases your risk significantly.');
    }
    if (activityLevel === 'sedentary' || activityLevel === 'light') {
        insights.push('Increasing your physical activity can help reduce your diabetes risk.');
    }
    
    // Return the result object
    return {
        riskPercentage: riskPercentage,
        riskCategory: riskCategory,
        details: {
            age: age,
            gender: gender,
            bmi: bmi.toFixed(1),
            fastingGlucose: fastingGlucose,
            familyHistory: familyHistory ? 'Yes' : 'No',
            activityLevel: activityLevel,
            hypertension: hypertension ? 'Yes' : 'No'
        },
        insights: insights
    };
}

/**
 * Calculate Lung Cancer Risk
 * @param {HTMLFormElement} form - The lung cancer risk form
 * @returns {Object} - The lung cancer risk assessment result
 */
function calculateLungCancerRisk(form) {
    // Get form data
    const age = parseInt(form.querySelector('#lungs-age').value);
    const gender = form.querySelector('#lungs-gender').value;
    const smokingStatus = form.querySelector('#lungs-smoking').value;
    
    // Initialize variables for smokers
    let packYears = 0;
    let yearsQuit = 0;
    
    // Get smoking-specific data if applicable
    if (smokingStatus === 'current' || smokingStatus === 'former') {
        const cigarettesPerDay = parseInt(form.querySelector('#cigarettes-per-day').value);
        const yearsSmoked = parseInt(form.querySelector('#years-smoked').value);
        packYears = (cigarettesPerDay / 20) * yearsSmoked;
        
        if (smokingStatus === 'former') {
            yearsQuit = parseInt(form.querySelector('#years-quit').value);
        }
    }
    
    // Calculate risk score (simplified algorithm for demo)
    let score = 0;
    
    // Age factor
    if (age < 50) score += 5;
    else if (age < 65) score += 15;
    else score += 25;
    
    // Smoking status factor
    if (smokingStatus === 'never') {
        score += 0;
    } else if (smokingStatus === 'former') {
        score += Math.max(0, 30 - yearsQuit * 2); // Risk reduces the longer someone has quit
        score += Math.min(40, packYears); // Pack years factor
    } else if (smokingStatus === 'current') {
        score += 30; // Current smoker baseline risk
        score += Math.min(40, packYears); // Pack years factor
    }
    
    // Gender factor
    if (gender === 'male') score += 5;
    
    // Calculate total risk (0-100)
    let riskScore = Math.min(100, Math.max(0, score));
    
    // Determine risk level
    let riskLevel;
    if (riskScore < 20) riskLevel = 'Low Risk';
    else if (riskScore < 40) riskLevel = 'Slightly Elevated Risk';
    else if (riskScore < 70) riskLevel = 'Moderately Elevated Risk';
    else riskLevel = 'High Risk';
    
    // Generate insights and descriptions
    let riskDescription;
    const insights = [];
    
    if (smokingStatus === 'never') {
        riskDescription = 'As a non-smoker, your risk for lung cancer is relatively low. However, other factors like environmental exposures and genetics still play a role.';
    } else if (smokingStatus === 'former') {
        riskDescription = `As a former smoker with ${packYears.toFixed(1)} pack-years of smoking history, your risk is elevated compared to non-smokers. However, quitting smoking ${yearsQuit} years ago has reduced your risk significantly.`;
        insights.push('Continue to maintain a smoke-free lifestyle to further reduce your risk over time.');
    } else if (smokingStatus === 'current') {
        riskDescription = `As a current smoker with ${packYears.toFixed(1)} pack-years of smoking history, you have a significantly elevated risk of developing lung cancer.`;
        insights.push('Quitting smoking is the single most effective way to reduce your lung cancer risk.');
    }
    
    if (age >= 65) {
        insights.push('Your age is a risk factor for lung cancer. Consider discussing lung cancer screening with your healthcare provider.');
    }
    
    // Return the result object
    return {
        riskScore: riskScore,
        riskLevel: riskLevel,
        riskDescription: riskDescription,
        details: {
            age: age,
            gender: gender,
            smokingStatus: smokingStatus,
            packYears: smokingStatus !== 'never' ? packYears.toFixed(1) : 'N/A',
            yearsQuit: smokingStatus === 'former' ? yearsQuit : 'N/A'
        },
        insights: insights
    };
}

/**
 * Check Symptoms
 * @param {HTMLFormElement} form - The symptoms form
 * @returns {Object} - The symptom assessment result
 */
function checkSymptoms(form) {
    // Get form data (simplified for demo)
    const symptoms = Array.from(form.querySelectorAll('input[name="symptoms[]"]:checked')).map(checkbox => checkbox.value);
    const duration = form.querySelector('#symptoms-duration').value;
    const severity = form.querySelector('#symptoms-severity').value;
    
    // Determine possible conditions based on symptoms (simplified algorithm for demo)
    let condition = 'Inconclusive';
    let certainty = 'Low';
    let description = '';
    
    // Check for common colds
    const coldSymptoms = ['cough', 'runny_nose', 'sore_throat', 'congestion', 'sneezing', 'mild_fever'];
    const coldMatch = coldSymptoms.filter(s => symptoms.includes(s)).length;
    
    // Check for flu
    const fluSymptoms = ['high_fever', 'body_aches', 'chills', 'fatigue', 'cough', 'headache'];
    const fluMatch = fluSymptoms.filter(s => symptoms.includes(s)).length;
    
    // Check for allergies
    const allergySymptoms = ['sneezing', 'itchy_eyes', 'runny_nose', 'congestion', 'itchy_throat'];
    const allergyMatch = allergySymptoms.filter(s => symptoms.includes(s)).length;
    
    // Determine most likely condition
    if (coldMatch >= 4 && duration === 'less_than_week') {
        condition = 'Common Cold';
        certainty = coldMatch >= 5 ? 'High' : 'Medium';
        description = 'Your symptoms suggest a common cold, a viral infection of the upper respiratory tract.';
    } else if (fluMatch >= 4 && (duration === 'less_than_week' || duration === 'one_two_weeks')) {
        condition = 'Influenza (Flu)';
        certainty = fluMatch >= 5 ? 'High' : 'Medium';
        description = 'Your symptoms are consistent with influenza (flu), a contagious respiratory illness caused by influenza viruses.';
    } else if (allergyMatch >= 4 && (duration === 'more_than_month' || symptoms.includes('seasonal_pattern'))) {
        condition = 'Seasonal Allergies';
        certainty = allergyMatch >= 5 ? 'High' : 'Medium';
        description = 'Your symptoms suggest seasonal allergies, also known as allergic rhinitis or hay fever.';
    } else if (symptoms.includes('chest_pain') && symptoms.includes('shortness_breath')) {
        condition = 'Potential Serious Condition';
        certainty = 'Medium';
        description = 'Your symptoms include chest pain and shortness of breath, which could indicate a serious condition requiring immediate medical attention.';
    }
    
    // Generate recommendations based on condition
    const recommendations = [];
    
    if (condition === 'Common Cold') {
        recommendations.push('Rest and stay hydrated');
        recommendations.push('Over-the-counter cold medications may relieve symptoms');
        recommendations.push('If symptoms worsen or persist beyond 10 days, consult a healthcare provider');
    } else if (condition === 'Influenza (Flu)') {
        recommendations.push('Rest and stay hydrated');
        recommendations.push('Consider over-the-counter flu medications to reduce fever and discomfort');
        recommendations.push('Consult with a healthcare provider, especially if you are in a high-risk group');
    } else if (condition === 'Seasonal Allergies') {
        recommendations.push('Over-the-counter antihistamines may help relieve symptoms');
        recommendations.push('Avoid known allergens when possible');
        recommendations.push('Consider consulting with an allergist for long-term management');
    } else if (condition === 'Potential Serious Condition') {
        recommendations.push('Seek immediate medical attention');
    } else {
        recommendations.push('Monitor your symptoms and consult with a healthcare provider if they persist or worsen');
        recommendations.push('Keep track of any new or changing symptoms');
    }
    
    // Return the result object
    return {
        condition: condition,
        certainty: certainty,
        description: description,
        details: {
            symptoms: symptoms,
            duration: duration,
            severity: severity
        },
        recommendations: recommendations
    };
}

/**
 * Calculate Health Score
 * @param {HTMLFormElement} form - The health score form
 * @returns {Object} - The health score assessment result
 */
function calculateHealthScore(form) {
    // Get form data
    const age = parseInt(form.querySelector('#health-age').value);
    const gender = form.querySelector('#health-gender').value;
    const weight = parseFloat(form.querySelector('#health-weight').value);
    const height = parseInt(form.querySelector('#health-height').value);
    const sleepHours = parseInt(form.querySelector('#sleep-hours').value);
    const exerciseHours = parseInt(form.querySelector('#exercise-hours').value);
    const stressLevel = parseInt(form.querySelector('#stress-level').value);
    const dietQuality = parseInt(form.querySelector('#diet-quality').value);
    const smoker = form.querySelector('input[name="health-smoke"]:checked').value === 'yes';
    const alcohol = form.querySelector('#alcohol-consumption').value;
    
    // Calculate BMI
    const bmi = weight / ((height / 100) * (height / 100));
    
    // Calculate health score (simplified algorithm for demo)
    // Starting with a perfect score of 100
    let score = 100;
    
    // BMI factor (ideal range: 18.5-24.9)
    if (bmi < 18.5) score -= 10; // Underweight
    else if (bmi >= 25 && bmi < 30) score -= 10; // Overweight
    else if (bmi >= 30) score -= 20; // Obese
    
    // Sleep factor (ideal: 7-8 hours)
    if (sleepHours < 6) score -= 15;
    else if (sleepHours > 9) score -= 5;
    
    // Exercise factor
    if (exerciseHours < 2) score -= 15;
    
    // Stress factor
    score -= stressLevel * 2; // 0-10 scale, higher stress decreases score
    
    // Diet factor
    score += (dietQuality - 5) * 2; // 0-10 scale, better diet increases score
    
    // Smoking factor
    if (smoker) score -= 20;
    
    // Alcohol factor
    switch (alcohol) {
        case 'none': break; // No penalty
        case 'light': score -= 5; break;
        case 'moderate': score -= 10; break;
        case 'heavy': score -= 20; break;
    }
    
    // Age factor (minimal adjustments for age)
    if (age > 60) score -= 5;
    
    // Calculate final health score (0-100)
    let healthScore = Math.min(100, Math.max(0, score));
    
    // Determine health status
    let healthStatus;
    if (healthScore >= 85) healthStatus = 'Excellent';
    else if (healthScore >= 70) healthStatus = 'Good';
    else if (healthScore >= 50) healthStatus = 'Fair';
    else healthStatus = 'Poor';
    
    // Generate insights and improvement areas
    const insights = [];
    const improvementAreas = [];
    
    if (bmi < 18.5) {
        insights.push(`Your BMI of ${bmi.toFixed(1)} indicates you are underweight.`);
        improvementAreas.push('Consider a nutrition plan to achieve a healthy weight.');
    } else if (bmi >= 25 && bmi < 30) {
        insights.push(`Your BMI of ${bmi.toFixed(1)} indicates you are overweight.`);
        improvementAreas.push('Weight management through diet and exercise may improve your overall health.');
    } else if (bmi >= 30) {
        insights.push(`Your BMI of ${bmi.toFixed(1)} indicates obesity.`);
        improvementAreas.push('Consider consulting with a healthcare provider about weight management strategies.');
    }
    
    if (sleepHours < 6) {
        insights.push(`You reported getting only ${sleepHours} hours of sleep per night.`);
        improvementAreas.push('Aim for 7-8 hours of quality sleep per night.');
    }
    
    if (exerciseHours < 2) {
        insights.push(`You reported only ${exerciseHours} hours of exercise per week.`);
        improvementAreas.push('Aim for at least 150 minutes of moderate exercise per week.');
    }
    
    if (stressLevel > 6) {
        insights.push(`You reported a high stress level (${stressLevel}/10).`);
        improvementAreas.push('Consider stress management techniques such as meditation or mindfulness.');
    }
    
    if (dietQuality < 5) {
        insights.push(`You rated your diet quality as ${dietQuality}/10.`);
        improvementAreas.push('Improving dietary habits can significantly impact your overall health.');
    }
    
    if (smoker) {
        insights.push('You reported that you currently smoke.');
        improvementAreas.push('Quitting smoking is one of the most impactful changes for improving health.');
    }
    
    if (alcohol === 'moderate' || alcohol === 'heavy') {
        insights.push(`You reported ${alcohol} alcohol consumption.`);
        improvementAreas.push('Reducing alcohol intake can improve your health outcomes.');
    }
    
    // Return the result object
    return {
        healthScore: healthScore,
        healthStatus: healthStatus,
        details: {
            age: age,
            gender: gender,
            bmi: bmi.toFixed(1),
            sleepHours: sleepHours,
            exerciseHours: exerciseHours,
            stressLevel: stressLevel,
            dietQuality: dietQuality,
            smoker: smoker ? 'Yes' : 'No',
            alcoholConsumption: alcohol
        },
        insights: insights,
        improvementAreas: improvementAreas
    };
}

/**
 * Store Heart Risk Result
 * @param {Object} result - The heart risk assessment result
 */
function storeHeartResult(result) {
    localStorage.setItem('heartRisk', JSON.stringify({
        result: result,
        timestamp: new Date().toISOString()
    }));
    
    // Also store as last assessment for highlighting on results page
    localStorage.setItem('lastAssessment', 'heart');
}

/**
 * Store Diabetes Risk Result
 * @param {Object} result - The diabetes risk assessment result
 */
function storeDiabetesResult(result) {
    localStorage.setItem('diabetesRisk', JSON.stringify({
        result: result,
        timestamp: new Date().toISOString()
    }));
    
    // Also store as last assessment for highlighting on results page
    localStorage.setItem('lastAssessment', 'diabetes');
}

/**
 * Store Lung Cancer Risk Result
 * @param {Object} result - The lung cancer risk assessment result
 */
function storeLungCancerResult(result) {
    localStorage.setItem('lungCancerRisk', JSON.stringify({
        result: result,
        timestamp: new Date().toISOString()
    }));
    
    // Also store as last assessment for highlighting on results page
    localStorage.setItem('lastAssessment', 'lungs');
}

/**
 * Store Symptom Result
 * @param {Object} result - The symptom assessment result
 */
function storeSymptomResult(result) {
    localStorage.setItem('symptomResult', JSON.stringify({
        result: result,
        timestamp: new Date().toISOString()
    }));
    
    // Also store as last assessment for highlighting on results page
    localStorage.setItem('lastAssessment', 'symptoms');
}

/**
 * Store Health Score Result
 * @param {Object} result - The health score assessment result
 */
function storeHealthScoreResult(result) {
    localStorage.setItem('healthScore', JSON.stringify({
        result: result,
        timestamp: new Date().toISOString()
    }));
    
    // Also store as last assessment for highlighting on results page
    localStorage.setItem('lastAssessment', 'health-score');
}

/**
 * Check Selected Service from Services Page
 */
function checkSelectedService() {
    const selectedService = sessionStorage.getItem('selectedService');
    if (selectedService) {
        // Find the tab button for the selected service
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${selectedService}"]`);
        if (tabBtn) {
            tabBtn.click(); // Simulate a click on the tab
        }
        
        // Clear the session storage
        sessionStorage.removeItem('selectedService');
    }
} 