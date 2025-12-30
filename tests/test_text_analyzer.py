"""
Tests for TextAnalyzer tool
"""

import unittest
from toolsfromai.tools.text_analyzer import TextAnalyzer


class TestTextAnalyzer(unittest.TestCase):
    def setUp(self):
        self.analyzer = TextAnalyzer()
    
    def test_analyze_simple_text(self):
        text = "Hello world. This is a test."
        result = self.analyzer.analyze(text)
        
        self.assertEqual(result['character_count'], 28)
        self.assertEqual(result['word_count'], 6)
        self.assertEqual(result['sentence_count'], 2)
    
    def test_analyze_empty_text(self):
        text = ""
        result = self.analyzer.analyze(text)
        
        self.assertEqual(result['character_count'], 0)
        self.assertEqual(result['word_count'], 0)
    
    def test_word_count(self):
        text = "One two three four five"
        result = self.analyzer.analyze(text)
        
        self.assertEqual(result['word_count'], 5)
    
    def test_unique_words(self):
        text = "hello hello world world"
        result = self.analyzer.analyze(text)
        
        self.assertEqual(result['unique_words'], 2)
    
    def test_get_summary_before_analysis(self):
        summary = self.analyzer.get_summary()
        self.assertIn("No text analyzed yet", summary)
    
    def test_get_summary_after_analysis(self):
        self.analyzer.analyze("Test text.")
        summary = self.analyzer.get_summary()
        
        self.assertIn("Characters:", summary)
        self.assertIn("Words:", summary)


if __name__ == '__main__':
    unittest.main()
