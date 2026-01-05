#!/usr/bin/env python3
"""Fix remaining session references in admin pages"""

import re
from pathlib import Path

files_to_fix = [
    "src/app/(admin)/admin/analytics/page.tsx",
    "src/app/(admin)/admin/tracking/page.tsx",
    "src/app/(admin)/admin/users/page.tsx",
    "src/app/(admin)/admin/strategies/page.tsx",
    "src/app/(admin)/admin/settings/page.tsx",
]

for filepath in files_to_fix:
    path = Path(filepath)
    if not path.exists():
        print(f"Skipping {filepath} - not found")
        continue
    
    with open(path, 'r') as f:
        content = f.read()
    
    # Replace session checks
    content = re.sub(
        r"if \(!session\?\.user\?\.email\) {",
        "if (!userId) {",
        content
    )
    
    # Replace user lookup
    content = re.sub(
        r"where: { email: session\.user\.email },",
        "where: { id: userId },\n    select: { role: true },",
        content
    )
    
    with open(path, 'w') as f:
        f.write(content)
    
    print(f"✓ Fixed: {filepath}")

print("\n✓ All admin pages fixed!")
