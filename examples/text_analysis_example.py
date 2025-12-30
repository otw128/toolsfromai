"""
Example usage of TextAnalyzer tool
"""

from toolsfromai import TextAnalyzer


def main():
    # Create an instance of TextAnalyzer
    analyzer = TextAnalyzer()
    
    # Sample text to analyze
    text = """
    Artificial Intelligence is transforming the world.
    AI tools can help us analyze data, process information, and make decisions.
    The future of AI is bright and full of possibilities!
    """
    
    # Analyze the text
    print("Analyzing text...")
    metrics = analyzer.analyze(text)
    
    # Display individual metrics
    print("\nIndividual Metrics:")
    print(f"Characters: {metrics['character_count']}")
    print(f"Words: {metrics['word_count']}")
    print(f"Lines: {metrics['line_count']}")
    print(f"Sentences: {metrics['sentence_count']}")
    print(f"Average Word Length: {metrics['average_word_length']}")
    print(f"Unique Words: {metrics['unique_words']}")
    
    # Get formatted summary
    print("\nFormatted Summary:")
    print(analyzer.get_summary())


if __name__ == "__main__":
    main()
