/**
 * Wellness Guide JavaScript
 * Handles tab switching and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 50
    });

    // Tab switching functionality
    initializeTabs();
    
    // Authentication check
    checkAuthentication();
    
    // Personalized content loading
    loadPersonalizedContent();
});

/**
 * Initialize tab switching functionality
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Scroll to top of content
            window.scrollTo({
                top: document.querySelector('.tabs-section').offsetTop - 20,
                behavior: 'smooth'
            });
            
            // Re-trigger AOS animations for the new content
            setTimeout(() => {
                AOS.refresh();
            }, 300);
        });
    });
}

/**
 * Check if user is authenticated and show personalized content
 */
function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        console.log('✅ User authenticated:', user.email);
        
        // Could add personalized welcome message or recommendations here
        addPersonalizedElements(user);
    } else {
        console.log('⚠️ User not authenticated');
        // Still show the guide but without personalized features
    }
}

/**
 * Add personalized elements for authenticated users
 */
function addPersonalizedElements(user) {
    // Add personalized welcome message only for real registered users
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && user.name && user.name !== 'Demo User') {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'personal-welcome';
        welcomeMessage.innerHTML = `
            <p style="margin-top: 1rem; opacity: 0.9; font-size: 1.1rem;">
                <i class="fas fa-user-circle"></i> Welcome back, ${user.name}!
            </p>
        `;
        heroContent.appendChild(welcomeMessage);
    } else if (heroContent && user.email && !user.email.includes('demo')) {
        // Use email if name is not available and it's not a demo account
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'personal-welcome';
        const displayName = user.email.split('@')[0]; // Use email prefix as name
        welcomeMessage.innerHTML = `
            <p style="margin-top: 1rem; opacity: 0.9; font-size: 1.1rem;">
                <i class="fas fa-user-circle"></i> Welcome back, ${displayName}!
            </p>
        `;
        heroContent.appendChild(welcomeMessage);
    }
}

/**
 * Load personalized content based on user's health assessment results
 */
function loadPersonalizedContent() {
    const heartResult = localStorage.getItem('heartPredictionResult');
    const diabetesResult = localStorage.getItem('diabetesPredictionResult');
    
    if (heartResult || diabetesResult) {
        console.log('📊 Found health assessment results, personalizing content...');
        personalizeRecommendations(heartResult, diabetesResult);
    }
}

/**
 * Personalize recommendations based on health assessment results
 */
function personalizeRecommendations(heartResult, diabetesResult) {
    try {
        let riskFactors = [];
        let recommendations = [];
        
        // Analyze heart disease results
        if (heartResult) {
            const heart = JSON.parse(heartResult);
            if (heart.risk_level === 'High' || heart.prediction === 1) {
                riskFactors.push('cardiovascular');
                recommendations.push({
                    type: 'nutrition',
                    priority: 'high',
                    message: 'Focus on heart-healthy foods: omega-3 rich fish, whole grains, and low-sodium options.'
                });
                recommendations.push({
                    type: 'exercise',
                    priority: 'high',
                    message: 'Prioritize moderate cardio exercises and consult your doctor before intense workouts.'
                });
            }
        }
        
        // Analyze diabetes results
        if (diabetesResult) {
            const diabetes = JSON.parse(diabetesResult);
            if (diabetes.risk_level === 'High' || diabetes.prediction === 1) {
                riskFactors.push('diabetes');
                recommendations.push({
                    type: 'nutrition',
                    priority: 'high',
                    message: 'Focus on low-glycemic foods, portion control, and complex carbohydrates.'
                });
                recommendations.push({
                    type: 'exercise',
                    priority: 'high',
                    message: 'Regular physical activity helps control blood sugar levels. Start with 30 minutes daily.'
                });
            }
        }
        
        // Add personalized recommendations to the page
        if (recommendations.length > 0) {
            addPersonalizedRecommendations(recommendations, riskFactors);
        }
        
    } catch (error) {
        console.error('Error personalizing recommendations:', error);
    }
}

/**
 * Add personalized recommendations to the page
 */
function addPersonalizedRecommendations(recommendations, riskFactors) {
    // Add alert box with personalized recommendations
    const heroSection = document.querySelector('.hero-wellness');
    if (heroSection) {
        const alertBox = document.createElement('div');
        alertBox.className = 'personalized-alert';
        alertBox.innerHTML = `
            <div class="container">
                <div class="alert-content">
                    <div class="alert-icon">
                        <i class="fas fa-heartbeat"></i>
                    </div>
                    <div class="alert-text">
                        <h3>Personalized Recommendations</h3>
                        <p>Based on your recent health assessment, we've highlighted relevant sections below.</p>
                    </div>
                    <button class="alert-close" onclick="this.parentElement.parentElement.parentElement.style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add CSS for the alert
        const alertStyles = `
            <style>
                .personalized-alert {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 1rem 0;
                    margin-top: 2rem;
                    border-radius: 16px;
                    animation: slideDown 0.5s ease-out;
                }
                .alert-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid var(--primary-color);
                }
                .alert-icon {
                    font-size: 2rem;
                    color: var(--primary-color);
                }
                .alert-text h3 {
                    color: var(--dark-text);
                    margin-bottom: 0.5rem;
                    font-size: 1.2rem;
                }
                .alert-text p {
                    color: var(--dark-text);
                    margin: 0;
                    font-weight: 500;
                }
                .alert-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: var(--light-text);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    margin-left: auto;
                }
                .alert-close:hover {
                    background: var(--light-bg);
                    color: var(--dark-text);
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 768px) {
                    .alert-content {
                        flex-direction: column;
                        text-align: center;
                    }
                    .alert-close {
                        margin: 0;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', alertStyles);
        heroSection.appendChild(alertBox);
        
        // Highlight relevant sections
        highlightRelevantSections(riskFactors);
    }
}

/**
 * Highlight sections relevant to user's risk factors
 */
function highlightRelevantSections(riskFactors) {
    // Add highlighting class to relevant cards
    setTimeout(() => {
        if (riskFactors.includes('cardiovascular')) {
            const heartCards = document.querySelectorAll('.card-icon.heart-healthy, .cardio');
            heartCards.forEach(card => {
                const parentCard = card.closest('.overview-card, .day-card');
                if (parentCard) {
                    parentCard.classList.add('highlighted-card');
                }
            });
        }
        
        if (riskFactors.includes('diabetes')) {
            const diabetesCards = document.querySelectorAll('.card-icon.diabetes-friendly');
            diabetesCards.forEach(card => {
                const parentCard = card.closest('.overview-card');
                if (parentCard) {
                    parentCard.classList.add('highlighted-card');
                }
            });
        }
        
        // Add CSS for highlighted cards
        const highlightStyles = `
            <style>
                .highlighted-card {
                    position: relative;
                    border: 2px solid var(--primary-color) !important;
                    animation: pulse 2s infinite;
                }
                .highlighted-card::before {
                    content: '✨ Recommended for you';
                    position: absolute;
                    top: -10px;
                    left: 1rem;
                    background: var(--primary-color);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    z-index: 10;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(142, 68, 173, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(142, 68, 173, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(142, 68, 173, 0); }
                }
            </style>
        `;
        
        if (!document.querySelector('#highlight-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'highlight-styles';
            styleElement.textContent = highlightStyles.replace(/<\/?style>/g, '');
            document.head.appendChild(styleElement);
        }
        
    }, 1000);
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Handle URL hash for direct navigation to tabs
 */
function handleHashNavigation() {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['nutrition', 'exercise', 'lifestyle'];
    
    if (validTabs.includes(hash)) {
        const targetButton = document.querySelector(`[data-tab="${hash}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

// Handle hash navigation on page load and hash change
window.addEventListener('load', handleHashNavigation);
window.addEventListener('hashchange', handleHashNavigation);

/**
 * Add interactive features for meal planning
 */
function initializeMealPlanFeatures() {
    const mealCards = document.querySelectorAll('.meal-plan-card');
    
    mealCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add visual feedback when clicking meal cards
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

/**
 * Add interactive features for exercise plans
 */
function initializeExercisePlanFeatures() {
    const dayCards = document.querySelectorAll('.day-card');
    
    dayCards.forEach(card => {
        // Add completion tracking functionality
        const header = card.querySelector('.day-header');
        if (header) {
            const completeButton = document.createElement('button');
            completeButton.className = 'complete-btn';
            completeButton.innerHTML = '<i class="fas fa-check"></i>';
            completeButton.title = 'Mark as completed';
            
            completeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                card.classList.toggle('completed');
                
                if (card.classList.contains('completed')) {
                    this.innerHTML = '<i class="fas fa-check-circle"></i>';
                    this.title = 'Completed';
                } else {
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.title = 'Mark as completed';
                }
            });
            
            header.appendChild(completeButton);
        }
    });
    
    // Add CSS for completion features
    const exerciseStyles = `
        <style>
            .complete-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 0.5rem;
                border-radius: 50%;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                margin-left: auto;
            }
            .complete-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }
            .day-card.completed {
                opacity: 0.7;
                background: var(--light-bg);
            }
            .day-card.completed .complete-btn {
                background: var(--wellness-green);
                color: white;
            }
        </style>
    `;
    
    if (!document.querySelector('#exercise-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'exercise-styles';
        styleElement.textContent = exerciseStyles.replace(/<\/?style>/g, '');
        document.head.appendChild(styleElement);
    }
}

// Initialize interactive features after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeMealPlanFeatures();
        initializeExercisePlanFeatures();
    }, 500);
});

// Export functions for use in other scripts if needed
window.WellnessGuide = {
    scrollToSection,
    handleHashNavigation
};
