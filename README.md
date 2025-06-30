# WellPredict 🩺

## AI-Driven Disease Risk Prediction System

WellPredict is a smart health assessment platform that uses machine learning models to predict disease risk factors and provide personalized health insights.

## ✨ Features

- **🔐 User Authentication** - Secure login/signup system
- **❤️ Heart Disease Risk Assessment** - ML-powered cardiovascular risk prediction
- **🩺 Diabetes Risk Prediction** - Advanced diabetes risk analysis
- **📊 Interactive Results Dashboard** - Beautiful visualizations with detailed analytics
- **💡 Personalized Health Recommendations** - AI-generated health advice
- **📱 Responsive Design** - Works seamlessly across all devices
- **📄 PDF Report Generation** - Downloadable health assessment reports
- **🎯 Wellness Guide** - Personalized nutrition, exercise, and lifestyle recommendations

## 💻 Technologies

**Frontend:** HTML5, CSS3, JavaScript (ES6+), Chart.js  
**Backend:** FastAPI, Python 3.13, Uvicorn  
**Machine Learning:** Scikit-learn, trained models for heart disease and diabetes prediction  
**Storage:** LocalStorage for user sessions

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (Python 3.13 recommended)
- Modern web browser

### Setup & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/AI-Driven-Disease-Risk-Prediction-System.git
   cd AI-Driven-Disease-Risk-Prediction-System
   ```

2. **Start the backend server**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   python main.py
   ```
   Backend runs on `http://localhost:8000`

3. **Start the frontend server**
   ```bash
   cd frontend
   python -m http.server 5500
   ```
   Frontend available at `http://localhost:5500`

4. **Access the application** - Open your browser and navigate to the frontend URL

## 📁 Project Structure

```
├── frontend/                    # Web interface
│   ├── index.html              # Landing page
│   ├── predict.html            # Prediction forms
│   ├── results-perfect.html    # Results dashboard
│   ├── wellness-guide.html     # Personalized wellness recommendations
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript modules
│   └── images/                 # UI assets
├── backend/                     # FastAPI server
│   ├── main.py                 # Application entry point
│   ├── models/                 # ML model wrappers
│   └── schemas/                # Data validation schemas
└── ML_prediction/              # Machine learning assets
    ├── flask-diabetes/         # Diabetes model files
    └── flask-heart/            # Heart disease model files
```

## � API Endpoints

- **Health Check:** `GET /health`
- **Heart Disease Prediction:** `POST /predict/heart`
- **Diabetes Prediction:** `POST /predict/diabetes`

Interactive API documentation available at `http://localhost:8000/docs`

## 🤖 Machine Learning Models

- **Heart Disease Model:** 13 clinical parameters, risk classification (Low/Moderate/High)
- **Diabetes Model:** 8+ health indicators, probability-based risk assessment
- **Data Processing:** StandardScaler for feature normalization
- **Output:** Risk probability (0-1) with confidence scoring

## 🛠️ Development

### Testing
- Use "Load Sample Data" buttons on prediction forms
- Run `python test_system.py` in backend directory
- Check browser console for detailed logging

### Key Files
- `frontend/js/api-client.js` - API communication
- `frontend/js/perfect-results.js` - Results processing
- `backend/models/` - ML model implementations
- `ML_prediction/*/model.pkl` - Trained models (required)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Contact

**Ashi Mariyam Thomas**
- Email: ashnimariyamt@gmail.com
- LinkedIn: [linkedin.com/in/ashithomas](https://www.linkedin.com/in/ashithomas)
- GitHub: [github.com/ashimariyam](https://github.com/ashimariyam)

---

© 2024 WellPredict. Educational and research purposes.
