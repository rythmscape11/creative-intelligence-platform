#!/bin/bash

# Script to fix all Jest references to Vitest in test files

echo "🔧 Fixing test framework references from Jest to Vitest..."

# Find all test files with jest references
TEST_FILES=$(grep -rl "jest\." __tests__/ 2>/dev/null || true)

if [ -z "$TEST_FILES" ]; then
  echo "✅ No jest references found in test files"
  exit 0
fi

# Replace jest with vi in all test files
for file in $TEST_FILES; do
  echo "Fixing: $file"
  
  # Replace jest.mock with vi.mock
  sed -i '' 's/jest\.mock/vi.mock/g' "$file"
  
  # Replace jest.fn with vi.fn
  sed -i '' 's/jest\.fn/vi.fn/g' "$file"
  
  # Replace jest.Mock with vi.Mock
  sed -i '' 's/jest\.Mock/vi.Mock/g' "$file"
  
  # Replace jest.Mocked with vi.Mocked  
  sed -i '' 's/jest\.Mocked/vi.Mocked/g' "$file"
  
  # Replace jest.MockedFunction with vi.MockedFunction
  sed -i '' 's/jest\.MockedFunction/vi.MockedFunction/g' "$file"
  
  # Replace jest.spyOn with vi.spyOn
  sed -i '' 's/jest\.spyOn/vi.spyOn/g' "$file"
  
  # Add vitest imports if not present
  if ! grep -q "from 'vitest'" "$file"; then
    # Check if file has imports
    if grep -q "^import" "$file"; then
      # Add after first import
      sed -i '' "1a\\
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';\\
" "$file"
    fi
  fi
done

echo "✅ Fixed all test files!"
echo ""
echo "Files modified:"
echo "$TEST_FILES"

