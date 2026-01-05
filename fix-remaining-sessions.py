#!/usr/bin/env python3
"""Fix all remaining session and status references from NextAuth"""

import re
from pathlib import Path

# Files that still have issues
files_to_fix = [
    "src/app/(dashboard)/dashboard/admin/leads/page.tsx",
    "src/app/(dashboard)/dashboard/admin/integrations/mailchimp/sync/page.tsx",
]

for filepath in files_to_fix:
    path = Path(filepath)
    if not path.exists():
        print(f"Skipping {filepath} - not found")
        continue
    
    with open(path, 'r') as f:
        content = f.read()
    
    # Fix useEffect dependencies - remove session and status
    content = re.sub(
        r'\], \[status, session, router\]\);',
        '], [user, isLoaded, isSignedIn, router]);',
        content
    )
    
    content = re.sub(
        r'\], \[fetchIntegration, router, session\?\.user, status\]\);',
        '], [fetchIntegration, router, user, isLoaded, isSignedIn]);',
        content
    )
    
    # Fix useEffect body - replace status checks with isLoaded/isSignedIn
    content = re.sub(
        r'if \(status === [\'"]unauthenticated[\'"]\) \{',
        'if (!isLoaded) return;\n\n    if (!isSignedIn) {',
        content
    )
    
    content = re.sub(
        r'if \(status === [\'"]loading[\'"]\) return;',
        'if (!isLoaded) return;',
        content
    )
    
    with open(path, 'w') as f:
        f.write(content)
    
    print(f"✓ Fixed: {filepath}")

print("\n✓ All session references fixed!")
