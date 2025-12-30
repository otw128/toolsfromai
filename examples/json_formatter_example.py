"""
Example usage of JSONFormatter tool
"""

from toolsfromai import JSONFormatter


def main():
    formatter = JSONFormatter()
    
    # Example 1: Format JSON
    print("=" * 50)
    print("Example 1: Format JSON")
    print("=" * 50)
    
    compact_json = '{"name":"Alice","age":30,"city":"NYC","hobbies":["reading","coding"]}'
    print("\nOriginal (compact):")
    print(compact_json)
    
    formatted = formatter.format(compact_json, indent=2)
    print("\nFormatted:")
    print(formatted)
    
    # Example 2: Minify JSON
    print("\n" + "=" * 50)
    print("Example 2: Minify JSON")
    print("=" * 50)
    
    pretty_json = """{
        "user": {
            "name": "Bob",
            "email": "bob@example.com"
        }
    }"""
    
    print("\nOriginal (formatted):")
    print(pretty_json)
    
    minified = formatter.minify(pretty_json)
    print("\nMinified:")
    print(minified)
    
    # Example 3: Validate JSON
    print("\n" + "=" * 50)
    print("Example 3: Validate JSON")
    print("=" * 50)
    
    valid_json = '{"status": "ok"}'
    invalid_json = '{invalid json}'
    
    is_valid, msg = formatter.validate(valid_json)
    print(f"\nValidating: {valid_json}")
    print(f"Result: {msg}")
    
    is_valid, msg = formatter.validate(invalid_json)
    print(f"\nValidating: {invalid_json}")
    print(f"Result: {msg}")
    
    # Example 4: Extract keys
    print("\n" + "=" * 50)
    print("Example 4: Extract Keys from Nested JSON")
    print("=" * 50)
    
    nested_json = '''{
        "user": {
            "profile": {
                "name": "Charlie",
                "age": 25
            },
            "settings": {
                "theme": "dark"
            }
        }
    }'''
    
    keys = formatter.extract_keys(nested_json)
    print("\nNested JSON structure:")
    print(nested_json)
    print("\nExtracted keys:")
    for key in keys:
        print(f"  - {key}")


if __name__ == "__main__":
    main()
