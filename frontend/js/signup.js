/**
 * WellPredict - Signup JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Signup Form Validation and Submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            const confirmPassword = this.querySelector('input[name="confirm-password"]').value;
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showErrorMessage('Passwords do not match');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';
            
            // Register user in localStorage
            registerUser(name, email, password)
                .then(success => {
                    // Show success message
                    showSuccessMessage('Account created successfully! Redirecting to login page...');
                    
                    // Clear form
                    this.reset();
                    
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                })
                .catch(error => {
                    // Show error message
                    showErrorMessage(error);
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }
});

/**
 * Register user in localStorage
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Registration promise
 */
function registerUser(name, email, password) {
    return new Promise((resolve, reject) => {
        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            reject('Email already in use. Please use a different email address.');
            return;
        }
        
        // Generate salt for password hashing
        const salt = generateSalt();
        
        // Hash password with salt
        const hashedPassword = simpleHash(password + salt);
        
        // Create new user object
        const newUser = {
            name,
            email,
            hashedPassword,
            salt,
            createdAt: new Date().toISOString()
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        resolve(true);
    });
}

/**
 * Generate a random salt for password hashing
 * @returns {string} - Random salt string
 */
function generateSalt() {
    // In a real app, use a proper crypto library
    // This is just a simple simulation
    return Math.random().toString(36).substring(2, 15);
}

/**
 * Simple string hashing function (simulation only)
 * @param {string} str - String to hash
 * @returns {string} - Hashed string
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    const successEl = document.getElementById('signup-success');
    const errorEl = document.getElementById('signup-error');
    
    if (successEl) {
        successEl.textContent = message;
        successEl.style.display = 'block';
    }
    
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const errorEl = document.getElementById('signup-error');
    const successEl = document.getElementById('signup-success');
    
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    
    if (successEl) {
        successEl.style.display = 'none';
    }
} 