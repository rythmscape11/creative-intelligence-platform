#!/bin/bash
# Batch migration script to replace NextAuth with Clerk hooks

# Find all TypeScript/TSX files with next-auth imports
FILES=$(find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec grep -l "from 'next-auth/react'" {} \;)

echo "Found files to migrate:"
echo "$FILES"
echo ""
echo "Total files: $(echo "$FILES" | wc -l)"

# For each file, perform the replacements
for file in $FILES; do
  echo "Processing: $file"
  
  # Backup original file
  cp "$file" "$file.bak"
  
  # Replace imports
  sed -i '' "s/import { useSession } from 'next-auth\/react'/import { useUser } from '@clerk\/nextjs'/g" "$file"
  sed -i '' "s/import { useSession, signOut } from 'next-auth\/react'/import { useUser, useClerk } from '@clerk\/nextjs'/g" "$file"
  sed -i '' "s/import { signOut } from 'next-auth\/react'/import { useClerk } from '@clerk\/nextjs'/g" "$file"
  
  # Replace useSession hook
  sed -i '' "s/const { data: session, status } = useSession()/const { user, isLoaded, isSignedIn } = useUser()/g" "$file"
  sed -i '' "s/const { data: session } = useSession()/const { user } = useUser()/g" "$file"
  
  # Add useClerk if signOut is used
  if grep -q "signOut(" "$file"; then
    # Check if useClerk is already imported
    if ! grep -q "useClerk" "$file"; then
      sed -i '' "s/import { useUser } from '@clerk\/nextjs'/import { useUser, useClerk } from '@clerk\/nextjs'/g" "$file"
    fi
    # Add const { signOut } = useClerk() after useUser
    sed -i '' "/const { user.*useUser()/a\\
  const { signOut } = useClerk();
" "$file"
  fi
  
  echo "  ✓ Completed: $file"
done

echo ""
echo "Migration complete! Backup files created with .bak extension"
echo "Review the changes and delete .bak files when satisfied"
