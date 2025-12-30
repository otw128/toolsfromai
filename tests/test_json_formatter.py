"""
Tests for JSONFormatter tool
"""

import unittest
from toolsfromai.tools.json_formatter import JSONFormatter


class TestJSONFormatter(unittest.TestCase):
    def setUp(self):
        self.formatter = JSONFormatter()
    
    def test_format_valid_json(self):
        json_str = '{"name":"John","age":30}'
        result = self.formatter.format(json_str)
        
        self.assertIn('"name"', result)
        self.assertIn('"John"', result)
        self.assertIn('\n', result)  # Should have newlines
    
    def test_format_invalid_json(self):
        json_str = '{"name": invalid}'
        
        with self.assertRaises(ValueError):
            self.formatter.format(json_str)
    
    def test_minify_json(self):
        json_str = '{\n  "name": "John",\n  "age": 30\n}'
        result = self.formatter.minify(json_str)
        
        self.assertNotIn('\n', result)
        self.assertNotIn('  ', result)
    
    def test_validate_valid_json(self):
        json_str = '{"valid": true}'
        is_valid, message = self.formatter.validate(json_str)
        
        self.assertTrue(is_valid)
        self.assertEqual(message, "Valid JSON")
    
    def test_validate_invalid_json(self):
        json_str = '{invalid json}'
        is_valid, message = self.formatter.validate(json_str)
        
        self.assertFalse(is_valid)
        self.assertIn("Invalid JSON", message)
    
    def test_extract_keys_simple(self):
        json_str = '{"name": "John", "age": 30}'
        keys = self.formatter.extract_keys(json_str)
        
        self.assertIn('name', keys)
        self.assertIn('age', keys)
    
    def test_extract_keys_nested(self):
        json_str = '{"user": {"name": "John", "address": {"city": "NYC"}}}'
        keys = self.formatter.extract_keys(json_str)
        
        self.assertIn('user', keys)
        self.assertIn('user.name', keys)
        self.assertIn('user.address', keys)
        self.assertIn('user.address.city', keys)


if __name__ == '__main__':
    unittest.main()
