#!/usr/bin/env python3
"""
Comprehensive migration script for ALL remaining NextAuth references
"""

import re
from pathlib import Path

def migrate_any_file(filepath):
    """Migrate any file with NextAuth references"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Skip if already migrated
        if "next-auth" not in content:
            return False
        
        # Replace server-side imports
        content = re.sub(
            r"import\s*{\s*getServerSession\s*}\s*from\s*['\"]next-auth['\"];?",
            "import { auth } from '@clerk/nextjs/server';",
            content
        )
        
        # Replace client-side imports
        content = re.sub(
            r"import\s*{\s*useSession\s*}\s*from\s*['\"]next-auth/react['\"]",
            "import { useUser } from '@clerk/nextjs'",
            content
        )
        
        content = re.sub(
            r"import\s*{\s*useSession\s*,\s*signOut\s*}\s*from\s*['\"]next-auth/react['\"]",
            "import { useUser, useClerk } from '@clerk/nextjs'",
            content
        )
        
        content = re.sub(
            r"import\s*{\s*signOut\s*,\s*useSession\s*}\s*from\s*['\"]next-auth/react['\"]",
            "import { useUser, useClerk } from '@clerk/nextjs'",
            content
        )
        
        # Remove authOptions import
        content = re.sub(
            r"import\s*{\s*authOptions\s*}\s*from\s*['\"]@/lib/auth['\"];?\n?",
            "",
            content
        )
        
        # Replace getServerSession calls
        content = re.sub(
            r"const\s+session\s*=\s*await\s+getServerSession\(authOptions\);?",
            "const { userId } = await auth();",
            content
        )
        
        # Replace client-side hooks
        content = re.sub(
            r"const\s*{\s*data:\s*session\s*,\s*status\s*}\s*=\s*useSession\(\)",
            "const { user, isLoaded, isSignedIn } = useUser();\n  const { signOut } = useClerk()",
            content
        )
        
        content = re.sub(
            r"const\s*{\s*data:\s*session\s*}\s*=\s*useSession\(\)",
            "const { user } = useUser();\n  const { signOut } = useClerk()",
            content
        )
        
        # Replace session checks
        content = re.sub(
            r"if\s*\(\s*!session\s*\)\s*{",
            "if (!userId) {",
            content
        )
        
        content = re.sub(
            r"status\s*===\s*['\"]loading['\"]",
            "!isLoaded",
            content
        )
        
        content = re.sub(
            r"status\s*===\s*['\"]authenticated['\"]",
            "isSignedIn",
            content
        )
        
        # Replace role checks
        content = re.sub(
            r"if\s*\(\s*session\.user\.role\s*!==\s*['\"]ADMIN['\"]\s*\)\s*{",
            """const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') {""",
            content
        )
        
        # Replace session.user references
        content = re.sub(
            r"session\?\.user\?\.role",
            "(user?.publicMetadata?.role as string)",
            content
        )
        
        content = re.sub(
            r"session\?\.user\?\.name",
            "(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress)",
            content
        )
        
        content = re.sub(
            r"session\?\.user\?\.email",
            "user?.emailAddresses[0]?.emailAddress",
            content
        )
        
        content = re.sub(
            r"session\.user\.id",
            "user?.id",
            content
        )
        
        # Replace signOut calls
        content = re.sub(
            r"await\s*signOut\(\s*{\s*redirect:\s*false\s*}\s*\)",
            "await signOut()",
            content
        )
        
        content = re.sub(
            r"await\s*signOut\(\s*{\s*redirect:\s*true,\s*callbackUrl:.*?\}\s*\)",
            "await signOut(); window.location.href = '/auth/signin'",
            content
        )
        
        # Only write if changed
        if content != original_content:
            # Create backup
            backup_path = f"{filepath}.bak3"
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
    """Find and migrate ALL files with next-auth"""
    src_dir = Path("src")
    
    # Find all TS/TSX files with next-auth
    files_to_migrate = []
    for ext in ["*.ts", "*.tsx"]:
        for filepath in src_dir.rglob(ext):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    if "next-auth" in f.read():
                        files_to_migrate.append(filepath)
            except:
                pass
    
    print(f"Found {len(files_to_migrate)} files with next-auth references\n")
    
    migrated_count = 0
    for filepath in files_to_migrate:
        if migrate_any_file(filepath):
            migrated_count += 1
    
    print(f"\n✓ Complete migration done!")
    print(f"  Migrated: {migrated_count} files")
    print(f"  Skipped: {len(files_to_migrate) - migrated_count} files")

if __name__ == "__main__":
    main()
