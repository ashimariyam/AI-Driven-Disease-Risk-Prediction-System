# Project Cleanup Plan

## Current Status
Based on the conversation summary and analysis, the AI-Driven Disease Risk Prediction System has been successfully debugged and is now working. Here's what needs to be cleaned up:

## ✅ KEEP (Essential Files)

### Backend (FastAPI Application)
- `backend/` - **KEEP ENTIRE FOLDER** - Main FastAPI application
  - `main.py` - Main FastAPI server
  - `models/` - Model classes that load from ML_prediction
  - `schemas/` - Pydantic schemas
  - `requirements.txt` - Backend dependencies
  - `start.bat` & `start.sh` - Start scripts
  - `logs/` - Application logs

### Frontend (Web Interface)
- `frontend/` - **KEEP ENTIRE FOLDER** - Working web interface
  - All HTML files (cleaned up results.html)
  - `css/` - Styling
  - `js/` - JavaScript (with debugging improvements)
  - `images/` - UI assets

### ML Models (Required for Backend)
- `ML_prediction/flask-diabetes/model.pkl` - **KEEP** - Trained diabetes model
- `ML_prediction/flask-diabetes/scaler.pkl` - **KEEP** - Diabetes data scaler
- `ML_prediction/flask-heart/model.pkl` - **KEEP** - Trained heart disease model
- `ML_prediction/flask-heart/scaler.pkl` - **KEEP** - Heart disease data scaler

### Documentation & Project Files
- `README.md` - **KEEP** - Project documentation
- `LICENSE` - **KEEP** - License file
- `screenshots/` - **KEEP** - Documentation images
- `BACKEND_SETUP.md` - **KEEP** - Setup instructions

## 🗑️ REMOVE/ARCHIVE (Redundant Files)

### Old Flask Applications (Replaced by FastAPI)
- `ML_prediction/flask-diabetes/app.py` - ❌ Old Flask diabetes app
- `ML_prediction/flask-diabetes/diabetes_model.py` - ❌ Duplicate model logic
- `ML_prediction/flask-diabetes/predict_diabetes.py` - ❌ Old prediction script
- `ML_prediction/flask-diabetes/requirements.txt` - ❌ Flask-specific deps
- `ML_prediction/flask-diabetes/train_diabetes_model.py` - ❌ Training script
- `ML_prediction/flask-diabetes/logs/` - ❌ Old Flask logs
- `ML_prediction/flask-diabetes/Figure_1.png` - ❌ Training visualization

- `ML_prediction/flask-heart/app.py` - ❌ Old Flask heart app
- `ML_prediction/flask-heart/heart_model.py` - ❌ Duplicate model logic
- `ML_prediction/flask-heart/predict_heart.py` - ❌ Old prediction script
- `ML_prediction/flask-heart/requirements.txt` - ❌ Flask-specific deps
- `ML_prediction/flask-heart/train_heart_model.py` - ❌ Training script
- `ML_prediction/flask-heart/logs/` - ❌ Old Flask logs
- `ML_prediction/flask-heart/Figure_1.png` - ❌ Training visualization

### Root Level Redundant Files
- `server.js` - ❌ Old Node.js server (replaced by Python HTTP server)
- `requirements.txt` - ❌ Duplicate (backend has its own)
- `test-prediction-flow.js` - ❌ Old test file

### Data Files (Optional - Keep for Retraining)
- `ML_prediction/enhanced_diabetes_dataset.xlsx` - 🔄 Optional (for model retraining)
- `ML_prediction/heart.xlsx` - 🔄 Optional (for model retraining)

## 📁 Recommended Final Structure

```
AI-Driven-Disease-Risk-Prediction-System/
├── backend/                    # FastAPI application
├── frontend/                   # Web interface
├── models/                     # ONLY the .pkl and .pkl files
│   ├── diabetes_model.pkl
│   ├── diabetes_scaler.pkl
│   ├── heart_model.pkl
│   └── heart_scaler.pkl
├── data/                       # Optional: training data
│   ├── enhanced_diabetes_dataset.xlsx
│   └── heart.xlsx
├── screenshots/                # Documentation
├── README.md
├── LICENSE
├── BACKEND_SETUP.md
└── cleanup-project.ps1         # This cleanup script
```

## 🔧 Cleanup Actions

1. **Archive old Flask apps** (move to `archive/` folder)
2. **Move model files** to a clean `models/` directory
3. **Remove redundant files** listed above
4. **Update documentation** if paths change
5. **Test the system** after cleanup

## ⚠️ Before Running Cleanup

1. Ensure the system is working correctly
2. Create a backup of the current project
3. Test that backend loads models from current paths
4. Update model loading paths in backend if needed

This cleanup will reduce the project size significantly while keeping all functional components.
