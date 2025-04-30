# WellPredict 🩺

## AI-Driven Disease Risk Prediction System

WellPredict is a smart health assessment platform that uses simulated AI models to predict disease risk factors and provide personalized health insights.

![WellPredict Logo](screenshots/logo.jpg)
## 📋 Table of Contents
- [Overview](overview)
- [Features](features)
- [Technologies Used](technologies-used)
- [Project Structure](project-structure)
- [Getting Started](getting-started)
- [Screenshots](screenshots)
- [Future Improvements](future-improvements)
- [Contact](contact)

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
WellPredict/
│
├── frontend/
│   ├── css/
│   │   ├── styles.css                 # Global styles
│   │   └── pages/                     # Page-specific styles
│   │       ├── index.css              # Home page styles
│   │       ├── login.css              # Authentication styles
│   │       ├── predict.css            # Prediction interface styles
│   │       ├── profile.css            # User profile styles
│   │       ├── results.css            # Assessment results styles
│   │       └── ...
│   │
│   ├── js/
│   │   ├── script.js                  # Global JavaScript
│   │   ├── login.js                   # Authentication logic
│   │   ├── predict.js                 # Health prediction algorithms
│   │   ├── profile.js                 # User profile management
│   │   └── ...
│   │
│   ├── index.html                     # Home page
│   ├── login.html                     # Login page
│   ├── signup.html                    # Signup page
│   ├── predict.html                   # Health prediction interface
│   ├── results.html                   # Assessment results page
│   ├── profile.html                   # User profile page
│   └── ...
│
└── README.md                          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local development server (VS Code Live Server, XAMPP, etc.)

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

*(Screenshots will be added in future updates)*

### Home Page
![Home Page](assets/screenshots/home.png) *(Placeholder)*

### Prediction Interface
![Prediction Interface](assets/screenshots/predict.png) *(Placeholder)*

### Results Display
![Results Page](assets/screenshots/results.png) *(Placeholder)*

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

- Email: [your-email@example.com]
- LinkedIn: [your-linkedin-profile]
- GitHub: [your-github-profile]

---

© 2023 WellPredict. All rights reserved.
