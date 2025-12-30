"""
Text Analyzer Tool - AI Generated
Analyzes text for various metrics and insights
"""


class TextAnalyzer:
    """
    A tool to analyze text and provide various metrics
    """
    
    def __init__(self):
        self.text = ""
        self.metrics = {}
    
    def analyze(self, text):
        """
        Analyze the provided text and return metrics
        
        Args:
            text (str): The text to analyze
            
        Returns:
            dict: Dictionary containing analysis metrics
        """
        self.text = text
        self.metrics = {
            'character_count': len(text),
            'word_count': len(text.split()),
            'line_count': len(text.splitlines()),
            'sentence_count': self._count_sentences(text),
            'average_word_length': self._average_word_length(text),
            'unique_words': len(set(text.lower().split())),
        }
        return self.metrics
    
    def _count_sentences(self, text):
        """Count the number of sentences in text"""
        if not text.strip():
            return 0
        sentence_endings = ['.', '!', '?']
        count = 0
        for char in text:
            if char in sentence_endings:
                count += 1
        return max(count, 1)  # At least 1 sentence if text is non-empty
    
    def _average_word_length(self, text):
        """Calculate average word length"""
        words = text.split()
        if not words:
            return 0
        total_length = sum(len(word.strip('.,!?;:')) for word in words)
        return round(total_length / len(words), 2)
    
    def get_summary(self):
        """
        Get a human-readable summary of the analysis
        
        Returns:
            str: Formatted summary of the text analysis
        """
        if not self.metrics:
            return "No text analyzed yet. Call analyze() first."
        
        summary = f"""
Text Analysis Summary:
----------------------
Characters: {self.metrics['character_count']}
Words: {self.metrics['word_count']}
Lines: {self.metrics['line_count']}
Sentences: {self.metrics['sentence_count']}
Average Word Length: {self.metrics['average_word_length']}
Unique Words: {self.metrics['unique_words']}
        """
        return summary.strip()
