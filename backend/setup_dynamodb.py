#!/usr/bin/env python3
"""
AWS DynamoDB Setup Script
Run this once to create the required tables in AWS DynamoDB
"""

import boto3
from botocore.exceptions import ClientError
from aws_config import AWS_CONFIG

def create_tables():
    """Create DynamoDB tables for SportsHub"""
    
    dynamodb = boto3.resource(
        'dynamodb',
        region_name=AWS_CONFIG['region'],
        aws_access_key_id=AWS_CONFIG['access_key_id'],
        aws_secret_access_key=AWS_CONFIG['secret_access_key']
    )
    
    # Create Matches table
    try:
        matches_table = dynamodb.create_table(
            TableName=AWS_CONFIG['matches_table'],
            KeySchema=[
                {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'  # On-demand (free tier friendly)
        )
        matches_table.wait_until_exists()
        print(f"✅ Created table: {AWS_CONFIG['matches_table']}")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"⚠️ Table {AWS_CONFIG['matches_table']} already exists")
        else:
            print(f"❌ Error creating matches table: {e}")
            raise
    
    # Create Selections table
    try:
        selections_table = dynamodb.create_table(
            TableName=AWS_CONFIG['selections_table'],
            KeySchema=[
                {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key (composite: userId#sport#category)
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'  # On-demand (free tier friendly)
        )
        selections_table.wait_until_exists()
        print(f"✅ Created table: {AWS_CONFIG['selections_table']}")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"⚠️ Table {AWS_CONFIG['selections_table']} already exists")
        else:
            print(f"❌ Error creating selections table: {e}")
            raise
    
    print("\n🎉 Setup complete! Your DynamoDB tables are ready.")
    print("\nTables created:")
    print(f"  - {AWS_CONFIG['matches_table']}")
    print(f"  - {AWS_CONFIG['selections_table']}")


if __name__ == "__main__":
    print("🔧 Setting up AWS DynamoDB tables for SportsHub...\n")
    
    # Check if config is set
    if AWS_CONFIG['access_key_id'] == 'YOUR_ACCESS_KEY_ID':
        print("❌ Error: Please configure your AWS credentials in aws_config.py first!")
        print("\nSteps:")
        print("1. Go to AWS Console → IAM → Users → Create User")
        print("2. Attach policy: AmazonDynamoDBFullAccess")
        print("3. Create access key")
        print("4. Copy credentials to backend/aws_config.py")
        exit(1)
    
    create_tables()
