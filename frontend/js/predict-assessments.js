/**
 * WellPredict - Health Assessment Functions
 */

/**
 * Assess Heart Health
 * @param {HTMLFormElement} form - The heart health assessment form
 * @returns {Object} - The assessment result
 */
function assessHeartHealth(form) {
    // Get form values
    const age = parseInt(form.querySelector('#heart-age').value);
    const gender = form.querySelector('#heart-gender').value;
    const systolic = parseInt(form.querySelector('#heart-systolic').value);
    const diastolic = parseInt(form.querySelector('#heart-diastolic').value);
    const cholesterol = parseInt(form.querySelector('#heart-cholesterol').value);
    const hdl = parseInt(form.querySelector('#heart-hdl').value);
    const smoker = form.querySelector('input[name="heart-smoke"]:checked').value === 'yes';
    const diabetic = form.querySelector('input[name="heart-diabetes"]:checked').value === 'yes';
    
    // Calculate risk score (simplified algorithm)
    let riskScore = 0;
    
    // Age factor
    if (age < 40) riskScore += 0;
    else if (age < 50) riskScore += 1;
    else if (age < 60) riskScore += 2;
    else if (age < 70) riskScore += 3;
    else riskScore += 4;
    
    // Blood pressure factor
    if (systolic >= 180 || diastolic >= 110) riskScore += 4;
    else if (systolic >= 160 || diastolic >= 100) riskScore += 3;
    else if (systolic >= 140 || diastolic >= 90) riskScore += 2;
    else if (systolic >= 130 || diastolic >= 85) riskScore += 1;
    else riskScore += 0;
    
    // Cholesterol factor
    if (cholesterol > 240) riskScore += 3;
    else if (cholesterol >= 200) riskScore += 2;
    else if (cholesterol >= 160) riskScore += 1;
    else riskScore += 0;
    
    // HDL factor (high HDL is good, so we subtract)
    if (hdl < 40) riskScore += 2;
    else if (hdl < 60) riskScore += 1;
    else riskScore -= 1;
    
    // Smoking factor
    if (smoker) riskScore += 3;
    
    // Diabetes factor
    if (diabetic) riskScore += 2;
    
    // Gender factor (simplified for demo)
    if (gender === 'male' && age > 45) riskScore += 1;
    if (gender === 'female' && age > 55) riskScore += 1;
    
    // Determine risk category
    let riskCategory;
    let recommendations = [];
    
    if (riskScore <= 4) {
        riskCategory = 'Low';
        recommendations = [
            'Maintain a healthy lifestyle with regular exercise',
            'Continue with a balanced diet low in saturated fats',
            'Schedule routine check-ups every 1-2 years'
        ];
    } else if (riskScore <= 8) {
        riskCategory = 'Moderate';
        recommendations = [
            'Increase physical activity to at least 150 minutes per week',
            'Reduce sodium and saturated fat intake',
            'Consider discussing preventive medications with your doctor',
            'Schedule check-ups every 6-12 months'
        ];
    } else {
        riskCategory = 'High';
        recommendations = [
            'Consult with a healthcare provider as soon as possible',
            'Follow a heart-healthy diet recommended by a nutritionist',
            'Implement a regular exercise program under medical supervision',
            'Monitor blood pressure and cholesterol regularly',
            'Consider stress reduction techniques like meditation'
        ];
    }
    
    // Create result object
    return {
        riskCategory: riskCategory,
        riskScore: riskScore,
        details: {
            age: age,
            gender: gender,
            bloodPressure: `${systolic}/${diastolic} mmHg`,
            cholesterol: `${cholesterol} mg/dL`,
            hdl: `${hdl} mg/dL`,
            smoker: smoker ? 'Yes' : 'No',
            diabetic: diabetic ? 'Yes' : 'No'
        },
        recommendations: recommendations
    };
}

/**
 * Assess Diabetes Risk
 * @param {HTMLFormElement} form - The diabetes risk assessment form
 * @returns {Object} - The assessment result
 */
function assessDiabetesRisk(form) {
    // Get form values
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
    
    // Calculate risk percentage (simplified algorithm)
    let riskPercentage = 0;
    
    // Age factor
    if (age < 40) riskPercentage += 0;
    else if (age < 50) riskPercentage += 5;
    else if (age < 60) riskPercentage += 10;
    else riskPercentage += 15;
    
    // BMI factor
    if (bmi < 18.5) riskPercentage += 0;
    else if (bmi < 25) riskPercentage += 5;
    else if (bmi < 30) riskPercentage += 10;
    else if (bmi < 35) riskPercentage += 20;
    else riskPercentage += 30;
    
    // Fasting glucose factor (most significant)
    if (fastingGlucose < 100) riskPercentage += 0;
    else if (fastingGlucose < 126) riskPercentage += 25; // Prediabetic range
    else riskPercentage += 50; // Diabetic range
    
    // Family history factor
    if (familyHistory) riskPercentage += 10;
    
    // Activity level factor
    switch (activityLevel) {
        case 'sedentary': riskPercentage += 10; break;
        case 'light': riskPercentage += 5; break;
        case 'moderate': riskPercentage += 0; break;
        case 'active': riskPercentage -= 5; break;
        case 'veryActive': riskPercentage -= 10; break;
    }
    
    // Hypertension factor
    if (hypertension) riskPercentage += 10;
    
    // Cap risk percentage between 0-100%
    riskPercentage = Math.max(0, Math.min(100, riskPercentage));
    
    // Determine risk category and recommendations
    let riskCategory;
    let recommendations = [];
    
    if (riskPercentage < 20) {
        riskCategory = 'Low';
        recommendations = [
            'Maintain a healthy weight through balanced diet and regular exercise',
            'Continue with annual check-ups and blood glucose testing',
            'Limit sugar and refined carbohydrate intake'
        ];
    } else if (riskPercentage < 50) {
        riskCategory = 'Moderate';
        recommendations = [
            'Increase physical activity to at least 150 minutes per week',
            'Follow a low-glycemic diet rich in fiber and low in added sugars',
            'Get blood glucose levels checked every 6 months',
            'Consider consulting with a nutritionist for personalized diet plan'
        ];
    } else {
        riskCategory = 'High';
        recommendations = [
            'Consult with a healthcare provider as soon as possible',
            'Monitor blood glucose levels regularly',
            'Implement a structured weight management program if overweight',
            'Follow a diabetic diet plan recommended by a healthcare professional',
            'Consider joining a diabetes prevention program'
        ];
    }
    
    // Create result object
    return {
        riskCategory: riskCategory,
        riskPercentage: Math.round(riskPercentage),
        details: {
            age: age,
            gender: gender,
            bmi: bmi.toFixed(1),
            weight: `${weight} kg`,
            height: `${height} cm`,
            fastingGlucose: `${fastingGlucose} mg/dL`,
            familyHistory: familyHistory ? 'Yes' : 'No',
            activityLevel: activityLevel.replace(/([A-Z])/g, ' $1').toLowerCase(),
            hypertension: hypertension ? 'Yes' : 'No'
        },
        recommendations: recommendations
    };
}

/**
 * Assess Lung Cancer Risk
 * @param {HTMLFormElement} form - The lung cancer risk assessment form
 * @returns {Object} - The assessment result
 */
function assessLungCancerRisk(form) {
    // Get form values
    const age = parseInt(form.querySelector('#lungs-age').value);
    const gender = form.querySelector('#lungs-gender').value;
    const smokingStatus = form.querySelector('#lungs-smoking').value;
    
    // Get additional risk factors (checkboxes)
    const familyHistory = form.querySelector('input[name="lungs-family"]')?.checked || false;
    const airPollution = form.querySelector('input[name="lungs-exposure"]')?.checked || false;
    const asbestos = form.querySelector('input[name="lungs-asbestos"]')?.checked || false;
    const radiation = form.querySelector('input[name="lungs-radiation"]')?.checked || false;
    const radon = form.querySelector('input[name="lungs-radon"]')?.checked || false;
    
    // Count risk factors
    const riskFactors = [familyHistory, airPollution, asbestos, radiation, radon].filter(Boolean).length;
    
    // Get smoking details if applicable
    let smokingYears = 0;
    let packsPerDay = 0;
    
    if (smokingStatus === 'former' || smokingStatus === 'current') {
        smokingYears = parseInt(form.querySelector('#lungs-years').value) || 0;
        packsPerDay = parseFloat(form.querySelector('#lungs-packs').value) || 0;
    }
    
    // Calculate pack years (if smoker)
    const packYears = smokingYears * packsPerDay;
    
    // Determine risk level based on smoking status, pack years, and risk factors
    let riskLevel;
    let riskDescription;
    let recommendations = [];
    
    // Basic risk assessment based on smoking status
    if (smokingStatus === 'never' && riskFactors === 0) {
        riskLevel = 'Low Risk';
        riskDescription = 'Your risk of developing lung cancer is relatively low based on the information provided.';
        recommendations = [
            'Maintain a smoke-free lifestyle',
            'Avoid secondhand smoke exposure',
            'Ensure good ventilation in your home',
            'Consider regular general health check-ups'
        ];
    } else if (smokingStatus === 'never' && riskFactors > 0) {
        riskLevel = 'Slightly Elevated Risk';
        riskDescription = 'Your risk is slightly higher than average due to the presence of risk factors.';
        recommendations = [
            'Maintain a smoke-free lifestyle',
            'Minimize exposure to identified risk factors when possible',
            'Ensure proper ventilation in your home and workplace',
            'Discuss your risk factors with a healthcare provider during regular check-ups'
        ];
    } else if (smokingStatus === 'former' && packYears < 15) {
        riskLevel = 'Moderately Elevated Risk';
        riskDescription = 'Your risk is moderately elevated due to your smoking history.';
        recommendations = [
            'Continue to avoid smoking and tobacco products',
            'Maintain regular health check-ups',
            'Consider discussing lung cancer screening with your doctor',
            'Follow a healthy diet rich in fruits and vegetables',
            'Exercise regularly to improve lung function'
        ];
    } else if ((smokingStatus === 'former' && packYears >= 15) || 
               (smokingStatus === 'current' && packYears < 15)) {
        riskLevel = 'High Risk';
        riskDescription = 'Your risk is significantly elevated based on your smoking history.';
        recommendations = [
            smokingStatus === 'current' ? 'Quit smoking immediately' : 'Continue to avoid smoking',
            'Discuss lung cancer screening options with your healthcare provider',
            'Schedule regular check-ups with focus on respiratory health',
            'Consider a lung function test',
            'Minimize exposure to other lung irritants'
        ];
    } else if (smokingStatus === 'current' && packYears >= 15) {
        riskLevel = 'Very High Risk';
        riskDescription = 'Your risk is very high due to your current smoking habits and history.';
        recommendations = [
            'Seek professional help to quit smoking immediately',
            'Discuss regular lung cancer screening with your doctor',
            'Consider joining a smoking cessation program',
            'Schedule comprehensive health check-ups every 6-12 months',
            'Be alert to potential symptoms like persistent cough or shortness of breath'
        ];
    }
    
    // Add risk factor to description if present
    if (riskFactors > 0) {
        riskDescription += ` The presence of ${riskFactors} additional risk factor${riskFactors > 1 ? 's' : ''} increases your overall risk.`;
    }
    
    // Create result object
    return {
        riskLevel: riskLevel,
        riskDescription: riskDescription,
        details: {
            age: age,
            gender: gender,
            smokingStatus: smokingStatus.replace(/([A-Z])/g, ' $1').replace('never', 'Never Smoked').replace('former', 'Former Smoker').replace('current', 'Current Smoker'),
            packYears: smokingStatus === 'never' ? 'N/A' : packYears.toFixed(1),
            riskFactors: [
                familyHistory ? 'Family history of lung cancer' : null,
                airPollution ? 'Exposure to air pollution' : null,
                asbestos ? 'Exposure to asbestos' : null,
                radiation ? 'Previous radiation therapy to the chest' : null,
                radon ? 'Exposure to radon gas' : null
            ].filter(Boolean)
        },
        recommendations: recommendations
    };
} 