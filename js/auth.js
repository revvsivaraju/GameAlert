// AWS Cognito Authentication System
const Auth = {
    userPool: null,
    
    // Initialize authentication
    init() {
        // Check if config is valid
        if (!validateConfig()) {
            console.error('AWS Cognito configuration is missing. Please update js/config.js');
            this.showMessage('AWS Cognito not configured. Please check configuration.', 'error');
            return;
        }
        
        // Initialize Cognito User Pool
        try {
            this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
                UserPoolId: AWS_CONFIG.userPoolId,
                ClientId: AWS_CONFIG.clientId
            });
        } catch (error) {
            console.error('Error initializing Cognito:', error);
            this.showMessage('Failed to initialize authentication. Please check configuration.', 'error');
            return;
        }
        
        this.setupEventListeners();
        this.checkSession();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Signup form submission
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        // Forgot password form
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }
        
        // Reset password form
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        if (resetPasswordForm) {
            resetPasswordForm.addEventListener('submit', (e) => this.handleResetPassword(e));
        }
        
        // Email verification form
        const verifyEmailForm = document.getElementById('verifyEmailForm');
        if (verifyEmailForm) {
            verifyEmailForm.addEventListener('submit', (e) => this.handleVerifyEmail(e));
        }
        
        // Toggle between login and signup
        const toggleLink = document.getElementById('toggleLink');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms();
            });
        }
        
        // Forgot password link
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordForm();
            });
        }
        
        // Back to login buttons
        const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');
        if (backToLoginFromForgot) {
            backToLoginFromForgot.addEventListener('click', () => this.showLoginForm());
        }
        
        const backToLoginFromReset = document.getElementById('backToLoginFromReset');
        if (backToLoginFromReset) {
            backToLoginFromReset.addEventListener('click', () => this.showLoginForm());
        }
        
        // Resend code button
        const resendCode = document.getElementById('resendCode');
        if (resendCode) {
            resendCode.addEventListener('click', () => this.resendVerificationCode());
        }
    },
    
    // Toggle between login and signup forms
    toggleForms() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const loginTitle = document.getElementById('loginTitle');
        const loginSubtitle = document.getElementById('loginSubtitle');
        const toggleText = document.getElementById('toggleText');
        
        const isLogin = loginForm && loginForm.classList.contains('active');
        
        if (isLogin) {
            // Switch to signup
            this.hideAllForms();
            if (signupForm) signupForm.classList.add('active');
            if (loginTitle) loginTitle.textContent = 'Create Account';
            if (loginSubtitle) loginSubtitle.textContent = 'Join us to save your preferences';
            if (toggleText) toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleLink">Sign In</a>';
        } else {
            // Switch to login
            this.hideAllForms();
            if (loginForm) loginForm.classList.add('active');
            if (loginTitle) loginTitle.textContent = 'Welcome Back';
            if (loginSubtitle) loginSubtitle.textContent = 'Sign in to save your preferences';
            if (toggleText) toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleLink">Sign Up</a>';
        }
        
        // Re-attach event listener to new toggle link
        const newToggleLink = document.getElementById('toggleLink');
        if (newToggleLink) {
            newToggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms();
            });
        }
        
        // Clear form errors
        this.clearErrors();
    },
    
    // Hide all forms
    hideAllForms() {
        const forms = ['loginForm', 'signupForm', 'forgotPasswordForm', 'resetPasswordForm', 'verifyEmailForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) form.classList.remove('active');
        });
    },
    
    // Show login form
    showLoginForm() {
        this.hideAllForms();
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.classList.add('active');
        this.clearErrors();
    },
    
    // Show forgot password form
    showForgotPasswordForm() {
        this.hideAllForms();
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) forgotPasswordForm.classList.add('active');
        this.clearErrors();
    },
    
    // Handle signup
    async handleSignup(e) {
        e.preventDefault();
        this.clearErrors();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (name.length < 2) {
            this.showError('signupNameError', 'Name must be at least 2 characters');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('signupEmailError', 'Please enter a valid email address');
            return;
        }
        
        if (password.length < 8) {
            this.showError('signupPasswordError', 'Password must be at least 8 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            return;
        }
        
        // Create user attributes
        // Split name into given_name and family_name for Cognito schema
        const nameParts = name.trim().split(/\s+/);
        const givenName = nameParts[0] || name;
        const familyName = nameParts.slice(1).join(' ') || givenName; // Use givenName as fallback if no last name
        
        const attributeList = [
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'email',
                Value: email
            }),
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'given_name',
                Value: givenName
            }),
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'family_name',
                Value: familyName
            })
        ];
        
        // Use email as username (User Pool configured with Email as sign-in identifier)
        // If your pool uses email alias, you would use a unique username instead
        this.userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                this.handleCognitoError(err);
                return;
            }
            
            // Store email for verification
            sessionStorage.setItem('pendingVerificationEmail', email);
            
            // Show verification form
            this.hideAllForms();
            const verifyEmailForm = document.getElementById('verifyEmailForm');
            if (verifyEmailForm) verifyEmailForm.classList.add('active');
            
            this.showMessage('Account created! Please check your email for verification code.', 'success');
        });
    },
    
    // Handle email verification
    async handleVerifyEmail(e) {
        e.preventDefault();
        this.clearErrors();
        
        const code = document.getElementById('verificationCode').value.trim();
        const email = sessionStorage.getItem('pendingVerificationEmail');
        
        if (!code) {
            this.showError('verificationCodeError', 'Please enter verification code');
            return;
        }
        
        if (!email) {
            this.showMessage('Session expired. Please sign up again.', 'error');
            this.showLoginForm();
            return;
        }
        
        // Create cognito user
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
        
        // Confirm registration
        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                this.handleCognitoError(err);
                return;
            }
            
            sessionStorage.removeItem('pendingVerificationEmail');
            this.showMessage('Email verified! You can now sign in.', 'success');
            
            // Switch to login form
            setTimeout(() => {
                this.showLoginForm();
                const loginTitle = document.getElementById('loginTitle');
                const loginSubtitle = document.getElementById('loginSubtitle');
                if (loginTitle) loginTitle.textContent = 'Welcome Back';
                if (loginSubtitle) loginSubtitle.textContent = 'Sign in to save your preferences';
            }, 1500);
        });
    },
    
    // Resend verification code
    resendVerificationCode() {
        const email = sessionStorage.getItem('pendingVerificationEmail');
        if (!email) {
            this.showMessage('Session expired. Please sign up again.', 'error');
            this.showLoginForm();
            return;
        }
        
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
        
        cognitoUser.resendConfirmationCode((err, result) => {
            if (err) {
                this.handleCognitoError(err);
            } else {
                this.showMessage('Verification code sent! Please check your email.', 'success');
            }
        });
    },
    
    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        this.clearErrors();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        // Validation
        if (!this.validateEmail(email)) {
            this.showError('loginEmailError', 'Please enter a valid email address');
            return;
        }
        
        if (password.length < 6) {
            this.showError('loginPasswordError', 'Password is required');
            return;
        }
        
        // Create authentication details
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });
        
        // Create cognito user
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
        
        // Authenticate user
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                // Store tokens
                this.storeTokens(result, rememberMe, email);
                
                // Get user attributes
                cognitoUser.getUserAttributes((err, attributes) => {
                    if (!err && attributes) {
                        // Try to get name from given_name and family_name (Cognito standard)
                        const givenNameAttr = attributes.find(attr => attr.Name === 'given_name');
                        const familyNameAttr = attributes.find(attr => attr.Name === 'family_name');
                        // Fallback to name attribute if given_name/family_name not found
                        const nameAttr = attributes.find(attr => attr.Name === 'name');
                        
                        let name = email.split('@')[0]; // Default fallback
                        if (givenNameAttr && familyNameAttr) {
                            name = `${givenNameAttr.Value} ${familyNameAttr.Value}`.trim();
                        } else if (givenNameAttr) {
                            name = givenNameAttr.Value;
                        } else if (nameAttr) {
                            name = nameAttr.Value;
                        }
                        
                        this.createSession({ email, name, userId: result.getIdToken().payload.sub }, rememberMe);
                    } else {
                        this.createSession({ email, name: email.split('@')[0], userId: result.getIdToken().payload.sub }, rememberMe);
                    }
                });
                
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect after short delay
                setTimeout(() => {
                    const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'index.html';
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                }, 1000);
            },
            onFailure: (err) => {
                this.handleCognitoError(err);
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                // Handle new password required (first time login after admin creates user)
                this.showMessage('New password required. Please contact administrator.', 'error');
            }
        });
    },
    
    // Handle forgot password
    async handleForgotPassword(e) {
        e.preventDefault();
        this.clearErrors();
        
        const email = document.getElementById('forgotPasswordEmail').value.trim();
        
        if (!this.validateEmail(email)) {
            this.showError('forgotPasswordEmailError', 'Please enter a valid email address');
            return;
        }
        
        // Create cognito user
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
        
        // Request password reset
        cognitoUser.forgotPassword({
            onSuccess: (data) => {
                // Store email for reset password form
                sessionStorage.setItem('resetPasswordEmail', email);
                
                // Show reset password form
                this.hideAllForms();
                const resetPasswordForm = document.getElementById('resetPasswordForm');
                if (resetPasswordForm) resetPasswordForm.classList.add('active');
                
                this.showMessage('Verification code sent! Please check your email.', 'success');
            },
            onFailure: (err) => {
                this.handleCognitoError(err);
            }
        });
    },
    
    // Handle reset password
    async handleResetPassword(e) {
        e.preventDefault();
        this.clearErrors();
        
        const code = document.getElementById('resetCode').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        const email = sessionStorage.getItem('resetPasswordEmail');
        
        if (!code) {
            this.showError('resetCodeError', 'Please enter verification code');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showError('newPasswordError', 'Password must be at least 8 characters');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            this.showError('confirmNewPasswordError', 'Passwords do not match');
            return;
        }
        
        if (!email) {
            this.showMessage('Session expired. Please request password reset again.', 'error');
            this.showForgotPasswordForm();
            return;
        }
        
        // Create cognito user
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
        
        // Confirm password reset
        cognitoUser.confirmPassword(code, newPassword, {
            onSuccess: () => {
                sessionStorage.removeItem('resetPasswordEmail');
                this.showMessage('Password reset successful! You can now sign in.', 'success');
                
                // Switch to login form
                setTimeout(() => {
                    this.showLoginForm();
                }, 1500);
            },
            onFailure: (err) => {
                this.handleCognitoError(err);
            }
        });
    },
    
    // Store Cognito tokens
    storeTokens(result, rememberMe, email) {
        const tokens = {
            idToken: result.getIdToken().getJwtToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
            email: email
        };
        
        if (rememberMe) {
            localStorage.setItem('cognitoTokens', JSON.stringify(tokens));
        } else {
            sessionStorage.setItem('cognitoTokens', JSON.stringify(tokens));
        }
    },
    
    // Get stored tokens
    getStoredTokens() {
        try {
            const tokens = sessionStorage.getItem('cognitoTokens') || localStorage.getItem('cognitoTokens');
            return tokens ? JSON.parse(tokens) : null;
        } catch (error) {
            return null;
        }
    },
    
    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Show error message
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    },
    
    // Clear all errors
    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
    },
    
    // Show message
    showMessage(text, type = 'success') {
        const messageEl = document.getElementById('message');
        if (!messageEl) return;
        
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.classList.add('show');
        
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    },
    
    // Handle Cognito errors
    handleCognitoError(err) {
        let errorMessage = 'An error occurred. Please try again.';
        let errorField = null;
        
        if (err.code) {
            switch (err.code) {
                case 'NotAuthorizedException':
                    errorMessage = 'Incorrect email or password.';
                    errorField = 'loginPasswordError';
                    break;
                case 'UserNotFoundException':
                    errorMessage = 'User not found. Please sign up first.';
                    errorField = 'loginEmailError';
                    break;
                case 'UserNotConfirmedException':
                    errorMessage = 'Please verify your email first.';
                    errorField = 'loginEmailError';
                    break;
                case 'CodeMismatchException':
                    errorMessage = 'Invalid verification code. Please try again.';
                    errorField = 'verificationCodeError';
                    break;
                case 'ExpiredCodeException':
                    errorMessage = 'Verification code has expired. Please request a new one.';
                    errorField = 'verificationCodeError';
                    break;
                case 'InvalidPasswordException':
                    errorMessage = 'Password does not meet requirements.';
                    errorField = 'signupPasswordError';
                    break;
                case 'UsernameExistsException':
                case 'AliasExistsException':
                    errorMessage = 'Email already registered. Please sign in instead.';
                    errorField = 'signupEmailError';
                    break;
                case 'InvalidParameterException':
                    // Handle email alias configuration error
                    if (err.message && err.message.includes('email format') && err.message.includes('email alias')) {
                        errorMessage = 'This email is already registered or there was a configuration issue. Please try signing in instead.';
                        errorField = 'signupEmailError';
                    } else {
                        errorMessage = err.message || 'Invalid input. Please check your information.';
                    }
                    break;
                case 'LimitExceededException':
                    errorMessage = 'Too many attempts. Please try again later.';
                    break;
                default:
                    errorMessage = err.message || errorMessage;
            }
        } else if (err.message) {
            // Check for email alias error in message
            if (err.message.includes('email format') && err.message.includes('email alias')) {
                errorMessage = 'This email is already registered. Please try signing in instead.';
                errorField = 'signupEmailError';
            } else {
                errorMessage = err.message;
            }
        }
        
        if (errorField) {
            this.showError(errorField, errorMessage);
        }
        this.showMessage(errorMessage, 'error');
        console.error('Cognito Error:', err);
    },
    
    // Create user session
    createSession(user, rememberMe) {
        const sessionData = {
            userId: user.userId,
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
        }
    },
    
    // Check if user is logged in
    checkSession() {
        const tokens = this.getStoredTokens();
        if (!tokens) return null;
        
        // Check if tokens are still valid (basic check)
        try {
            const sessionData = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
            if (sessionData) {
                return JSON.parse(sessionData);
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
        
        return null;
    },
    
    // Get current user
    getCurrentUser() {
        return this.checkSession();
    },
    
    // Logout
    logout() {
        // Sign out from Cognito
        const tokens = this.getStoredTokens();
        if (tokens && this.userPool) {
            const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: tokens.email,
                Pool: this.userPool
            });
            
            cognitoUser.signOut();
        }
        
        // Clear local storage
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('cognitoTokens');
        sessionStorage.removeItem('pendingVerificationEmail');
        sessionStorage.removeItem('resetPasswordEmail');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cognitoTokens');
        
        window.location.href = 'index.html';
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.checkSession() !== null;
    },
    
    // Get ID token for API calls
    getIdToken() {
        const tokens = this.getStoredTokens();
        return tokens ? tokens.idToken : null;
    },
    
    // Get access token for API calls
    getAccessToken() {
        const tokens = this.getStoredTokens();
        return tokens ? tokens.accessToken : null;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Cognito SDK to load
    if (typeof AmazonCognitoIdentity !== 'undefined') {
        Auth.init();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (typeof AmazonCognitoIdentity !== 'undefined') {
                Auth.init();
            } else {
                console.error('AWS Cognito SDK not loaded');
            }
        }, 500);
    }
});

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}
