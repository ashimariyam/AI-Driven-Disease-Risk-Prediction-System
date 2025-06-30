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
    
    // NOTE: Form handlers are now handled by api-client.js for real API integration
    // initFormHandlers(); // DISABLED - Using api-client.js instead
    
    // Check if a service was selected from the services page
    checkSelectedService();
});

/**
 * Initialize Tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
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
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            try {
                // Calculate risk and store result
                const result = calculateHeartRisk(this);
                storeHeartResult(result);
                
                // Show success briefly before redirecting
                submitBtn.textContent = 'Success! Redirecting...';
                submitBtn.classList.add('btn-success');
                
                // Redirect to results page
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 800);
                
            } catch (error) {
                console.error('Error processing heart form:', error);
                submitBtn.textContent = 'Error. Try Again';
                submitBtn.classList.add('btn-error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-error');
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Diabetes Risk Assessment Form
    const diabetesForm = document.getElementById('diabetes-form');
    if (diabetesForm) {
        diabetesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            try {
                // Calculate risk and store result
                const result = calculateDiabetesRisk(this);
                storeDiabetesResult(result);
                
                // Show success briefly before redirecting
                submitBtn.textContent = 'Success! Redirecting...';
                submitBtn.classList.add('btn-success');
                
                // Redirect to results page
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 800);
                
            } catch (error) {
                console.error('Error processing diabetes form:', error);
                submitBtn.textContent = 'Error. Try Again';
                submitBtn.classList.add('btn-error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-error');
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Lung Cancer Risk Assessment Form
    const lungsForm = document.getElementById('lungs-form');
    if (lungsForm) {
        lungsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            try {
                // Validate form
                const smokingStatus = this.querySelector('#lungs-smoking').value;
                if ((smokingStatus === 'current' || smokingStatus === 'former') && 
                   (!this.querySelector('#lungs-years').value || !this.querySelector('#lungs-packs').value)) {
                    throw new Error('Please fill in all smoking details');
                }
                
                // Calculate risk and store result
                const result = calculateLungCancerRisk(this);
                storeLungCancerResult(result);
                
                // Show success briefly before redirecting
                submitBtn.textContent = 'Success! Redirecting...';
                submitBtn.classList.add('btn-success');
                
                // Redirect to results page
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 800);
                
            } catch (error) {
                console.error('Error processing lung cancer form:', error);
                submitBtn.textContent = error.message || 'Error. Try Again';
                submitBtn.classList.add('btn-error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-error');
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Symptom Checker Form
    const symptomsForm = document.getElementById('symptoms-form');
    if (symptomsForm) {
        symptomsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            try {
                // Validate form
                const symptoms = this.querySelectorAll('input[name="symptoms"]:checked');
                if (symptoms.length === 0) {
                    throw new Error('Please select at least one symptom');
                }
                
                // Calculate result and store it
                const result = checkSymptoms(this);
                storeSymptomResult(result);
                
                // Show success briefly before redirecting
                submitBtn.textContent = 'Success! Redirecting...';
                submitBtn.classList.add('btn-success');
                
                // Redirect to results page
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 800);
                
            } catch (error) {
                console.error('Error processing symptoms form:', error);
                submitBtn.textContent = error.message || 'Error. Try Again';
                submitBtn.classList.add('btn-error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-error');
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Health Score Calculator Form
    const healthScoreForm = document.getElementById('health-score-form');
    if (healthScoreForm) {
        healthScoreForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            try {
                // Validate form
                if (!this.querySelector('#alcohol-consumption').value || !this.querySelector('#health-smoking').value) {
                    throw new Error('Please complete all fields');
                }
                
                // Calculate score and store result
                const result = calculateHealthScore(this);
                storeHealthScoreResult(result);
                
                // Show success briefly before redirecting
                submitBtn.textContent = 'Success! Redirecting...';
                submitBtn.classList.add('btn-success');
                
                // Redirect to results page
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 800);
                
            } catch (error) {
                console.error('Error processing health score form:', error);
                submitBtn.textContent = error.message || 'Error. Try Again';
                submitBtn.classList.add('btn-error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('btn-error');
                    submitBtn.disabled = false;
                }, 2000);
            }
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
    let yearsSmoked = 0;
    let packsPerDay = 0;
    
    // Get smoking-specific data if applicable
    if (smokingStatus === 'current' || smokingStatus === 'former') {
        yearsSmoked = parseInt(form.querySelector('#lungs-years').value) || 0;
        packsPerDay = parseFloat(form.querySelector('#lungs-packs').value) || 0;
    }
    
    // Calculate pack years
    const packYears = smokingStatus !== 'never' ? (packsPerDay * yearsSmoked) : 0;
    
    // Check all risk factors
    const familyHistory = form.querySelector('input[name="lungs-family"]')?.checked || false;
    const airPollution = form.querySelector('input[name="lungs-exposure"]')?.checked || false;
    const asbestos = form.querySelector('input[name="lungs-asbestos"]')?.checked || false;
    const radiationTherapy = form.querySelector('input[name="lungs-radiation"]')?.checked || false;
    const radonGas = form.querySelector('input[name="lungs-radon"]')?.checked || false;
    
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
        score += 20; // Base score for former smokers
        score += Math.min(40, packYears); // Pack years factor (capped at 40)
    } else if (smokingStatus === 'current') {
        score += 35; // Base score for current smokers
        score += Math.min(40, packYears); // Pack years factor (capped at 40)
    }
    
    // Additional risk factors
    if (familyHistory) score += 15;
    if (airPollution) score += 5;
    if (asbestos) score += 15;
    if (radiationTherapy) score += 10;
    if (radonGas) score += 10;
    
    // Gender factor
    if (gender === 'male') score += 5;
    
    // Calculate total risk (0-100)
    let riskScore = Math.min(100, Math.max(0, score));
    
    // Determine risk level
    let riskLevel;
    if (riskScore < 20) riskLevel = 'Low';
    else if (riskScore < 40) riskLevel = 'Low-Moderate';
    else if (riskScore < 70) riskLevel = 'Moderate';
    else riskLevel = 'High';
    
    // Generate insights based on risk factors
    const insights = [];
    
    if (smokingStatus === 'never') {
        insights.push('As a non-smoker, your risk for lung cancer is relatively low.');
    } else if (smokingStatus === 'former') {
        insights.push(`As a former smoker with ${packYears.toFixed(1)} pack-years, your risk is elevated. However, quitting smoking has reduced your risk significantly.`);
        insights.push('Continue to maintain a smoke-free lifestyle to further reduce your risk over time.');
    } else if (smokingStatus === 'current') {
        insights.push(`As a current smoker with ${packYears.toFixed(1)} pack-years, you have a significantly elevated risk of developing lung cancer.`);
        insights.push('Quitting smoking is the single most effective way to reduce your lung cancer risk.');
    }
    
    if (age >= 65) {
        insights.push('Your age is a risk factor for lung cancer. Consider discussing lung cancer screening with your healthcare provider.');
    }
    
    if (familyHistory) {
        insights.push('Having a family history of lung cancer increases your risk.');
    }
    
    if (asbestos || radonGas) {
        insights.push('Exposure to known carcinogens like asbestos or radon gas significantly increases lung cancer risk.');
    }
    
    // Generate recommendations
    const recommendations = [
        'If you smoke, quitting is the most important step you can take to reduce your risk.',
        'Avoid secondhand smoke and other known lung carcinogens.',
        'Test your home for radon gas, especially if you live in a high-risk area.',
        'Follow safety guidelines when working with potentially harmful substances.'
    ];
    
    if (riskLevel === 'Moderate' || riskLevel === 'High') {
        recommendations.push('Discuss lung cancer screening options with your healthcare provider.');
    }
    
    // Return the result object
    return {
        riskScore: riskScore,
        riskLevel: riskLevel,
        details: {
            age: age,
            gender: gender,
            smokingStatus: smokingStatus,
            packYears: packYears.toFixed(1),
            yearsSmoked: yearsSmoked,
            packsPerDay: packsPerDay,
            familyHistory: familyHistory ? 'Yes' : 'No',
            otherRiskFactors: [
                airPollution ? 'Air Pollution' : null,
                asbestos ? 'Asbestos Exposure' : null,
                radiationTherapy ? 'Previous Radiation Therapy' : null,
                radonGas ? 'Radon Gas Exposure' : null
            ].filter(Boolean).join(', ') || 'None'
        },
        insights: insights,
        recommendations: recommendations
    };
}

/**
 * Check Symptoms
 * @param {HTMLFormElement} form - The symptoms form
 * @returns {Object} - The symptom assessment result
 */
function checkSymptoms(form) {
    // Get form data
    const symptomDays = parseInt(form.querySelector('#symptoms-days').value);
    const severity = form.querySelector('#symptoms-severity').value;
    
    // Get all selected symptoms
    const symptoms = Array.from(form.querySelectorAll('input[name="symptoms"]:checked')).map(checkbox => checkbox.value);
    
    // Convert days to duration category
    let duration;
    if (symptomDays <= 3) {
        duration = 'Short-term (1-3 days)';
    } else if (symptomDays <= 7) {
        duration = 'Recent (less than a week)';
    } else if (symptomDays <= 14) {
        duration = 'Persistent (1-2 weeks)';
    } else {
        duration = 'Chronic (more than 2 weeks)';
    }
    
    // Determine possible conditions based on symptoms
    let condition = 'Inconclusive';
    let certainty = 'Low';
    let urgencyLevel = 'Low'; // Default urgency
    
    // Define symptom patterns for common conditions
    const commonConditions = [
        {
            name: 'Common Cold',
            symptoms: ['cough', 'soreThroat', 'congestion', 'headache', 'fatigue'],
            shortDuration: true
        },
        {
            name: 'Influenza (Flu)',
            symptoms: ['fever', 'cough', 'bodyAches', 'fatigue', 'headache', 'soreThroat'],
            shortDuration: true
        },
        {
            name: 'Seasonal Allergies',
            symptoms: ['congestion', 'soreThroat', 'headache', 'fatigue'],
            chronicDuration: true
        },
        {
            name: 'COVID-19',
            symptoms: ['fever', 'cough', 'fatigue', 'shortnessOfBreath', 'lossOfTaste'],
            anyDuration: true
        },
        {
            name: 'Gastroenteritis',
            symptoms: ['nausea', 'diarrhea', 'abdominalPain', 'fatigue', 'fever'],
            shortDuration: true
        },
        {
            name: 'Migraine',
            symptoms: ['headache', 'nausea', 'fatigue', 'dizziness'],
            anyDuration: true
        },
        {
            name: 'Potential Serious Condition',
            symptoms: ['chestPain', 'shortnessOfBreath', 'highFever', 'severeAbdominalPain'],
            anyDuration: true,
            urgent: true
        }
    ];
    
    // Score each condition based on matching symptoms
    const conditionScores = commonConditions.map(cond => {
        const matchingSymptoms = cond.symptoms.filter(s => symptoms.includes(s));
        const matchPercentage = (matchingSymptoms.length / cond.symptoms.length) * 100;
        
        // Check duration compatibility
        let durationMatch = cond.anyDuration;
        if (!durationMatch) {
            if (cond.shortDuration && symptomDays <= 7) durationMatch = true;
            if (cond.chronicDuration && symptomDays > 14) durationMatch = true;
        }
        
        return {
            condition: cond.name,
            score: matchPercentage,
            durationMatch: durationMatch,
            urgent: cond.urgent || false
        };
    });
    
    // Sort by score
    conditionScores.sort((a, b) => b.score - a.score);
    
    // Find the best match
    const bestMatch = conditionScores[0];
    
    // Check for urgent conditions first
    const urgentCondition = conditionScores.find(c => c.urgent && c.score > 50);
    if (urgentCondition) {
        condition = urgentCondition.condition;
        certainty = urgentCondition.score > 75 ? 'High' : 'Medium';
        urgencyLevel = 'High';
    } 
    // Otherwise use best match if it's reasonably good
    else if (bestMatch && bestMatch.score > 50 && bestMatch.durationMatch) {
        condition = bestMatch.condition;
        
        // Determine certainty level
        if (bestMatch.score > 75) {
            certainty = 'High';
        } else if (bestMatch.score > 60) {
            certainty = 'Medium';
        } else {
            certainty = 'Low';
        }
        
        // Adjust urgency based on severity
        if (severity === 'severe') {
            urgencyLevel = 'Medium';
        }
    }
    
    // Special case for chest pain
    if (symptoms.includes('chestPain') && symptoms.includes('shortnessOfBreath')) {
        condition = 'Potential Heart-Related Issue';
        certainty = 'Medium';
        urgencyLevel = 'High';
    }
    
    // If still inconclusive but symptoms are severe
    if (condition === 'Inconclusive' && severity === 'severe') {
        urgencyLevel = 'Medium';
    }
    
    // Generate description
    let description = '';
    if (condition === 'Inconclusive') {
        description = 'Based on the symptoms provided, we cannot determine a specific condition. Please consult with a healthcare provider for proper diagnosis.';
    } else if (urgencyLevel === 'High') {
        description = `Your symptoms suggest ${condition}, which may require prompt medical attention.`;
    } else {
        description = `Your symptoms are consistent with ${condition}. The assessment is based on the combination of symptoms and their duration.`;
    }
    
    // Generate recommendations based on condition and urgency
    const recommendations = [];
    
    if (urgencyLevel === 'High') {
        recommendations.push('Seek medical attention promptly');
        recommendations.push('Contact your healthcare provider or consider visiting an urgent care facility');
    } else if (condition === 'Common Cold') {
        recommendations.push('Rest and stay hydrated');
        recommendations.push('Over-the-counter cold medications may help relieve symptoms');
        recommendations.push('Consult a healthcare provider if symptoms worsen or persist beyond 10 days');
    } else if (condition === 'Influenza (Flu)') {
        recommendations.push('Rest and stay hydrated');
        recommendations.push('Consider over-the-counter flu medications for symptom relief');
        recommendations.push('Consult a healthcare provider, especially if symptoms are severe or you are in a high-risk group');
    } else if (condition === 'Seasonal Allergies') {
        recommendations.push('Over-the-counter antihistamines may help relieve symptoms');
        recommendations.push('Avoid known allergens when possible');
        recommendations.push('Consider consulting with an allergist for long-term management');
    } else if (condition === 'COVID-19') {
        recommendations.push('Self-isolate to prevent potential spread');
        recommendations.push('Consider getting tested for COVID-19');
        recommendations.push('Monitor your symptoms and seek medical attention if they worsen');
    } else {
        recommendations.push('Monitor your symptoms and consult with a healthcare provider if they persist or worsen');
        recommendations.push('Keep track of any new or changing symptoms');
    }
    
    // Return the result object
    return {
        condition: condition,
        certainty: certainty,
        urgencyLevel: urgencyLevel,
        description: description,
        details: {
            symptoms: symptoms,
            duration: duration,
            severity: severity,
            symptomDays: symptomDays
        },
        possibleConditions: conditionScores.filter(c => c.score > 40).map(c => c.condition),
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
    const sleepHours = parseFloat(form.querySelector('#sleep-hours').value);
    const exerciseHours = parseFloat(form.querySelector('#exercise-hours').value);
    const stressLevel = parseInt(form.querySelector('#stress-level').value);
    const dietQuality = parseInt(form.querySelector('#diet-quality').value);
    const smoker = form.querySelector('#health-smoking').value === 'current';
    const formerSmoker = form.querySelector('#health-smoking').value === 'former';
    const alcohol = form.querySelector('#alcohol-consumption').value;
    
    // Calculate health score (start with 100 points)
    let score = 100;
    
    // Sleep factor (ideal: 7-8 hours)
    if (sleepHours < 6) {
        score -= 15;
    } else if (sleepHours > 9) {
        score -= 5;
    }
    
    // Exercise factor (weekly hours)
    if (exerciseHours < 2) {
        score -= 15;
    } else if (exerciseHours < 5) {
        score -= 5;
    } else if (exerciseHours > 10) {
        score += 5; // Bonus for very active
    }
    
    // Stress factor (0-10 scale)
    score -= stressLevel * 2; // Higher stress decreases score
    
    // Diet factor (0-10 scale)
    score += (dietQuality - 5) * 3; // Better diet increases score
    
    // Smoking factor
    if (smoker) {
        score -= 25;
    } else if (formerSmoker) {
        score -= 10;
    }
    
    // Alcohol factor
    switch (alcohol) {
        case 'none': 
            score += 5; // Bonus for abstaining
            break;
        case 'light': 
            score -= 0; // No penalty for light drinking
            break;
        case 'moderate': 
            score -= 10;
            break;
        case 'heavy': 
            score -= 20;
            break;
    }
    
    // Calculate final health score (0-100)
    let healthScore = Math.min(100, Math.max(0, Math.round(score)));
    
    // Determine health status
    let healthStatus;
    if (healthScore >= 85) healthStatus = 'Excellent';
    else if (healthScore >= 70) healthStatus = 'Good';
    else if (healthScore >= 50) healthStatus = 'Fair';
    else healthStatus = 'Poor';
    
    // Generate insights based on factors
    const insights = [];
    
    if (sleepHours < 6) {
        insights.push(`You reported getting only ${sleepHours} hours of sleep per night, which is below the recommended 7-9 hours.`);
    } else if (sleepHours > 9) {
        insights.push(`You reported getting ${sleepHours} hours of sleep per night, which is slightly above the recommended range.`);
    } else {
        insights.push(`Your sleep duration of ${sleepHours} hours per night is within the healthy range.`);
    }
    
    if (exerciseHours < 2) {
        insights.push(`You reported only ${exerciseHours} hours of exercise per week, which is below the recommended level.`);
    } else {
        insights.push(`Your exercise level of ${exerciseHours} hours per week is beneficial for your health.`);
    }
    
    if (stressLevel > 6) {
        insights.push(`Your stress level is rated as ${stressLevel}/10, which may be impacting your health negatively.`);
    }
    
    if (dietQuality < 5) {
        insights.push(`You rated your diet quality as ${dietQuality}/10, which suggests room for improvement.`);
    } else if (dietQuality >= 7) {
        insights.push(`Your diet quality rating of ${dietQuality}/10 suggests you maintain healthy eating habits.`);
    }
    
    if (smoker) {
        insights.push('As a current smoker, you have a significantly increased risk for various health conditions.');
    } else if (formerSmoker) {
        insights.push('As a former smoker, your health risks are reduced compared to current smokers, but some elevated risk remains.');
    }
    
    if (alcohol === 'moderate' || alcohol === 'heavy') {
        insights.push(`Your ${alcohol} alcohol consumption may be negatively affecting your health.`);
    }
    
    // Generate improvement recommendations
    const improvementAreas = [];
    
    if (sleepHours < 6) {
        improvementAreas.push('Aim for 7-8 hours of quality sleep per night.');
    }
    
    if (exerciseHours < 2.5) {
        improvementAreas.push('Try to get at least 150 minutes (2.5 hours) of moderate exercise per week.');
    }
    
    if (stressLevel > 6) {
        improvementAreas.push('Consider stress management techniques such as meditation, yoga, or mindfulness.');
    }
    
    if (dietQuality < 6) {
        improvementAreas.push('Focus on improving your diet with more fruits, vegetables, and whole foods.');
    }
    
    if (smoker) {
        improvementAreas.push('Quitting smoking is one of the most impactful changes you can make for your health.');
    }
    
    if (alcohol === 'moderate') {
        improvementAreas.push('Consider reducing alcohol consumption to improve overall health.');
    } else if (alcohol === 'heavy') {
        improvementAreas.push('Significantly reducing alcohol intake would substantially improve your health score.');
    }
    
    // Return the result object
    return {
        healthScore: healthScore,
        healthStatus: healthStatus,
        details: {
            sleepHours: sleepHours,
            exerciseHours: exerciseHours,
            stressLevel: stressLevel,
            dietQuality: dietQuality,
            smoker: smoker ? 'Yes' : (formerSmoker ? 'Former' : 'No'),
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
    
    // Save to user's assessment history
    saveAssessmentToHistory({
        type: 'Heart Health Assessment',
        date: new Date().toISOString(),
        riskLevel: getRiskLevelFromScore(result.riskScore),
        summary: `Your heart risk score is ${result.riskScore}, indicating a ${result.riskCategory} risk of heart disease.`,
        details: [
            `Age: ${result.details.age}`,
            `Gender: ${result.details.gender}`,
            `Blood Pressure: ${result.details.bloodPressure}`,
            `Total Cholesterol: ${result.details.cholesterol} mg/dL`,
            `HDL Cholesterol: ${result.details.hdl} mg/dL`,
            `Smoker: ${result.details.smoker}`,
            `Diabetic: ${result.details.diabetic}`
        ],
        recommendations: result.insights || ['Consult with a healthcare provider for personalized heart health recommendations.']
    });
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
    
    // Save to user's assessment history
    saveAssessmentToHistory({
        type: 'Diabetes Risk Assessment',
        date: new Date().toISOString(),
        riskLevel: getRiskLevelFromCategory(result.riskCategory),
        summary: `Your diabetes risk score is ${result.riskPercentage}%, indicating a ${result.riskCategory} risk of developing type 2 diabetes.`,
        details: [
            `Age: ${result.details.age}`,
            `Gender: ${result.details.gender}`,
            `BMI: ${result.details.bmi}`,
            `Fasting Glucose: ${result.details.fastingGlucose} mg/dL`,
            `Family History: ${result.details.familyHistory}`,
            `Activity Level: ${result.details.activityLevel}`,
            `Hypertension: ${result.details.hypertension}`
        ],
        recommendations: result.insights || ['Consult with a healthcare provider for personalized diabetes prevention recommendations.']
    });
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
    
    // Save to user's assessment history
    saveAssessmentToHistory({
        type: 'Lung Cancer Risk Assessment',
        date: new Date().toISOString(),
        riskLevel: result.riskLevel,
        summary: `Your lung cancer risk is considered ${result.riskLevel.toLowerCase()} based on your smoking history and other risk factors.`,
        details: [
            `Age: ${result.details.age}`,
            `Gender: ${result.details.gender}`,
            `Smoking Status: ${result.details.smokingStatus}`,
            `Pack Years: ${result.details.packYears}`,
            `Years Smoked: ${result.details.yearsSmoked || 'N/A'}`,
            `Other Risk Factors: ${result.details.otherRiskFactors}`
        ],
        recommendations: result.recommendations
    });
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
    
    // Save to user's assessment history
    saveAssessmentToHistory({
        type: 'Symptom Assessment',
        date: new Date().toISOString(),
        riskLevel: result.urgencyLevel,
        summary: `Based on your symptoms, our system suggests ${result.condition} (${result.certainty} certainty).`,
        details: [
            `Condition: ${result.condition}`,
            `Certainty Level: ${result.certainty}`,
            `Urgency Level: ${result.urgencyLevel}`,
            `Duration: ${result.details.duration}`,
            `Severity: ${result.details.severity}`,
            `Reported Symptoms: ${result.details.symptoms.join(', ')}`
        ],
        recommendations: result.recommendations
    });
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
    
    // Save to user's assessment history
    saveAssessmentToHistory({
        type: 'Health Score Assessment',
        date: new Date().toISOString(),
        riskLevel: getRiskLevelFromHealthScore(result.healthScore),
        summary: `Your overall health score is ${result.healthScore}, which is considered ${result.healthStatus.toLowerCase()}.`,
        details: [
            `BMI: ${result.details.bmi}`,
            `Sleep: ${result.details.sleepHours} hours/night`,
            `Exercise: ${result.details.exerciseHours} hours/week`,
            `Stress Level: ${result.details.stressLevel}/10`,
            `Diet Quality: ${result.details.dietQuality}/10`,
            `Smoker: ${result.details.smoker}`,
            `Alcohol Consumption: ${result.details.alcoholConsumption}`
        ],
        recommendations: result.improvementAreas
    });
}

/**
 * Save assessment data to user's assessment history in localStorage
 * @param {Object} assessmentData - The assessment data to save
 */
function saveAssessmentToHistory(assessmentData) {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isLoggedIn) return;
    
    // Get existing assessment history
    const allAssessments = JSON.parse(localStorage.getItem('userAssessments')) || {};
    const userAssessments = allAssessments[currentUser.email] || [];
    
    // Add new assessment to user's history
    userAssessments.push(assessmentData);
    
    // Save back to localStorage
    allAssessments[currentUser.email] = userAssessments;
    localStorage.setItem('userAssessments', JSON.stringify(allAssessments));
}

/**
 * Get risk level string from score
 * @param {number} score - Risk score
 * @returns {string} - Risk level (Low, Medium, High)
 */
function getRiskLevelFromScore(score) {
    if (score < 30) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
}

/**
 * Get standardized risk level from category
 * @param {string} category - Risk category (e.g., 'low', 'medium', 'high')
 * @returns {string} - Standardized risk level (Low, Medium, High)
 */
function getRiskLevelFromCategory(category) {
    // Standardize and capitalize risk level
    switch(category.toLowerCase()) {
        case 'low':
            return 'Low';
        case 'medium':
            return 'Medium';
        case 'high':
            return 'High';
        default:
            return 'Medium';
    }
}

/**
 * Get risk level string from health score
 * @param {number} healthScore - Health score (0-100)
 * @returns {string} - Risk level (Low, Medium, High)
 */
function getRiskLevelFromHealthScore(healthScore) {
    if (healthScore >= 70) return 'Low';
    if (healthScore >= 50) return 'Medium';
    return 'High';
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