const axios = require('axios');

// Test data for heart disease prediction
const heartTestData = {
    age: 45,
    sex: 1,
    cp: 3,
    trestbps: 130,
    chol: 250,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 2.3,
    slope: 0,
    ca: 0,
    thal: 1
};

// Test data for diabetes prediction
const diabetesTestData = {
    pregnancies: 2,
    glucose: 120,
    blood_pressure: 80,
    skin_thickness: 35,
    insulin: 150,
    bmi: 28.5,
    diabetes_pedigree: 0.5,
    age: 35,
    family_history: 1,
    physical_activity: 5,
    smoking: 0,
    alcohol: 2
};

async function testHeartPrediction() {
    console.log('\n🧪 Testing Heart Disease Prediction Flow...');
    console.log('Input data:', heartTestData);
    
    try {
        const response = await axios.post('http://localhost:3000/api/predict/heart', heartTestData, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ Heart prediction successful!');
        console.log('Response:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Heart prediction failed:', error.response?.data || error.message);
        return false;
    }
}

async function testDiabetesPrediction() {
    console.log('\n🧪 Testing Diabetes Prediction Flow...');
    console.log('Input data:', diabetesTestData);
    
    try {
        const response = await axios.post('http://localhost:3000/api/predict/diabetes', diabetesTestData, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ Diabetes prediction successful!');
        console.log('Response:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Diabetes prediction failed:', error.response?.data || error.message);
        return false;
    }
}

async function testBackendHealth() {
    console.log('\n🏥 Testing Backend Health...');
    
    try {
        const response = await axios.get('http://localhost:3000/health');
        console.log('✅ Backend is healthy!');
        console.log('Response:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Backend health check failed:', error.message);
        return false;
    }
}

async function testFlaskServices() {
    console.log('\n🐍 Testing Flask Services...');
    
    try {
        // Test heart Flask service
        const heartResponse = await axios.get('http://localhost:5001/health');
        console.log('✅ Heart Flask service is healthy!');
        console.log('Heart service response:', heartResponse.data);
    } catch (error) {
        console.error('❌ Heart Flask service health check failed:', error.message);
    }
    
    try {
        // Test diabetes Flask service
        const diabetesResponse = await axios.get('http://localhost:5002/health');
        console.log('✅ Diabetes Flask service is healthy!');
        console.log('Diabetes service response:', diabetesResponse.data);
    } catch (error) {
        console.error('❌ Diabetes Flask service health check failed:', error.message);
    }
}

async function runAllTests() {
    console.log('🚀 Starting ML Prediction Flow Tests...\n');
    
    // Test backend health
    const backendHealthy = await testBackendHealth();
    
    // Test Flask services
    await testFlaskServices();
    
    if (backendHealthy) {
        // Test predictions
        const heartSuccess = await testHeartPrediction();
        const diabetesSuccess = await testDiabetesPrediction();
        
        console.log('\n📊 Test Results Summary:');
        console.log(`Backend Health: ${backendHealthy ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Heart Prediction: ${heartSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Diabetes Prediction: ${diabetesSuccess ? '✅ PASS' : '❌ FAIL'}`);
        
        if (heartSuccess && diabetesSuccess) {
            console.log('\n🎉 All tests passed! ML prediction flow is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Please check the errors above.');
        }
    } else {
        console.log('\n❌ Backend is not healthy. Please start the backend server first.');
    }
}

// Run tests
runAllTests().catch(console.error); 