"""
File Processor Tool - AI Generated
Processes files with various operations
"""

import os


class FileProcessor:
    """
    A tool to process files with various operations
    """
    
    def __init__(self):
        self.processed_files = []
    
    def count_lines(self, filepath):
        """
        Count the number of lines in a file
        
        Args:
            filepath (str): Path to the file
            
        Returns:
            int: Number of lines in the file
            
        Raises:
            FileNotFoundError: If the file doesn't exist
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            return sum(1 for line in f)
    
    def get_file_info(self, filepath):
        """
        Get detailed information about a file
        
        Args:
            filepath (str): Path to the file
            
        Returns:
            dict: Dictionary containing file information
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        
        stat_info = os.stat(filepath)
        
        return {
            'name': os.path.basename(filepath),
            'path': os.path.abspath(filepath),
            'size_bytes': stat_info.st_size,
            'size_kb': round(stat_info.st_size / 1024, 2),
            'extension': os.path.splitext(filepath)[1],
            'is_file': os.path.isfile(filepath),
            'is_dir': os.path.isdir(filepath),
        }
    
    def search_in_file(self, filepath, search_term, case_sensitive=False):
        """
        Search for a term in a file and return line numbers where it appears
        
        Args:
            filepath (str): Path to the file
            search_term (str): Term to search for
            case_sensitive (bool): Whether the search should be case sensitive
            
        Returns:
            list: List of tuples (line_number, line_content)
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        
        results = []
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                search_line = line if case_sensitive else line.lower()
                search_for = search_term if case_sensitive else search_term.lower()
                
                if search_for in search_line:
                    results.append((line_num, line.rstrip()))
        
        return results
    
    def batch_rename(self, directory, old_pattern, new_pattern, dry_run=True):
        """
        Batch rename files in a directory
        
        Args:
            directory (str): Directory containing files to rename
            old_pattern (str): Pattern to replace in filenames
            new_pattern (str): New pattern to use
            dry_run (bool): If True, only show what would be renamed
            
        Returns:
            list: List of tuples (old_name, new_name)
        """
        if not os.path.exists(directory):
            raise FileNotFoundError(f"Directory not found: {directory}")
        
        renamed = []
        for filename in os.listdir(directory):
            if old_pattern in filename:
                old_path = os.path.join(directory, filename)
                new_filename = filename.replace(old_pattern, new_pattern)
                new_path = os.path.join(directory, new_filename)
                
                if not dry_run:
                    os.rename(old_path, new_path)
                
                renamed.append((filename, new_filename))
        
        return renamed
