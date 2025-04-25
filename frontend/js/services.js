/**
 * WellPredict - Services JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize service cards hover effect
    initServiceCards();
    
    // Initialize AI prediction features
    initAIPredictionFeatures();
    
    // Handle service selection for prediction
    handleServiceSelection();
});

/**
 * Initialize Service Cards Hover Effect
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle animation on hover
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset on mouse leave
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // Add click handler to cards
        card.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            if (serviceId) {
                // Save selected service to sessionStorage
                sessionStorage.setItem('selectedService', serviceId);
                
                // Navigate to prediction page
                window.location.href = 'predict.html';
            }
        });
    });
}

/**
 * Initialize AI Prediction Features
 */
function initAIPredictionFeatures() {
    // This function would handle any dynamic content related to AI features
    // For demo purposes, we'll add some animations to feature items
    
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach((item, index) => {
        // Add delayed animation to each feature item
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Staggered animation delay
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}

/**
 * Handle Service Selection
 */
function handleServiceSelection() {
    // Check if there's a service hash in the URL (e.g., #heart)
    const serviceHash = window.location.hash.substring(1);
    if (serviceHash) {
        scrollToService(serviceHash);
    }
    
    // Add event listeners to service links
    const serviceLinks = document.querySelectorAll('a[href^="services.html#"]');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If on the services page already, prevent default and scroll to section
            if (window.location.pathname.includes('services.html')) {
                e.preventDefault();
                const serviceId = this.getAttribute('href').split('#')[1];
                scrollToService(serviceId);
            }
        });
    });
}

/**
 * Scroll to a specific service section
 * @param {string} serviceId - The ID of the service section to scroll to
 */
function scrollToService(serviceId) {
    const serviceElement = document.getElementById(serviceId);
    if (serviceElement) {
        // Scroll to the service element with smooth behavior
        serviceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Highlight the service card
        highlightServiceCard(serviceId);
    }
}

/**
 * Highlight a service card
 * @param {string} serviceId - The ID of the service to highlight
 */
function highlightServiceCard(serviceId) {
    // Reset all service cards
    const allCards = document.querySelectorAll('.service-card');
    allCards.forEach(card => {
        card.classList.remove('highlight');
    });
    
    // Highlight the selected card
    const selectedCard = document.querySelector(`.service-card[data-service="${serviceId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('highlight');
        
        // Remove highlight after a few seconds
        setTimeout(() => {
            selectedCard.classList.remove('highlight');
        }, 3000);
    }
}

/**
 * Format Prediction Data
 * This is a helper function that would be used when connecting to the AI prediction backend
 * @param {Object} data - The prediction data from the AI model
 * @returns {Object} - Formatted prediction data for display
 */
function formatPredictionData(data) {
    // This would process raw AI prediction data into a format suitable for display
    // For example, converting probability values to percentages, adding interpretations, etc.
    
    // Sample implementation (modify based on actual data structure)
    const formatted = {
        riskScore: Math.round(data.probability * 100),
        riskLevel: data.probability > 0.7 ? 'High' : (data.probability > 0.3 ? 'Medium' : 'Low'),
        factors: data.factors.map(factor => ({
            name: factor.name,
            contribution: Math.round(factor.weight * 100) / 100,
            description: factor.description
        }))
    };
    
    return formatted;
} 