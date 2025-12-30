"""
Example usage of FileProcessor tool
"""

import os
import tempfile
from toolsfromai import FileProcessor


def main():
    processor = FileProcessor()
    
    # Create a temporary directory and file for demonstration
    temp_dir = tempfile.mkdtemp()
    temp_file = os.path.join(temp_dir, 'sample.txt')
    
    # Write sample content to the file
    sample_content = """This is line 1
This is line 2 with keyword
This is line 3
Another line with keyword
Final line 5"""
    
    with open(temp_file, 'w') as f:
        f.write(sample_content)
    
    print("=" * 50)
    print("Example 1: Count Lines in File")
    print("=" * 50)
    
    line_count = processor.count_lines(temp_file)
    print(f"\nFile: {os.path.basename(temp_file)}")
    print(f"Total lines: {line_count}")
    
    # Example 2: Get file information
    print("\n" + "=" * 50)
    print("Example 2: Get File Information")
    print("=" * 50)
    
    file_info = processor.get_file_info(temp_file)
    print("\nFile Information:")
    for key, value in file_info.items():
        print(f"  {key}: {value}")
    
    # Example 3: Search in file
    print("\n" + "=" * 50)
    print("Example 3: Search in File")
    print("=" * 50)
    
    search_term = "keyword"
    results = processor.search_in_file(temp_file, search_term, case_sensitive=False)
    
    print(f"\nSearching for '{search_term}' in {os.path.basename(temp_file)}:")
    print(f"Found {len(results)} occurrence(s):\n")
    
    for line_num, line_content in results:
        print(f"  Line {line_num}: {line_content}")
    
    # Example 4: Batch rename (dry run)
    print("\n" + "=" * 50)
    print("Example 4: Batch Rename Files (Dry Run)")
    print("=" * 50)
    
    # Create some test files
    for i in range(3):
        test_file = os.path.join(temp_dir, f'old_file_{i}.txt')
        with open(test_file, 'w') as f:
            f.write(f"Content {i}")
    
    print(f"\nFiles before rename:")
    for filename in os.listdir(temp_dir):
        print(f"  - {filename}")
    
    # Perform dry run
    renamed = processor.batch_rename(temp_dir, 'old_file', 'new_file', dry_run=True)
    
    print(f"\nRename preview (dry run):")
    for old_name, new_name in renamed:
        print(f"  {old_name} -> {new_name}")
    
    print(f"\nFiles after dry run (unchanged):")
    for filename in os.listdir(temp_dir):
        print(f"  - {filename}")
    
    # Clean up
    print("\n" + "=" * 50)
    print("Cleaning up temporary files...")
    for filename in os.listdir(temp_dir):
        os.remove(os.path.join(temp_dir, filename))
    os.rmdir(temp_dir)
    print("Done!")


if __name__ == "__main__":
    main()
