#!/usr/bin/env python3
"""
Automated migration script from NextAuth to Clerk
Handles common patterns in TypeScript/TSX files
"""

import re
import os
from pathlib import Path

# Define replacement patterns
PATTERNS = [
    # Import replacements
    (r"import\s*{\s*useSession\s*}\s*from\s*['\"]next-auth/react['\"]",
     "import { useUser } from '@clerk/nextjs'"),
    
    (r"import\s*{\s*useSession\s*,\s*signOut\s*}\s*from\s*['\"]next-auth/react['\"]",
     "import { useUser, useClerk } from '@clerk/nextjs'"),
    
    (r"import\s*{\s*signOut\s*,\s*useSession\s*}\s*from\s*['\"]next-auth/react['\"]",
     "import { useUser, useClerk } from '@clerk/nextjs'"),
    
    # Hook replacements
    (r"const\s*{\s*data:\s*session\s*,\s*status\s*}\s*=\s*useSession\(\)",
     "const { user, isLoaded, isSignedIn } = useUser();\n  const { signOut } = useClerk()"),
    
    (r"const\s*{\s*data:\s*session\s*}\s*=\s*useSession\(\)",
     "const { user } = useUser();\n  const { signOut } = useClerk()"),
    
    # Status checks
    (r"status\s*===\s*['\"]loading['\"]",
     "!isLoaded"),
    
    (r"status\s*===\s*['\"]authenticated['\"]",
     "isSignedIn"),
    
    (r"!session",
     "!isSignedIn"),
    
    (r"session\?\.user\?\.role",
     "(user?.publicMetadata?.role as string)"),
    
    (r"session\?\.user\?\.name",
     "(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress)"),
    
    (r"session\?\.user\?\.email",
     "user?.emailAddresses[0]?.emailAddress"),
    
    (r"session\.user\.id",
     "user?.id"),
    
    # SignOut replacements
    (r"await\s*signOut\(\s*{\s*redirect:\s*false\s*}\s*\)",
     "await signOut()"),
    
    (r"await\s*signOut\(\s*{\s*redirect:\s*true,\s*callbackUrl:.*?\}\s*\)",
     "await signOut(); window.location.href = '/auth/signin'"),
]

def migrate_file(filepath):
    """Migrate a single file from NextAuth to Clerk"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all patterns
        for pattern, replacement in PATTERNS:
            content = re.sub(pattern, replacement, content)
        
        # Only write if changed
        if content != original_content:
            # Create backup
            backup_path = f"{filepath}.bak"
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original_content)
            
            # Write migrated content
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✓ Migrated: {filepath}")
            return True
        else:
            print(f"- Skipped (no changes): {filepath}")
            return False
    
    except Exception as e:
        print(f"✗ Error migrating {filepath}: {e}")
        return False

def main():
    """Find and migrate all files with next-auth imports"""
    src_dir = Path("src")
    
    # Find all TS/TSX files with next-auth imports
    files_to_migrate = []
    for ext in ["*.ts", "*.tsx"]:
        for filepath in src_dir.rglob(ext):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    if "next-auth/react" in f.read():
                        files_to_migrate.append(filepath)
            except:
                pass
    
    print(f"Found {len(files_to_migrate)} files to migrate\n")
    
    migrated_count = 0
    for filepath in files_to_migrate:
        if migrate_file(filepath):
            migrated_count += 1
    
    print(f"\n✓ Migration complete!")
    print(f"  Migrated: {migrated_count} files")
    print(f"  Skipped: {len(files_to_migrate) - migrated_count} files")
    print(f"\nBackup files created with .bak extension")

if __name__ == "__main__":
    main()
