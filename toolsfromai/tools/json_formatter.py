"""
JSON Formatter Tool - AI Generated
Formats and validates JSON data
"""

import json


class JSONFormatter:
    """
    A tool to format, validate, and manipulate JSON data
    """
    
    def __init__(self):
        self.data = None
    
    def format(self, json_string, indent=2):
        """
        Format a JSON string with proper indentation
        
        Args:
            json_string (str): JSON string to format
            indent (int): Number of spaces for indentation
            
        Returns:
            str: Formatted JSON string
            
        Raises:
            ValueError: If the JSON string is invalid
        """
        try:
            self.data = json.loads(json_string)
            return json.dumps(self.data, indent=indent, sort_keys=False)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON: {str(e)}")
    
    def minify(self, json_string):
        """
        Minify a JSON string by removing all whitespace
        
        Args:
            json_string (str): JSON string to minify
            
        Returns:
            str: Minified JSON string
        """
        try:
            data = json.loads(json_string)
            return json.dumps(data, separators=(',', ':'))
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON: {str(e)}")
    
    def validate(self, json_string):
        """
        Validate if a string is valid JSON
        
        Args:
            json_string (str): String to validate
            
        Returns:
            tuple: (bool, str) - (is_valid, error_message)
        """
        try:
            json.loads(json_string)
            return (True, "Valid JSON")
        except json.JSONDecodeError as e:
            return (False, f"Invalid JSON: {str(e)}")
    
    def extract_keys(self, json_string):
        """
        Extract all keys from a JSON object
        
        Args:
            json_string (str): JSON string to extract keys from
            
        Returns:
            list: List of all keys in the JSON object
        """
        try:
            data = json.loads(json_string)
            return self._get_all_keys(data)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON: {str(e)}")
    
    def _get_all_keys(self, data, prefix=''):
        """Recursively extract all keys from nested JSON"""
        keys = []
        if isinstance(data, dict):
            for key, value in data.items():
                full_key = f"{prefix}.{key}" if prefix else key
                keys.append(full_key)
                if isinstance(value, (dict, list)):
                    keys.extend(self._get_all_keys(value, full_key))
        elif isinstance(data, list):
            for i, item in enumerate(data):
                if isinstance(item, (dict, list)):
                    keys.extend(self._get_all_keys(item, f"{prefix}[{i}]"))
        return keys
