/**
 * WellPredict - Additional Health Assessment Functions
 */

/**
 * Check Symptoms
 * @param {HTMLFormElement} form - The symptom checker form
 * @returns {Object} - The assessment result
 */
function checkSymptoms(form) {
    // Get form values
    const symptomDays = parseInt(form.querySelector('#symptoms-days').value);
    const severity = form.querySelector('#symptoms-severity').value;
    
    // Get selected symptoms
    const selectedSymptoms = Array.from(form.querySelectorAll('input[name="symptoms"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Define symptom-condition mappings (simplified for demo)
    const conditionMappings = {
        // Common Cold
        cold: {
            symptoms: ['cough', 'soreThroat', 'congestion'],
            threshold: 2
        },
        // Flu
        flu: {
            symptoms: ['fever', 'cough', 'bodyAches', 'fatigue', 'headache'],
            threshold: 3
        },
        // COVID-19
        covid: {
            symptoms: ['fever', 'cough', 'shortnessOfBreath', 'fatigue', 'bodyAches', 'lossOfTaste'],
            threshold: 3
        },
        // Allergies
        allergies: {
            symptoms: ['congestion', 'soreThroat', 'cough', 'headache'],
            threshold: 2,
            excludes: ['fever', 'bodyAches'] // Typically not present in allergies
        },
        // Gastroenteritis
        gastro: {
            symptoms: ['nausea', 'diarrhea', 'abdominalPain', 'fatigue'],
            threshold: 2,
            excludes: ['congestion', 'soreThroat']
        },
        // Migraine
        migraine: {
            symptoms: ['headache', 'nausea', 'dizziness'],
            threshold: 2,
            excludes: ['cough', 'soreThroat', 'congestion']
        },
        // Pneumonia
        pneumonia: {
            symptoms: ['fever', 'cough', 'shortnessOfBreath', 'fatigue', 'chestPain'],
            threshold: 3
        }
    };
    
    // Calculate match scores for each condition
    const scores = {};
    
    for (const [condition, mapping] of Object.entries(conditionMappings)) {
        let score = 0;
        
        // Count matching symptoms
        mapping.symptoms.forEach(symptom => {
            if (selectedSymptoms.includes(symptom)) {
                score++;
            }
        });
        
        // Check for exclusionary symptoms
        let hasExcludes = false;
        if (mapping.excludes) {
            mapping.excludes.forEach(exclude => {
                if (selectedSymptoms.includes(exclude)) {
                    hasExcludes = true;
                }
            });
        }
        
        // Only consider conditions that meet threshold and don't have exclusionary symptoms
        if (score >= mapping.threshold && !hasExcludes) {
            scores[condition] = score / mapping.symptoms.length;
        }
    }
    
    // Find the most likely condition based on highest match score
    let likelyCondition = null;
    let highestScore = 0;
    
    for (const [condition, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            likelyCondition = condition;
        }
    }
    
    // Map condition ID to human-readable name and recommendations
    const conditionInfo = {
        cold: {
            name: 'Common Cold',
            recommendations: [
                'Rest and drink plenty of fluids',
                'Over-the-counter cold medications may help relieve symptoms',
                'Use a humidifier to ease congestion',
                'Consult a doctor if symptoms worsen or last more than 10 days'
            ]
        },
        flu: {
            name: 'Influenza (Flu)',
            recommendations: [
                'Rest and stay home to avoid spreading the virus',
                'Drink plenty of fluids',
                'Take over-the-counter pain relievers for fever and aches',
                'Consult a doctor, especially if you\'re at high risk for complications',
                'Consider antiviral medications if caught early'
            ]
        },
        covid: {
            name: 'Possible COVID-19',
            recommendations: [
                'Get tested for COVID-19 immediately',
                'Self-isolate to prevent potential spread',
                'Monitor your symptoms closely, especially breathing difficulties',
                'Contact healthcare provider for guidance',
                'Seek emergency care if you experience severe symptoms'
            ]
        },
        allergies: {
            name: 'Seasonal Allergies',
            recommendations: [
                'Try over-the-counter antihistamines to relieve symptoms',
                'Avoid known allergens when possible',
                'Consider nasal steroid sprays for congestion',
                'Consult an allergist if symptoms are severe or persistent'
            ]
        },
        gastro: {
            name: 'Gastroenteritis',
            recommendations: [
                'Stay hydrated with clear fluids',
                'Eat bland, easy-to-digest foods when you can eat',
                'Rest to help recovery',
                'Seek medical care if symptoms are severe or include high fever'
            ]
        },
        migraine: {
            name: 'Migraine',
            recommendations: [
                'Rest in a quiet, dark room',
                'Apply cold compresses to your forehead',
                'Over-the-counter pain medications may help',
                'Consider prescription medications if migraines are frequent',
                'Identify and avoid migraine triggers'
            ]
        },
        pneumonia: {
            name: 'Possible Pneumonia',
            recommendations: [
                'Consult a healthcare provider immediately',
                'Chest X-ray may be needed for diagnosis',
                'Rest and stay hydrated',
                'Complete any prescribed antibiotic course if bacterial',
                'Seek emergency care if breathing becomes difficult'
            ]
        }
    };
    
    // If no condition matches well enough, provide general advice
    if (!likelyCondition || highestScore < 0.5) {
        return {
            condition: 'Inconclusive',
            certainty: 'Low',
            description: 'Based on the symptoms provided, a specific condition couldn\'t be identified with confidence. Your symptoms could be due to various causes.',
            details: {
                symptoms: selectedSymptoms.map(symptom => formatSymptomName(symptom)),
                duration: `${symptomDays} day${symptomDays !== 1 ? 's' : ''}`,
                severity: severity.charAt(0).toUpperCase() + severity.slice(1)
            },
            recommendations: [
                'Rest and stay hydrated',
                'Monitor your symptoms for changes',
                'Consult with a healthcare provider if symptoms persist or worsen',
                'Consider keeping a symptom diary to share with your doctor'
            ]
        };
    }
    
    // If a condition matches, return its information
    const matchedCondition = conditionInfo[likelyCondition];
    
    // Adjust certainty based on score and number of symptoms
    let certainty = 'Moderate';
    if (highestScore > 0.8) {
        certainty = 'High';
    } else if (highestScore < 0.6) {
        certainty = 'Low';
    }
    
    // Consider duration for certainty and description
    let description = `Based on your symptoms, you may have ${matchedCondition.name}.`;
    
    if (likelyCondition === 'cold' && symptomDays > 10) {
        description += ' However, cold symptoms typically don\'t last more than 10 days, so you should consult a doctor.';
        certainty = 'Moderate';
    } else if (likelyCondition === 'flu' && symptomDays > 14) {
        description += ' However, flu symptoms typically resolve within two weeks, so you should consult a doctor.';
        certainty = 'Moderate';
    }
    
    return {
        condition: matchedCondition.name,
        certainty: certainty,
        description: description,
        details: {
            symptoms: selectedSymptoms.map(symptom => formatSymptomName(symptom)),
            duration: `${symptomDays} day${symptomDays !== 1 ? 's' : ''}`,
            severity: severity.charAt(0).toUpperCase() + severity.slice(1)
        },
        recommendations: matchedCondition.recommendations
    };
}

/**
 * Format symptom name for display
 * @param {string} symptom - The symptom identifier
 * @returns {string} - Formatted symptom name
 */
function formatSymptomName(symptom) {
    const formattedName = symptom
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
        
    // Special case handling
    return formattedName
        .replace('Loss Of Taste', 'Loss of Taste/Smell')
        .replace('Shortness Of Breath', 'Shortness of Breath');
}

/**
 * Calculate Health Score
 * @param {HTMLFormElement} form - The health score form
 * @returns {Object} - The assessment result
 */
function calculateHealthScore(form) {
    // Get form values
    const sleepHours = parseFloat(form.querySelector('#sleep-hours').value);
    const exerciseHours = parseFloat(form.querySelector('#exercise-hours').value);
    const stressLevel = parseInt(form.querySelector('#stress-level').value);
    const dietQuality = parseInt(form.querySelector('#diet-quality').value);
    const alcoholConsumption = form.querySelector('#alcohol-consumption').value;
    const smokingStatus = form.querySelector('#health-smoking').value;
    
    // Calculate individual scores (out of 100)
    
    // Sleep score (optimal: 7-9 hours)
    let sleepScore = 0;
    if (sleepHours >= 7 && sleepHours <= 9) {
        sleepScore = 100; // Optimal
    } else if (sleepHours >= 6 && sleepHours < 7) {
        sleepScore = 80; // Slightly below optimal
    } else if (sleepHours > 9 && sleepHours <= 10) {
        sleepScore = 80; // Slightly above optimal
    } else if (sleepHours >= 5 && sleepHours < 6) {
        sleepScore = 60; // Insufficient
    } else if (sleepHours > 10 && sleepHours <= 12) {
        sleepScore = 60; // Too much
    } else {
        sleepScore = 40; // Very poor
    }
    
    // Exercise score (recommended: 150+ min/week = 2.5+ hours)
    let exerciseScore = 0;
    if (exerciseHours >= 5) {
        exerciseScore = 100; // Excellent
    } else if (exerciseHours >= 2.5) {
        exerciseScore = 90; // Meeting recommendations
    } else if (exerciseHours >= 1) {
        exerciseScore = 70; // Below recommendations but still beneficial
    } else if (exerciseHours > 0) {
        exerciseScore = 50; // Minimal
    } else {
        exerciseScore = 30; // None
    }
    
    // Stress score (1-10 scale, lower is better)
    const stressScore = Math.max(0, 100 - (stressLevel * 10));
    
    // Diet score (1-10 scale, higher is better)
    const dietScore = dietQuality * 10;
    
    // Alcohol score
    let alcoholScore = 0;
    switch (alcoholConsumption) {
        case 'none': alcoholScore = 100; break;
        case 'light': alcoholScore = 90; break;
        case 'moderate': alcoholScore = 70; break;
        case 'heavy': alcoholScore = 40; break;
        default: alcoholScore = 0;
    }
    
    // Smoking score
    let smokingScore = 0;
    switch (smokingStatus) {
        case 'never': smokingScore = 100; break;
        case 'former': smokingScore = 80; break;
        case 'current': smokingScore = 40; break;
        default: smokingScore = 0;
    }
    
    // Calculate weighted overall score
    const overallScore = Math.round(
        (sleepScore * 0.2) +        // 20% weight
        (exerciseScore * 0.2) +     // 20% weight
        (stressScore * 0.15) +      // 15% weight
        (dietScore * 0.15) +        // 15% weight
        (alcoholScore * 0.15) +     // 15% weight
        (smokingScore * 0.15)       // 15% weight
    );
    
    // Determine health status based on overall score
    let healthStatus;
    let recommendations = [];
    
    if (overallScore >= 90) {
        healthStatus = 'Excellent';
        recommendations = [
            'Maintain your healthy lifestyle',
            'Consider adding variety to your exercise routine',
            'Stay current with preventive health screenings',
            'Share your healthy habits with friends and family'
        ];
    } else if (overallScore >= 75) {
        healthStatus = 'Very Good';
        recommendations = [
            'Continue your healthy habits',
            'Identify areas where small improvements can be made',
            'Schedule regular health check-ups',
            'Consider adding stress management techniques like meditation'
        ];
    } else if (overallScore >= 60) {
        healthStatus = 'Good';
        recommendations = [
            'Focus on improving your weakest health area first',
            'Gradually increase physical activity',
            'Consider consulting with a nutritionist for diet improvements',
            'Establish a consistent sleep schedule'
        ];
    } else if (overallScore >= 40) {
        healthStatus = 'Fair';
        recommendations = [
            'Consult with a healthcare provider about improving your health',
            'Make gradual lifestyle changes rather than drastic ones',
            'Set specific, achievable health goals',
            'Consider joining a support group for motivation',
            smokingStatus === 'current' ? 'Consider a smoking cessation program' : null,
            alcoholConsumption === 'heavy' ? 'Reduce alcohol consumption' : null
        ].filter(Boolean);
    } else {
        healthStatus = 'Needs Improvement';
        recommendations = [
            'Schedule a comprehensive health assessment with a healthcare provider',
            'Focus on one health behavior change at a time',
            'Seek support from healthcare professionals for guidance',
            'Consider lifestyle medicine programs',
            smokingStatus === 'current' ? 'Quitting smoking should be a priority' : null,
            alcoholConsumption === 'heavy' ? 'Reducing alcohol consumption is strongly recommended' : null
        ].filter(Boolean);
    }
    
    // Create improvement areas based on individual scores
    const improvementAreas = [];
    
    if (sleepScore < 70) improvementAreas.push('Sleep');
    if (exerciseScore < 70) improvementAreas.push('Physical Activity');
    if (stressScore < 70) improvementAreas.push('Stress Management');
    if (dietScore < 70) improvementAreas.push('Nutrition');
    if (alcoholScore < 70) improvementAreas.push('Alcohol Consumption');
    if (smokingScore < 70) improvementAreas.push('Tobacco Use');
    
    // Create result object
    return {
        healthScore: overallScore,
        healthStatus: healthStatus,
        details: {
            sleepHours: `${sleepHours} hours`,
            exerciseWeekly: `${exerciseHours} hours`,
            stressLevel: `${stressLevel}/10`,
            dietQuality: `${dietQuality}/10`,
            alcoholConsumption: alcoholConsumption.replace(/([A-Z])/g, ' $1').toLowerCase(),
            smokingStatus: smokingStatus === 'never' ? 'Never Smoked' : smokingStatus === 'former' ? 'Former Smoker' : 'Current Smoker'
        },
        componentScores: {
            sleep: sleepScore,
            exercise: exerciseScore,
            stress: stressScore,
            diet: dietScore,
            alcohol: alcoholScore,
            smoking: smokingScore
        },
        improvementAreas: improvementAreas,
        recommendations: recommendations
    };
} 