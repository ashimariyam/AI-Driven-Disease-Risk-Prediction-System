/**
 * WellPredict - Profile JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isLoggedIn) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Display user information
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    
    if (userNameEl) {
        userNameEl.textContent = currentUser.name;
    }
    
    if (userEmailEl) {
        userEmailEl.textContent = currentUser.email;
    }
    
    // Add a sample assessment if none exist (for demo purposes)
    addSampleAssessmentIfNeeded(currentUser.email);
    
    // Load and display assessment history
    loadAssessmentHistory(currentUser.email);
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data from storage
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Handle smooth scrolling for internal links
    document.querySelectorAll('a.scroll-to').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

/**
 * Load and display user's assessment history
 * @param {string} userEmail - Email of the current user
 */
function loadAssessmentHistory(userEmail) {
    // Get assessment history container
    const historyContainer = document.getElementById('assessment-history');
    if (!historyContainer) return;
    
    // Get user assessments from localStorage (or create empty array if none exist)
    const allAssessments = JSON.parse(localStorage.getItem('userAssessments')) || {};
    const userAssessments = allAssessments[userEmail] || [];
    
    // If no assessments, show empty state
    if (userAssessments.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No assessments yet</h3>
                <p>You haven't completed any health assessments yet.</p>
                <a href="predict.html" class="btn">Take Your First Assessment</a>
            </div>
        `;
        return;
    }
    
    // Sort assessments by date (newest first)
    userAssessments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create HTML for assessment history
    let historyHTML = '<div class="assessment-list">';
    
    userAssessments.forEach((assessment, index) => {
        const assessmentDate = new Date(assessment.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const riskLevel = assessment.riskLevel || 'Medium';
        const riskClass = getRiskLevelClass(riskLevel);
        
        historyHTML += `
            <div class="assessment-item" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="assessment-item-header">
                    <div class="assessment-date">
                        <i class="far fa-calendar-alt"></i>
                        ${assessmentDate}
                    </div>
                    <div class="assessment-type">
                        ${assessment.type || 'General Health Assessment'}
                    </div>
                </div>
                
                <div class="assessment-item-body">
                    <div class="assessment-risk">
                        <span class="risk-label">Risk Level:</span>
                        <span class="risk-badge ${riskClass}">${riskLevel}</span>
                    </div>
                    
                    <p class="assessment-summary">
                        ${assessment.summary || 'Assessment completed successfully.'}
                    </p>
                </div>
                
                <div class="assessment-item-footer">
                    <button class="btn btn-sm view-details" data-id="${index}">View Details</button>
                </div>
            </div>
        `;
    });
    
    historyHTML += '</div>';
    historyContainer.innerHTML = historyHTML;
    
    // Add event listeners to "View Details" buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const assessmentIndex = parseInt(this.getAttribute('data-id'));
            const assessment = userAssessments[assessmentIndex];
            
            // Show assessment details (you can create a modal or redirect to details page)
            showAssessmentDetails(assessment);
        });
    });
}

/**
 * Get CSS class based on risk level
 * @param {string} riskLevel - Risk level (Low, Medium, High)
 * @returns {string} - CSS class name
 */
function getRiskLevelClass(riskLevel) {
    switch(riskLevel.toLowerCase()) {
        case 'low':
            return 'risk-low';
        case 'medium':
            return 'risk-medium';
        case 'high':
            return 'risk-high';
        default:
            return 'risk-medium';
    }
}

/**
 * Show assessment details in a modal
 * @param {Object} assessment - Assessment data
 */
function showAssessmentDetails(assessment) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="assessment-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Assessment Details</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <h3>${assessment.type || 'General Health Assessment'}</h3>
                    <p class="modal-date">
                        <i class="far fa-calendar-alt"></i>
                        ${new Date(assessment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                    
                    <div class="assessment-risk modal-risk">
                        <span class="risk-label">Risk Level:</span>
                        <span class="risk-badge ${getRiskLevelClass(assessment.riskLevel || 'Medium')}">
                            ${assessment.riskLevel || 'Medium'}
                        </span>
                    </div>
                    
                    <div class="assessment-summary">
                        <h4>Summary</h4>
                        <p>${assessment.summary || 'No summary available.'}</p>
                    </div>
                    
                    <div class="assessment-details">
                        <h4>Details</h4>
                        <ul>
                            ${assessment.details ? 
                                assessment.details.map(detail => `<li>${detail}</li>`).join('') : 
                                '<li>No detailed information available.</li>'
                            }
                        </ul>
                    </div>
                    
                    <div class="assessment-recommendations">
                        <h4>Recommendations</h4>
                        <ul>
                            ${assessment.recommendations ? 
                                assessment.recommendations.map(rec => `<li>${rec}</li>`).join('') : 
                                '<li>No recommendations available.</li>'
                            }
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary modal-close-btn">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Add event listeners for closing modal
    const modal = document.getElementById('assessment-modal');
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modalContainer);
        }
    });
}

/**
 * Add a sample assessment if user has no assessments (for demo purposes)
 * @param {string} userEmail - Email of the current user
 */
function addSampleAssessmentIfNeeded(userEmail) {
    const allAssessments = JSON.parse(localStorage.getItem('userAssessments')) || {};
    const userAssessments = allAssessments[userEmail] || [];
    
    // Only add sample assessment if user has no assessments
    if (userAssessments.length === 0) {
        // Create sample assessment data
        const sampleAssessment = {
            date: new Date().toISOString(),
            type: 'Cardiovascular Health Assessment',
            riskLevel: 'Medium',
            summary: 'Based on your input, you have a medium risk of cardiovascular disease. Some lifestyle modifications could reduce your risk significantly.',
            details: [
                'Blood pressure: 130/85 mmHg (Slightly elevated)',
                'Cholesterol levels: Total: 210 mg/dL (Borderline high)',
                'Physical activity: 2-3 times per week (Moderate)',
                'Diet: Moderate intake of fruits and vegetables'
            ],
            recommendations: [
                'Increase physical activity to at least 150 minutes per week',
                'Reduce sodium intake to less than 1,500 mg per day',
                'Increase consumption of fruits, vegetables, and whole grains',
                'Schedule a follow-up with your healthcare provider in 3 months'
            ]
        };
        
        // Add sample assessment to user's assessments
        allAssessments[userEmail] = [sampleAssessment];
        
        // Save to localStorage
        localStorage.setItem('userAssessments', JSON.stringify(allAssessments));
    }
} 