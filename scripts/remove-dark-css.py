#!/usr/bin/env python3
"""
Remove all .dark CSS class definitions from CSS files
"""

import re
import sys

def remove_dark_classes(content):
    """Remove .dark CSS class blocks from content"""
    # Pattern to match .dark class blocks
    # Matches: .dark .selector { ... } or .dark { ... }
    pattern = r'\.dark\s+[^{]*\{[^}]*\}\s*\n'
    
    # Remove all matches
    cleaned = re.sub(pattern, '', content, flags=re.MULTILINE)
    
    return cleaned

def process_file(filepath):
    """Process a single CSS file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_lines = len(content.splitlines())
        cleaned = remove_dark_classes(content)
        new_lines = len(cleaned.splitlines())
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        
        removed = original_lines - new_lines
        if removed > 0:
            print(f"✅ {filepath}: Removed {removed} lines")
        else:
            print(f"⏭️  {filepath}: No dark classes found")
            
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    files = [
        "src/app/globals.css",
        "src/styles/design-system.css",
        "src/styles/blog-post.css"
    ]
    
    print("🌙 Removing .dark CSS classes...")
    print("=" * 50)
    
    for filepath in files:
        process_file(filepath)
    
    print("=" * 50)
    print("✅ Dark CSS classes removed successfully!")

