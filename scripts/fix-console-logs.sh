#!/bin/bash

# Automated Console.log Replacement Script
# This script replaces console.log/error/warn with logger service calls

set -e

echo "🔧 Starting console.log replacement..."

# List of files to process (API routes - highest priority)
API_FILES=(
  "src/app/api/admin/users/bulk-role/route.ts"
  "src/app/api/admin/activity/route.ts"
  "src/app/api/strategies/route.ts"
  "src/app/api/strategies/[id]/route.ts"
  "src/app/api/strategies/enhanced/route.ts"
  "src/app/api/strategies/create-enhanced/route.ts"
  "src/app/api/auth/register/route.ts"
  "src/app/api/image-proxy/route.ts"
  "src/app/api/growth-suite/attribution/report/route.ts"
  "src/app/api/growth-suite/usage/route.ts"
)

# Function to add logger import if not present
add_logger_import() {
  local file=$1
  if ! grep -q "import { logger } from '@/lib/services/logger-service';" "$file"; then
    # Find the last import line
    last_import=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
    if [ -n "$last_import" ]; then
      sed -i.bak "${last_import}a\\
import { logger } from '@/lib/services/logger-service';
" "$file"
      echo "  ✓ Added logger import to $file"
    fi
  fi
}

# Function to replace console statements
replace_console() {
  local file=$1
  
  # Replace console.error
  sed -i.bak "s/console\.error('\([^']*\):', error);/logger.error('\1', error as Error);/g" "$file"
  sed -i.bak 's/console\.error("\([^"]*\):", error);/logger.error("\1", error as Error);/g' "$file"
  sed -i.bak "s/console\.error('\([^']*\)');/logger.error('\1');/g" "$file"
  sed -i.bak 's/console\.error("\([^"]*\)");/logger.error("\1");/g' "$file"
  
  # Replace console.log
  sed -i.bak "s/console\.log('\([^']*\):', \([^)]*\));/logger.info('\1', { data: \2 });/g" "$file"
  sed -i.bak 's/console\.log("\([^"]*\):", \([^)]*\));/logger.info("\1", { data: \2 });/g' "$file"
  sed -i.bak "s/console\.log('\([^']*\)');/logger.info('\1');/g" "$file"
  sed -i.bak 's/console\.log("\([^"]*\)");/logger.info("\1");/g' "$file"
  
  # Replace console.warn
  sed -i.bak "s/console\.warn('\([^']*\):', \([^)]*\));/logger.warn('\1', { data: \2 });/g" "$file"
  sed -i.bak 's/console\.warn("\([^"]*\):", \([^)]*\));/logger.warn("\1", { data: \2 });/g' "$file"
  sed -i.bak "s/console\.warn('\([^']*\)');/logger.warn('\1');/g" "$file"
  sed -i.bak 's/console\.warn("\([^"]*\)");/logger.warn("\1");/g' "$file"
  
  echo "  ✓ Replaced console statements in $file"
}

# Process each file
for file in "${API_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    add_logger_import "$file"
    replace_console "$file"
    # Remove backup files
    rm -f "${file}.bak"
  else
    echo "  ⚠️  File not found: $file"
  fi
done

echo ""
echo "✅ Console.log replacement complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review the changes with: git diff"
echo "2. Test the build: npm run build"
echo "3. Manually fix any complex console statements that weren't caught"
echo ""

