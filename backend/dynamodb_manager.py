# DynamoDB Database Layer
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
from datetime import datetime
from typing import List, Optional, Dict, Any
import uuid

from aws_config import AWS_CONFIG

class DynamoDBManager:
    def __init__(self):
        self.dynamodb = boto3.resource(
            'dynamodb',
            region_name=AWS_CONFIG['region'],
            aws_access_key_id=AWS_CONFIG['access_key_id'],
            aws_secret_access_key=AWS_CONFIG['secret_access_key']
        )
        self.matches_table = self.dynamodb.Table(AWS_CONFIG['matches_table'])
        self.selections_table = self.dynamodb.Table(AWS_CONFIG['selections_table'])
    
    # ============ MATCHES ============
    
    def save_match(self, match_data: Dict[str, Any], user_id: Optional[str] = None) -> Dict[str, Any]:
        """Save a match to DynamoDB"""
        match_id = f"match_{uuid.uuid4().hex[:12]}"
        now = datetime.now().isoformat()
        
        item = {
            'id': match_id,
            'userId': user_id or 'anonymous',
            'sport': match_data.get('sport', ''),
            'category': match_data.get('category', ''),
            'team1': match_data.get('team1', 'TBA'),
            'team2': match_data.get('team2', 'TBA'),
            'date': match_data.get('date', ''),
            'time': match_data.get('time', ''),
            'venue': match_data.get('venue', 'TBA'),
            'league': match_data.get('league', ''),
            'status': match_data.get('status', 'upcoming'),
            'notificationEnabled': match_data.get('notificationEnabled', False),
            'saved': True,
            'createdAt': now,
            'updatedAt': now
        }
        
        self.matches_table.put_item(Item=item)
        return item
    
    def get_matches(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all matches for a user"""
        try:
            if user_id:
                response = self.matches_table.scan(
                    FilterExpression=Attr('userId').eq(user_id)
                )
            else:
                response = self.matches_table.scan(
                    FilterExpression=Attr('userId').eq('anonymous')
                )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Error getting matches: {e}")
            return []
    
    def get_match(self, match_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific match by ID"""
        try:
            response = self.matches_table.get_item(Key={'id': match_id})
            return response.get('Item')
        except ClientError as e:
            print(f"Error getting match: {e}")
            return None
    
    def update_match(self, match_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a match"""
        try:
            update_expr = "SET updatedAt = :updated"
            expr_values = {':updated': datetime.now().isoformat()}
            
            for key, value in updates.items():
                if key not in ['id', 'userId', 'createdAt']:
                    update_expr += f", {key} = :{key}"
                    expr_values[f':{key}'] = value
            
            response = self.matches_table.update_item(
                Key={'id': match_id},
                UpdateExpression=update_expr,
                ExpressionAttributeValues=expr_values,
                ReturnValues="ALL_NEW"
            )
            return response.get('Attributes')
        except ClientError as e:
            print(f"Error updating match: {e}")
            return None
    
    def delete_match(self, match_id: str) -> bool:
        """Delete a match"""
        try:
            self.matches_table.delete_item(Key={'id': match_id})
            return True
        except ClientError as e:
            print(f"Error deleting match: {e}")
            return False
    
    # ============ SELECTIONS ============
    
    def save_selection(self, selection_data: Dict[str, Any], user_id: Optional[str] = None) -> Dict[str, Any]:
        """Save or update a selection"""
        # Create a composite key for the selection
        composite_key = f"{user_id or 'anonymous'}#{selection_data.get('sport', '')}#{selection_data.get('category', '')}"
        now = datetime.now().isoformat()
        
        item = {
            'id': composite_key,
            'userId': user_id or 'anonymous',
            'sport': selection_data.get('sport', ''),
            'category': selection_data.get('category', ''),
            'selections': selection_data.get('selections', []),
            'timestamp': now
        }
        
        self.selections_table.put_item(Item=item)
        return item
    
    def get_selections(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all selections for a user"""
        try:
            if user_id:
                response = self.selections_table.scan(
                    FilterExpression=Attr('userId').eq(user_id)
                )
            else:
                response = self.selections_table.scan(
                    FilterExpression=Attr('userId').eq('anonymous')
                )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Error getting selections: {e}")
            return []
    
    def get_selections_by_sport(self, sport: str, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get selections for a specific sport"""
        try:
            filter_expr = Attr('sport').eq(sport)
            if user_id:
                filter_expr = filter_expr & Attr('userId').eq(user_id)
            else:
                filter_expr = filter_expr & Attr('userId').eq('anonymous')
            
            response = self.selections_table.scan(FilterExpression=filter_expr)
            return response.get('Items', [])
        except ClientError as e:
            print(f"Error getting selections by sport: {e}")
            return []
    
    def delete_selection(self, sport: str, category: str, user_id: Optional[str] = None) -> bool:
        """Delete a selection"""
        try:
            composite_key = f"{user_id or 'anonymous'}#{sport}#{category}"
            self.selections_table.delete_item(Key={'id': composite_key})
            return True
        except ClientError as e:
            print(f"Error deleting selection: {e}")
            return False


# Singleton instance
db = DynamoDBManager()
