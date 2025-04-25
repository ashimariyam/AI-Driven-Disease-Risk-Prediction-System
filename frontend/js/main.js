/**
 * Main JavaScript file for HealthPredict AI
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize AOS (Animate on Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50
        });
    }
    
    // Add event listeners to buttons with specific classes
    initButtonsEvents();
});

/**
 * Initialize Mobile Navigation
 */
function initMobileNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('active');
            
            // Burger Animation
            burger.classList.toggle('toggle');
            
            // Animate Links
            const navLinks = document.querySelectorAll('.nav-links li');
            navLinks.forEach((link, index) => {
                if (nav.classList.contains('active')) {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    link.style.opacity = '1';
                } else {
                    link.style.animation = '';
                    link.style.opacity = '0';
                }
            });
        });
    }
}

/**
 * Initialize Button Event Listeners
 */
function initButtonsEvents() {
    // Add event listener to all buttons with class "scroll-to"
    const scrollButtons = document.querySelectorAll('.scroll-to');
    scrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const targetElement = document.getElementById(target);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Show Loading Indicator
 * @param {HTMLElement} container - The container to add the loading indicator to
 */
function showLoading(container) {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-indicator';
    loadingEl.innerHTML = '<div class="loading-spinner"></div>';
    
    container.innerHTML = '';
    container.appendChild(loadingEl);
}

/**
 * Hide Loading Indicator
 * @param {HTMLElement} container - The container containing the loading indicator
 */
function hideLoading(container) {
    const loadingEl = container.querySelector('.loading-indicator');
    if (loadingEl) {
        loadingEl.remove();
    }
}

/**
 * Show Alert Message
 * @param {string} message - The message to display
 * @param {string} type - Message type: 'success', 'error', 'warning', 'info'
 * @param {HTMLElement} container - The container to show the alert in
 * @param {number} [timeout=5000] - Time in ms before the alert disappears
 */
function showAlert(message, type, container, timeout = 5000) {
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type}`;
    alertEl.innerHTML = `
        <span class="message">${message}</span>
        <button class="close-alert">&times;</button>
    `;
    
    // Add close button functionality
    const closeBtn = alertEl.querySelector('.close-alert');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alertEl.classList.add('fade-out');
            setTimeout(() => alertEl.remove(), 300);
        });
    }
    
    // Add to container
    container.prepend(alertEl);
    
    // Auto remove after timeout
    if (timeout) {
        setTimeout(() => {
            if (alertEl.parentNode) {
                alertEl.classList.add('fade-out');
                setTimeout(() => alertEl.remove(), 300);
            }
        }, timeout);
    }
}

/**
 * Format date to a readable string
 * @param {Date|string} date - Date object or date string
 * @param {boolean} [includeTime=false] - Whether to include time in the formatted string
 * @returns {string} Formatted date string
 */
function formatDate(date, includeTime = false) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', options);
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether the email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validate Form Fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Whether the form is valid
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Remove any existing error messages
    const existingErrors = form.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Check each required field
    requiredFields.forEach(field => {
        field.classList.remove('error');
        
        // Check if empty
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
            return;
        }
        
        // Email validation
        if (field.type === 'email' && !validateEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
            return;
        }
        
        // Number range validation
        if (field.type === 'number') {
            const min = parseFloat(field.getAttribute('min'));
            const max = parseFloat(field.getAttribute('max'));
            const value = parseFloat(field.value);
            
            if (!isNaN(min) && value < min) {
                showFieldError(field, `Minimum value is ${min}`);
                isValid = false;
                return;
            }
            
            if (!isNaN(max) && value > max) {
                showFieldError(field, `Maximum value is ${max}`);
                isValid = false;
                return;
            }
        }
    });
    
    return isValid;
}

/**
 * Show field error message
 * @param {HTMLElement} field - The field with error
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    const parent = field.parentNode;
    parent.appendChild(errorMessage);
} 