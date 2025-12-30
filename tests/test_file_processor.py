"""
Tests for FileProcessor tool
"""

import unittest
import os
import tempfile
from toolsfromai.tools.file_processor import FileProcessor


class TestFileProcessor(unittest.TestCase):
    def setUp(self):
        self.processor = FileProcessor()
        self.temp_dir = tempfile.mkdtemp()
        self.test_file = os.path.join(self.temp_dir, 'test.txt')
        
        # Create a test file
        with open(self.test_file, 'w') as f:
            f.write("Line 1\nLine 2\nLine 3\n")
    
    def tearDown(self):
        # Clean up temp files
        if os.path.exists(self.test_file):
            os.remove(self.test_file)
        if os.path.exists(self.temp_dir):
            os.rmdir(self.temp_dir)
    
    def test_count_lines(self):
        count = self.processor.count_lines(self.test_file)
        self.assertEqual(count, 3)
    
    def test_count_lines_nonexistent_file(self):
        with self.assertRaises(FileNotFoundError):
            self.processor.count_lines('/nonexistent/file.txt')
    
    def test_get_file_info(self):
        info = self.processor.get_file_info(self.test_file)
        
        self.assertEqual(info['name'], 'test.txt')
        self.assertEqual(info['extension'], '.txt')
        self.assertTrue(info['is_file'])
        self.assertFalse(info['is_dir'])
    
    def test_search_in_file(self):
        results = self.processor.search_in_file(self.test_file, 'Line 2')
        
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0][0], 2)  # Line number
        self.assertIn('Line 2', results[0][1])  # Line content
    
    def test_search_in_file_case_insensitive(self):
        results = self.processor.search_in_file(self.test_file, 'line', case_sensitive=False)
        
        self.assertEqual(len(results), 3)  # Should find all 3 lines
    
    def test_batch_rename_dry_run(self):
        # Create additional test files
        file1 = os.path.join(self.temp_dir, 'old_name_1.txt')
        file2 = os.path.join(self.temp_dir, 'old_name_2.txt')
        
        with open(file1, 'w') as f:
            f.write("test")
        with open(file2, 'w') as f:
            f.write("test")
        
        renamed = self.processor.batch_rename(self.temp_dir, 'old_name', 'new_name', dry_run=True)
        
        self.assertEqual(len(renamed), 2)
        # Files should still have old names in dry run
        self.assertTrue(os.path.exists(file1))
        self.assertTrue(os.path.exists(file2))
        
        # Clean up
        os.remove(file1)
        os.remove(file2)


if __name__ == '__main__':
    unittest.main()
