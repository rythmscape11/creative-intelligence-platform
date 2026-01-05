#!/usr/bin/env python3
import re

files = [
    'src/app/growth-suite/heatmaps/page.tsx',
    'src/app/growth-suite/repurposer/page.tsx',
    'src/app/growth-suite/seo/page.tsx',
    'src/app/growth-suite/widgets/page.tsx',
]

for filepath in files:
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if current line ends with className=" and next line starts with className="
        if i + 1 < len(lines):
            curr_match = re.search(r'className="([^"]*)"$', line.rstrip())
            next_match = re.search(r'^\s*className="([^"]*)"', lines[i + 1])
            
            if curr_match and next_match:
                # Merge the classNames
                before_class = line[:line.rfind('className=')].rstrip()
                merged_classes = f'{curr_match.group(1)} {next_match.group(1)}'.strip()
                
                # Get the rest of the next line after className
                rest_of_next = re.sub(r'^\s*className="[^"]*"\s*', '', lines[i + 1])
                
                # Create the merged line
                if rest_of_next.strip() and rest_of_next.strip() != '>':
                    fixed_lines.append(f'{before_class} className="{merged_classes}" {rest_of_next}')
                else:
                    fixed_lines.append(f'{before_class} className="{merged_classes}">\n')
                
                i += 2
                continue
        
        fixed_lines.append(line)
        i += 1
    
    with open(filepath, 'w') as f:
        f.writelines(fixed_lines)
    
    print(f"  ✓ Fixed {filepath}")

print("\n✓ All files fixed!")

