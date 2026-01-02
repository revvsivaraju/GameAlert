// AWS Cognito Configuration
// Replace these values with your actual AWS Cognito User Pool details
// See AWS_COGNITO_SETUP.md for setup instructions

const AWS_CONFIG = {
    // Your AWS Region (e.g., 'us-east-1', 'us-west-2', 'eu-west-1')
    region: 'us-east-1',
    
    // Your Cognito User Pool ID (format: us-east-1_XXXXXXXXX)
    userPoolId: 'us-east-1_fvQxrvlGC',
    
    // Your Cognito App Client ID (format: xxxxxxxxxxxxxxxxxxxxxxxxxx)
    clientId: '6tuj2jriclgja4tnvceg52e872'
};

// Validate configuration
function validateConfig() {
    // Check if configuration values are still placeholders
    if (AWS_CONFIG.region === 'YOUR_AWS_REGION' || 
        AWS_CONFIG.userPoolId === 'YOUR_USER_POOL_ID' || 
        AWS_CONFIG.clientId === 'YOUR_CLIENT_ID' ||
        !AWS_CONFIG.region || 
        !AWS_CONFIG.userPoolId || 
        !AWS_CONFIG.clientId) {
        console.warn('⚠️ AWS Cognito configuration not set. Please update js/config.js with your Cognito details.');
        return false;
    }
    return true;
}

