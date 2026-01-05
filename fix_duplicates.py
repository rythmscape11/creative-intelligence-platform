#!/usr/bin/env python3
"""
Fix duplicate className attributes and inline styles in Growth Suite pages
"""

import re
import sys

def fix_duplicate_classnames(content):
    """Fix duplicate className attributes by merging them"""
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line has className and next line also has className
        if 'className=' in line and i + 1 < len(lines) and 'className=' in lines[i + 1]:
            # Extract className values from both lines
            match1 = re.search(r'className="([^"]*)"', line)
            match2 = re.search(r'className="([^"]*)"', lines[i + 1])
            
            if match1 and match2:
                # Get the indentation and content before className
                indent = re.match(r'^(\s*)', line).group(1)
                before_class = re.sub(r'\s*className="[^"]*"\s*$', '', line)
                
                # Merge the className values
                merged_classes = f'{match1.group(1)} {match2.group(1)}'.strip()
                
                # Get content after className on second line
                after_class = re.sub(r'^\s*className="[^"]*"\s*', '', lines[i + 1])
                
                # Create merged line
                if after_class.strip():
                    # If there's content after the second className, keep it
                    fixed_lines.append(f'{before_class} className="{merged_classes}"')
                    if after_class.strip() != '>':
                        fixed_lines.append(f'{indent}  {after_class}')
                else:
                    # Just merge the classNames
                    fixed_lines.append(f'{before_class} className="{merged_classes}">')
                
                i += 2  # Skip the next line since we merged it
                continue
        
        fixed_lines.append(line)
        i += 1
    
    return '\n'.join(fixed_lines)

def fix_inline_styles(content):
    """Remove inline styles with undefined CSS variables"""
    # Fix style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-neutral-charcoal)' }}
    content = re.sub(
        r'\s*style=\{\{\s*fontFamily:\s*[\'"]var\(--font-family-display\)[\'"]\s*,\s*color:\s*[\'"]var\(--color-neutral-charcoal\)[\'"]\s*\}\}',
        '',
        content
    )
    
    # Fix style={{ color: 'var(--color-neutral-charcoal)' }}
    content = re.sub(
        r'\s*style=\{\{\s*color:\s*[\'"]var\(--color-neutral-charcoal\)[\'"]\s*\}\}',
        '',
        content
    )
    
    # Fix style={{ color: 'var(--color-accent-orange)' }}
    content = re.sub(
        r'\s*style=\{\{\s*color:\s*[\'"]var\(--color-accent-orange\)[\'"]\s*\}\}',
        '',
        content
    )
    
    # Fix style={{ color: 'var(--color-primary-yellow)' }}
    content = re.sub(
        r'\s*style=\{\{\s*color:\s*[\'"]var\(--color-primary-yellow\)[\'"]\s*\}\}',
        '',
        content
    )
    
    # Fix style={{ backgroundColor: 'var(--color-primary-yellow)' }}
    content = re.sub(
        r'\s*style=\{\{\s*backgroundColor:\s*[\'"]var\(--color-primary-yellow\)[\'"]\s*\}\}',
        '',
        content
    )
    
    # Fix multi-line style with width
    content = re.sub(
        r'\s*style=\{\{\s*\n\s*width:.*?\n\s*backgroundColor:\s*[\'"]var\(--color-primary-yellow\)[\'"]\s*\n\s*\}\}',
        '',
        content,
        flags=re.MULTILINE | re.DOTALL
    )
    
    return content

def process_file(filepath):
    """Process a single file"""
    print(f"Processing {filepath}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix duplicate classNames
        content = fix_duplicate_classnames(content)
        
        # Fix inline styles
        content = fix_inline_styles(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Fixed {filepath}")
            return True
        else:
            print(f"  - No changes needed for {filepath}")
            return False
    
    except Exception as e:
        print(f"  ✗ Error processing {filepath}: {e}")
        return False

def main():
    files = [
        'src/app/growth-suite/heatmaps/page.tsx',
        'src/app/growth-suite/repurposer/page.tsx',
        'src/app/growth-suite/seo/page.tsx',
        'src/app/growth-suite/widgets/page.tsx',
    ]
    
    fixed_count = 0
    for filepath in files:
        if process_file(filepath):
            fixed_count += 1
    
    print(f"\n✓ Fixed {fixed_count} files")
    return 0

if __name__ == '__main__':
    sys.exit(main())

