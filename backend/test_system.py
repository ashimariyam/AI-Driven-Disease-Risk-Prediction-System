"""
Test script to verify the AI-Driven Disease Risk Prediction System
This script tests both heart disease and diabetes prediction endpoints
"""

import requests
import json
import sys

# API base URL
API_BASE_URL = "http://localhost:8000"

def test_api_health():
    """Test API health endpoint"""
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        if response.status_code == 200:
            print("✅ API Health Check: PASSED")
            health_data = response.json()
            print(f"   - Heart Model: {health_data.get('models', {}).get('heart_model', 'Unknown')}")
            print(f"   - Diabetes Model: {health_data.get('models', {}).get('diabetes_model', 'Unknown')}")
            return True
        else:
            print(f"❌ API Health Check: FAILED (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ API Health Check: FAILED (Error: {str(e)})")
        return False

def test_heart_prediction():
    """Test heart disease prediction endpoint"""
    try:
        # Sample heart disease data
        heart_data = {
            "age": 45,
            "sex": 1,  # Male
            "cp": 0,   # Typical angina
            "trestbps": 130,  # Blood pressure
            "chol": 200,      # Cholesterol
            "fbs": 0,         # Fasting blood sugar
            "restecg": 0,     # Resting ECG
            "thalach": 150,   # Max heart rate
            "exang": 0,       # Exercise angina
            "oldpeak": 1.0,   # ST depression
            "slope": 1,       # Slope
            "ca": 0,          # Major vessels
            "thal": 2         # Thalassemia
        }
        
        response = requests.post(f"{API_BASE_URL}/predict/heart", json=heart_data)
        
        if response.status_code == 200:
            print("✅ Heart Disease Prediction: PASSED")
            result = response.json()
            print(f"   - Risk Level: {result.get('risk_level', 'Unknown')}")
            print(f"   - Probability: {result.get('probability', 0):.3f}")
            print(f"   - Confidence: {result.get('confidence', 0):.3f}")
            print(f"   - Risk Factors: {len(result.get('risk_factors', []))} identified")
            print(f"   - Recommendations: {len(result.get('recommendations', []))} provided")
            return True
        else:
            print(f"❌ Heart Disease Prediction: FAILED (Status: {response.status_code})")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Heart Disease Prediction: FAILED (Error: {str(e)})")
        return False

def test_diabetes_prediction():
    """Test diabetes risk prediction endpoint"""
    try:
        # Sample diabetes data
        diabetes_data = {
            "pregnancies": 2,
            "glucose": 120,
            "blood_pressure": 80,
            "skin_thickness": 25,
            "insulin": 100,
            "bmi": 24.5,
            "diabetes_pedigree": 0.5,
            "age": 35,
            "family_history": 0,    # No family history
            "physical_activity": 5.0,  # 5 hours per week
            "smoking": 0,           # Non-smoker
            "alcohol": 2            # 2 drinks per week
        }
        
        response = requests.post(f"{API_BASE_URL}/predict/diabetes", json=diabetes_data)
        
        if response.status_code == 200:
            print("✅ Diabetes Risk Prediction: PASSED")
            result = response.json()
            print(f"   - Risk Level: {result.get('risk_level', 'Unknown')}")
            print(f"   - Probability: {result.get('probability', 0):.3f}")
            print(f"   - Confidence: {result.get('confidence', 0):.3f}")
            print(f"   - Risk Factors: {len(result.get('risk_factors', []))} identified")
            print(f"   - Recommendations: {len(result.get('recommendations', []))} provided")
            return True
        else:
            print(f"❌ Diabetes Risk Prediction: FAILED (Status: {response.status_code})")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Diabetes Risk Prediction: FAILED (Error: {str(e)})")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing AI-Driven Disease Risk Prediction System")
    print("=" * 60)
    
    # Test API health
    health_ok = test_api_health()
    print()
    
    if not health_ok:
        print("❌ API is not responding. Please ensure the backend is running.")
        print("   Run: cd backend && python main.py")
        sys.exit(1)
    
    # Test predictions
    heart_ok = test_heart_prediction()
    print()
    
    diabetes_ok = test_diabetes_prediction()
    print()
    
    # Summary
    print("=" * 60)
    print("🏁 Test Summary:")
    print(f"   - API Health: {'✅ PASSED' if health_ok else '❌ FAILED'}")
    print(f"   - Heart Prediction: {'✅ PASSED' if heart_ok else '❌ FAILED'}")
    print(f"   - Diabetes Prediction: {'✅ PASSED' if diabetes_ok else '❌ FAILED'}")
    
    if all([health_ok, heart_ok, diabetes_ok]):
        print("\n🎉 All tests passed! The system is working correctly.")
        print("\n📖 Next steps:")
        print("   1. Open frontend: file:///path/to/frontend/predict.html")
        print("   2. Test heart prediction: ?service=heart")
        print("   3. Test diabetes prediction: ?service=diabetes")
        print("   4. View API docs: http://localhost:8000/docs")
    else:
        print("\n⚠️  Some tests failed. Please check the backend logs and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()
