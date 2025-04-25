/**
 * WellPredict - Login/Signup JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Login Form Validation and Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(this)) return;
            
            // Get form data
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            const rememberMe = this.querySelector('input[name="remember"]')?.checked || false;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            // Send login request to backend API
            loginUser(email, password, rememberMe)
                .then(response => {
                    showAlert('Login successful! Redirecting...', 'success', document.querySelector('.auth-form-wrapper'));
                    
                    // Store user data and token in localStorage/sessionStorage
                    if (rememberMe) {
                        localStorage.setItem('authToken', response.token);
                        localStorage.setItem('user', JSON.stringify(response.user));
                    } else {
                        sessionStorage.setItem('authToken', response.token);
                        sessionStorage.setItem('user', JSON.stringify(response.user));
                    }
                    
                    // Redirect to dashboard after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                })
                .catch(error => {
                    console.error('Login error:', error);
                    showAlert(error.message || 'Login failed. Please check your credentials.', 'error', document.querySelector('.auth-form-wrapper'));
                })
                .finally(() => {
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
                    showAlert('Account created successfully! You can now log in.', 'success', document.querySelector('.auth-form-wrapper'));
                    
                    // Clear form
                    this.reset();
                    
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
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
 * Login User API Call
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to remember the user
 * @returns {Promise} - API response promise
 */
function loginUser(email, password, rememberMe) {
    // This is a mock implementation
    // Replace with actual API call in production
    return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
            // Demo validation - in a real app, this would be handled by the backend
            if (email === 'demo@example.com' && password === 'password123') {
                resolve({
                    token: 'sample-jwt-token',
                    user: {
                        id: 1,
                        name: 'Demo User',
                        email: 'demo@example.com'
                    }
                });
            } else {
                reject({ message: 'Invalid email or password' });
            }
        }, 1000);
    });
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