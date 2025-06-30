/**
 * WellPredict - Login/Signup JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Login Form Validation and Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🚀 Login form submitted');
            
            // Get form data
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            const rememberMe = this.querySelector('input[name="remember"]')?.checked || false;
            
            console.log('📝 Login data:', { email, password: '***', rememberMe });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            // Authenticate user using localStorage
            authenticateUser(email, password, rememberMe)
                .then(user => {
                    console.log('✅ Login successful:', user);
                    // Show success message
                    showSuccessMessage('Login successful! Redirecting...');
                    
                    // Check if there's a return URL or redirect to profile
                    const returnUrl = localStorage.getItem('returnUrl') || 'profile.html';
                    localStorage.removeItem('returnUrl'); // Clean up
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = returnUrl;
                    }, 1500);
                })
                .catch(error => {
                    console.log('❌ Login failed:', error);
                    // Show error message
                    showErrorMessage(error);
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }
    
    // Signup Form Validation and Submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(this)) return;
            
            // Check if passwords match
            const password = this.querySelector('input[name="password"]').value;
            const confirmPassword = this.querySelector('input[name="confirm-password"]').value;
            
            if (password !== confirmPassword) {
                showInputError(this.querySelector('input[name="confirm-password"]'), 'Passwords do not match');
                return;
            }
            
            // Get form data
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';
            
            // Send signup request to backend API
            registerUser(name, email, password)
                .then(response => {
                    showAlert('Account created successfully! Redirecting to your dashboard...', 'success', document.querySelector('.auth-form-wrapper'));
                    
                    // Auto-login the user after successful signup
                    const currentUser = {
                        name: name,
                        email: email,
                        isLoggedIn: true
                    };
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Clear form
                    this.reset();
                    
                    // Check if there's a return URL or redirect to profile
                    const returnUrl = localStorage.getItem('returnUrl') || 'profile.html';
                    localStorage.removeItem('returnUrl'); // Clean up
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = returnUrl;
                    }, 2000);
                })
                .catch(error => {
                    console.error('Signup error:', error);
                    showAlert(error.message || 'Registration failed. Please try again.', 'error', document.querySelector('.auth-form-wrapper'));
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }
});

/**
 * Authenticate user using localStorage
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to remember the user
 * @returns {Promise} - Authentication promise
 */
function authenticateUser(email, password, rememberMe) {
    return new Promise((resolve, reject) => {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching email
        const user = users.find(u => u.email === email);
        
        if (!user) {
            reject('Invalid email or password');
            return;
        }
        
        // Verify password (in a real app, you would use a proper hashing library)
        if (!verifyPassword(password, user.hashedPassword, user.salt)) {
            reject('Invalid email or password');
            return;
        }
        
        // Store current user in sessionStorage or localStorage based on remember me
        const currentUser = {
            name: user.name,
            email: user.email,
            isLoggedIn: true
        };
        
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        resolve(currentUser);
    });
}

/**
 * Verify password using simple hashing simulation
 * @param {string} password - Plain text password input
 * @param {string} hashedPassword - Stored hashed password
 * @param {string} salt - Salt used for hashing
 * @returns {boolean} - Whether password is valid
 */
function verifyPassword(password, hashedPassword, salt) {
    // In a real app, use a proper crypto library
    // This is just a simple simulation
    const hash = simpleHash(password + salt);
    return hash === hashedPassword;
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
    const successEl = document.getElementById('login-success');
    const errorEl = document.getElementById('login-error');
    
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
    const errorEl = document.getElementById('login-error');
    const successEl = document.getElementById('login-success');
    
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    
    if (successEl) {
        successEl.style.display = 'none';
    }
}

/**
 * Register User API Call
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response promise
 */
function registerUser(name, email, password) {
    // This is a mock implementation
    // Replace with actual API call in production
    return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
            // Demo validation - in a real app, this would connect to a backend
            if (email === 'demo@example.com') {
                reject({ message: 'Email already in use' });
            } else {
                resolve({
                    success: true,
                    message: 'User registered successfully'
                });
            }
        }, 1000);
    });
} 