/**
 * WellPredict - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load Header and Footer
    loadComponent('header', 'components/header.html');
    loadComponent('footer', 'components/footer.html');
    
    // Initialize AOS (Animate on Scroll)
    initAOS();
    
    // Mobile Navigation Toggle
    initMobileNav();

    // Update Service Cards
    updateServiceCards();

    // Initialize Service Selection
    initServiceSelection();

    // Initialize Navigation
    initNavigation();
});

/**
 * Load HTML Component
 * @param {string} elementId - The ID of the element to load the component into
 * @param {string} componentPath - The path to the component HTML file
 */
function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
            // Execute any scripts in the loaded component
            const scripts = element.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                eval(scripts[i].innerText);
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

/**
 * Initialize AOS (Animate on Scroll) Library
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50
        });
    }
}

/**
 * Initialize Mobile Navigation
 */
function initMobileNav() {
    // Create mobile menu toggle button if it doesn't exist
    const header = document.querySelector('header');
    if (!header) return;
    
    let mobileToggle = document.querySelector('.mobile-toggle');
    if (!mobileToggle) {
        mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(mobileToggle);
        
        mobileToggle.addEventListener('click', function() {
            const nav = header.querySelector('nav');
            if (nav) {
                nav.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    }
}

/**
 * Form Validation
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showInputError(input, 'This field is required');
        } else {
            clearInputError(input);
            
            // Email validation
            if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid email address');
            }
            
            // Password validation (if has minlength attribute)
            if (input.type === 'password' && input.hasAttribute('minlength')) {
                const minLength = parseInt(input.getAttribute('minlength'));
                if (input.value.length < minLength) {
                    isValid = false;
                    showInputError(input, `Password must be at least ${minLength} characters`);
                }
            }
        }
    });
    
    return isValid;
}

/**
 * Validate Email Format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Show Input Error
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showInputError(input, message) {
    const formGroup = input.closest('.input-group');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.error-text');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-text';
        formGroup.appendChild(errorElement);
    }
    
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Clear Input Error
 * @param {HTMLElement} input - The input element
 */
function clearInputError(input) {
    const formGroup = input.closest('.input-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-text');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    input.classList.remove('error');
}

/**
 * Show Alert Message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert ('success', 'error', 'warning', 'info')
 * @param {HTMLElement} container - The container to show the alert in
 */
function showAlert(message, type, container) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-alert';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        alertElement.remove();
    });
    
    alertElement.appendChild(closeButton);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertElement.classList.add('fade-out');
        setTimeout(() => alertElement.remove(), 500);
    }, 5000);
    
    container.prepend(alertElement);
}

// Service Navigation
function navigateToService(service) {
    if (service === 'heart' || service === 'diabetes') {
        window.location.href = `predict.html?service=${service}`;
    }
}

// Update Service Cards
function updateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const service = card.dataset.service;
        if (service === 'heart' || service === 'diabetes') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize Service Selection
function initServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-option');
    serviceOptions.forEach(option => {
        option.addEventListener('click', () => {
            const service = option.dataset.service;
            if (service === 'heart' || service === 'diabetes') {
                navigateToService(service);
            }
        });
    });
}

// Initialize Navigation
function initNavigation() {
    // Implementation of initNavigation function
} 