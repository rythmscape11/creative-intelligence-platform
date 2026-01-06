#!/bin/bash

# Comprehensive script to fix all remaining session references

FILES=(
  "src/app/api/admin/leads/analytics/route.ts"
  "src/app/api/admin/leads/export/route.ts"
  "src/app/api/admin/users/bulk-role/route.ts"
  "src/app/api/admin/users/role/route.ts"
  "src/app/api/checkout/route.ts"
  "src/app/api/services/inquiry/route.ts"
  "src/app/api/strategies/[id]/export/route.ts"
  "src/app/api/strategies/[id]/share/route.ts"
  "src/app/api/strategies/[id]/versions/[versionId]/restore/route.ts"
  "src/app/api/subscriptions/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    # Replace various session patterns
    sed -i.bak2 's/if (!session ||/if (!userId \&\&/g' "$file"
    sed -i.bak2 's/if (!session &&/if (!userId \&\&/g' "$file"
    sed -i.bak2 's/session\.user\.role/userRole/g' "$file"
    sed -i.bak2 's/session?.user.role/userRole/g' "$file"
    sed -i.bak2 's/session?.user ||/userId ||/g' "$file"
    sed -i.bak2 's/!session/!userId/g' "$file"
    rm -f "$file.bak2"
  fi
done

echo "Done!"
