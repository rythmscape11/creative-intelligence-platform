#!/usr/bin/env python3
"""Fix missing useClerk imports"""

import re
from pathlib import Path
import subprocess

# Find all files using useClerk without importing it
result = subprocess.run(
    ["bash", "-c", "grep -r 'useClerk()' src --include='*.tsx' | grep -v 'import.*useClerk' | cut -d: -f1 | sort -u"],
    capture_output=True,
    text=True,
    cwd="."
)

files = result.stdout.strip().split('\n')
files = [f for f in files if f]  # Remove empty strings

print(f"Found {len(files)} files missing useClerk import\n")

for filepath in files:
    path = Path(filepath)
    if not path.exists():
        continue
    
    with open(path, 'r') as f:
        content = f.read()
    
    # Check if file uses useClerk but doesn't import it
    if 'useClerk()' in content and 'import.*useClerk' not in content:
        # Add useClerk to existing @clerk/nextjs import
        if "import { useUser } from '@clerk/nextjs'" in content:
            content = content.replace(
                "import { useUser } from '@clerk/nextjs'",
                "import { useUser, useClerk } from '@clerk/nextjs'"
            )
            print(f"✓ Fixed: {filepath}")
        elif "from '@clerk/nextjs'" in content:
            # Find the import line and add useClerk
            content = re.sub(
                r"import { ([^}]+) } from '@clerk/nextjs'",
                r"import { \1, useClerk } from '@clerk/nextjs'",
                content
            )
            print(f"✓ Fixed: {filepath}")
        
        with open(path, 'w') as f:
            f.write(content)

print("\n✓ All imports fixed!")
