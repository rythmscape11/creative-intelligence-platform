#!/bin/bash

# Script to fix remaining session references in API routes

# List of files to fix
FILES=(
  "src/app/api/strategies/enhanced/route.ts"
  "src/app/api/strategies/[id]/comments/route.ts"
  "src/app/api/strategies/[id]/versions/route.ts"
  "src/app/api/strategies/[id]/duplicate/route.ts"
  "src/app/api/strategies/[id]/route.ts"
  "src/app/api/admin/strategies/route.ts"
  "src/app/api/admin/strategies/[id]/route.ts"
  "src/app/api/checkout/razorpay/route.ts"
  "src/app/api/blog/posts/bulk/route.ts"
  "src/app/api/services/inquiry/route.ts"
  "src/app/api/cache/clear/route.ts"
  "src/app/api/cache/warm/route.ts"
)

# Fix session references
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    # Replace session?.user?.id with userId check
    sed -i.bak 's/if (!session?.user?.id) {/if (!userId) {/g' "$file"
    # Replace where: { id: user?.id } with where: { id: userId }
    sed -i.bak 's/where: { id: user?.id }/where: { id: userId }/g' "$file"
    # Replace user?.id with userId in other contexts
    sed -i.bak 's/userId: user?.id/userId: userId/g' "$file"
    # Clean up backup files
    rm -f "$file.bak"
  fi
done

echo "Done fixing session references!"
