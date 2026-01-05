#!/usr/bin/env python3
"""
Migration script for server-side NextAuth to Clerk
Handles getServerSession -> auth() conversion
"""

import re
from pathlib import Path

def migrate_server_file(filepath):
    """Migrate a server component from NextAuth to Clerk"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace imports
        content = re.sub(
            r"import\s*{\s*getServerSession\s*}\s*from\s*['\"]next-auth['\"];?",
            "import { auth } from '@clerk/nextjs/server';",
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
        
        # Replace session checks
        content = re.sub(
            r"if\s*\(\s*!session\s*\)\s*{",
            "if (!userId) {",
            content
        )
        
        # Replace session.user.role checks - need to fetch user from DB
        # Add prisma import if not present and role check is needed
        if "session.user.role" in content and "import { prisma }" not in content:
            # Add prisma import after other imports
            content = re.sub(
                r"(import.*?from.*?;\n)",
                r"\1import { prisma } from '@/lib/prisma';\n",
                content,
                count=1
            )
        
        # Replace role checks with database lookup
        content = re.sub(
            r"if\s*\(\s*session\.user\.role\s*!==\s*['\"]ADMIN['\"]\s*\)\s*{",
            """const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') {""",
            content
        )
        
        # Only write if changed
        if content != original_content:
            # Create backup
            backup_path = f"{filepath}.bak2"
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
    """Find and migrate server component files"""
    admin_dir = Path("src/app/(admin)/admin")
    
    # Find all page.tsx files with getServerSession
    files_to_migrate = []
    for filepath in admin_dir.rglob("page.tsx"):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                if "getServerSession" in f.read():
                    files_to_migrate.append(filepath)
        except:
            pass
    
    # Also check clear-cookies page
    clear_cookies = Path("src/app/clear-cookies/page.tsx")
    if clear_cookies.exists():
        try:
            with open(clear_cookies, 'r', encoding='utf-8') as f:
                if "next-auth" in f.read():
                    files_to_migrate.append(clear_cookies)
        except:
            pass
    
    print(f"Found {len(files_to_migrate)} server files to migrate\n")
    
    migrated_count = 0
    for filepath in files_to_migrate:
        if migrate_server_file(filepath):
            migrated_count += 1
    
    print(f"\n✓ Server migration complete!")
    print(f"  Migrated: {migrated_count} files")
    print(f"  Skipped: {len(files_to_migrate) - migrated_count} files")

if __name__ == "__main__":
    main()
