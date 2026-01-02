# AWS Configuration for DynamoDB
# This file uses environment variables for security
# 
# Set them in your terminal before running the server:
#   export AWS_ACCESS_KEY_ID="your-key"
#   export AWS_SECRET_ACCESS_KEY="your-secret"
#   export AWS_REGION="us-east-1"
#
# Or add them to ~/.zshrc for permanent storage

import os

AWS_CONFIG = {
    'region': os.environ.get('AWS_REGION', 'us-east-1'),
    'access_key_id': os.environ.get('AWS_ACCESS_KEY_ID', ''),
    'secret_access_key': os.environ.get('AWS_SECRET_ACCESS_KEY', ''),
    'matches_table': 'SportsHub_Matches',
    'selections_table': 'SportsHub_Selections'
}
