# ToolsFromAI

A collection of AI-generated tools for various tasks including text analysis, JSON formatting, and file processing.

## Features

This package provides three main tools:

### 1. TextAnalyzer
Analyzes text and provides various metrics:
- Character count
- Word count
- Line count
- Sentence count
- Average word length
- Unique word count

### 2. JSONFormatter
Formats and validates JSON data:
- Format JSON with proper indentation
- Minify JSON by removing whitespace
- Validate JSON syntax
- Extract all keys from JSON objects

### 3. FileProcessor
Processes files with various operations:
- Count lines in files
- Get detailed file information
- Search for terms in files
- Batch rename files in directories

## Installation

```bash
pip install -e .
```

Or install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### TextAnalyzer Example

```python
from toolsfromai import TextAnalyzer

analyzer = TextAnalyzer()
text = "Hello world. This is a sample text for analysis."
metrics = analyzer.analyze(text)

print(metrics)
# Output: {'character_count': 50, 'word_count': 9, ...}

print(analyzer.get_summary())
# Output: Formatted summary of the analysis
```

### JSONFormatter Example

```python
from toolsfromai import JSONFormatter

formatter = JSONFormatter()

# Format JSON
json_str = '{"name":"John","age":30}'
formatted = formatter.format(json_str, indent=2)
print(formatted)

# Validate JSON
is_valid, message = formatter.validate(json_str)
print(f"Valid: {is_valid}, Message: {message}")

# Extract keys
keys = formatter.extract_keys('{"user":{"name":"John"}}')
print(keys)  # ['user', 'user.name']
```

### FileProcessor Example

```python
from toolsfromai import FileProcessor

processor = FileProcessor()

# Count lines
line_count = processor.count_lines('myfile.txt')

# Get file info
info = processor.get_file_info('myfile.txt')
print(f"File size: {info['size_kb']} KB")

# Search in file
results = processor.search_in_file('myfile.txt', 'search_term')
for line_num, line in results:
    print(f"Line {line_num}: {line}")
```

## Running Tests

```bash
python -m unittest discover tests
```

## Development

To contribute or modify the tools:

1. Clone the repository
2. Install in development mode: `pip install -e .`
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.