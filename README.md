# WellPredict 🩺

## AI-Driven Disease Risk Prediction System

WellPredict is a smart health assessment platform that uses simulated AI models to predict disease risk factors and provide personalized health insights.

![WellPredict Logo](screenshots/logo.png)

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contact](#-contact)

## 🔍 Overview

WellPredict offers a user-friendly interface for health risk assessment through multiple prediction models. The system uses simulated AI algorithms to analyze user-provided health data and generate personalized risk assessments and recommendations.

## ✨ Features

- **User Authentication System** - Secure login/signup with localStorage persistence
- **Heart Health Assessment** - Cardiovascular risk prediction based on clinical factors
- **Diabetes Risk Prediction** - Type 2 diabetes risk analysis using key health indicators
- **Lung Cancer Risk Evaluation** - Risk assessment based on smoking history and other factors
- **Symptom Checker** - Preliminary health condition suggestions based on symptom patterns
- **Overall Health Score** - Holistic health evaluation with personalized improvement recommendations
- **Assessment History** - Track health assessments over time in user profiles
- **Responsive Design** - Seamless experience across desktop and mobile devices

## 💻 Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (with flexbox and grid layouts)
  - JavaScript (ES6+)
  - Font Awesome (for icons)
  - Google Fonts

- **Data Management**:
  - LocalStorage (for user data persistence)
  - SessionStorage (for temporary user sessions)

- **Health Assessment Logic**:
  - Custom JavaScript algorithms (simulating AI processing)
  - Risk calculation formulas based on medical guidelines

## 📁 Project Structure

```
.
├── frontend/               # Frontend application
├── backend/               # Node.js backend server
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── flask-heart/          # Heart disease prediction service
│   ├── app.py           # Flask application
│   ├── model.pkl        # Trained ML model
│   └── requirements.txt # Python dependencies
├── flask-diabetes/       # Diabetes prediction service
│   ├── app.py           # Flask application
│   ├── model.pkl        # Trained ML model
│   └── requirements.txt # Python dependencies
└── server.js            # Main Node.js server
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local development server (VS Code Live Server, XAMPP, etc.)
- Node.js (v14 or higher)
- Python 3.8 or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository or download the ZIP file
   ```
   git clone https://github.com/your-username/WellPredict.git
   ```

2. Navigate to the project directory
   ```
   cd WellPredict
   ```

3. Open the project with your preferred code editor (e.g., VS Code)

4. Launch with a local development server
   - If using VS Code with Live Server extension:
     - Right-click on `frontend/index.html`
     - Select "Open with Live Server"
   - If using XAMPP/WAMP:
     - Move the project to your htdocs/www folder
     - Access via localhost in your browser

5. Create an account and start exploring the health prediction features

## 📸 Screenshots


### Home Page
![Home Page](screenshots/HomePage1.png)
![Home Page](screenshots/HomePage2.png)
![Home Page](screenshots/HomePage3.png)

### Prediction Interface
![Prediction Interface](screenshots/PredictionInerface1.png) 
![Prediction Interface](screenshots/PredictionInterface2.png) 
![Prediction Interface](screenshots/PredictionInterface3.png) 

### Results Display
![Results Page](screenshots/Results1.png) 
![Results Page](screenshots/Results2.png) 
![Results Page](screenshots/Results3.png) 
![Results Page](screenshots/Results4.png) 

### Login Page
![Login Page](screenshots/LoginPage.png)

## 🔮 Future Improvements

- **Backend Integration**:
  - Develop a secure server for user data storage
  - Implement API endpoints for health assessment processing

- **Enhanced AI Models**:
  - Integrate actual machine learning models for more accurate predictions
  - Add natural language processing for symptom descriptions

- **Additional Features**:
  - Medication reminder system
  - Health data visualization dashboards
  - Integration with wearable device data
  - Telemedicine appointment scheduling

- **Mobile App Development**:
  - Native mobile applications for iOS and Android platforms

## 📞 Contact

Created by **Ashi Mariyam Thomas**

- Email: [ashnimariyamt@gmail.com]
- LinkedIn: [www.linkedin.com/in/ashithomas]
- GitHub: [https://github.com/ashimariyam]

---

© 2023 WellPredict. All rights reserved.

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Node.js Server Configuration
NODE_PORT=3000
NODE_ENV=development

# Flask Services Configuration
FLASK_HEART_PORT=5001
FLASK_DIABETES_PORT=5002

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=health_predictions
DB_PORT=3306

# CORS Configuration
FRONTEND_URL=http://localhost:5500

# JWT Secret (for future authentication)
JWT_SECRET=your_jwt_secret_key
```

## Installation

### 1. Backend Setup (Node.js)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

### 2. Flask Services Setup

#### Heart Disease Prediction Service

```bash
# Navigate to flask-heart directory
cd flask-heart

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

#### Diabetes Prediction Service

```bash
# Navigate to flask-diabetes directory
cd flask-diabetes

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

### 3. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE health_predictions;
```

2. The database tables will be automatically created when the Node.js server starts.

## API Endpoints

### Heart Disease Prediction
- **POST** `/api/predict/heart`
  - Input: Heart disease risk factors
  - Output: Risk prediction and confidence score

### Diabetes Prediction
- **POST** `/api/predict/diabetes`
  - Input: Diabetes risk factors
  - Output: Risk prediction and confidence score

### Prediction History
- **GET** `/api/predict/history`
  - Output: List of recent predictions

## Model Information

### Heart Disease Prediction Model
- Features: 13 clinical parameters
- Output: Risk probability (0-1)
- Risk Levels: Low (<0.3), Moderate (0.3-0.6), High (>0.6)

### Diabetes Prediction Model
- Features: 12 clinical and lifestyle parameters
- Output: Risk probability (0-1)
- Risk Levels: Low (<0.3), Moderate (0.3-0.6), High (>0.6)

## Development

### Running in Development Mode

1. Start the Node.js backend:
```bash
cd backend
npm run dev
```

2. Start the Flask services:
```bash
# Terminal 1
cd flask-heart
python app.py

# Terminal 2
cd flask-diabetes
python app.py
```

3. Start the frontend development server:
```bash
cd frontend
# Use your preferred static file server
```

### Logging

- Node.js logs: `backend/logs/`
- Heart prediction logs: `flask-heart/logs/`
- Diabetes prediction logs: `flask-diabetes/logs/`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use PM2 or similar for Node.js process management
3. Use Gunicorn for Flask services
4. Set up proper SSL/TLS certificates
5. Configure proper firewall rules
6. Set up database backups

## Security Considerations

1. All API endpoints are CORS-protected
2. Input validation on both frontend and backend
3. Rate limiting (to be implemented)
4. JWT authentication (to be implemented)
5. Secure password storage (for future user system)
6. Regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
