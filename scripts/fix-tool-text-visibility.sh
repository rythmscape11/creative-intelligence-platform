#!/bin/bash

# Script to fix text visibility issues in tool pages
# Converts light theme colors to dark theme colors

echo "🎨 Fixing text visibility in tool pages..."
echo "=========================================="

# Find all tool page.tsx files
TOOL_FILES=$(find src/app/tools -name "page.tsx" -type f)

# Counter for changes
TOTAL_FILES=0
TOTAL_CHANGES=0

for file in $TOOL_FILES; do
  CHANGES_IN_FILE=0
  
  # Backup original file
  cp "$file" "$file.bak"
  
  # Replace light theme text colors with dark theme colors
  # Text colors
  sed -i '' 's/text-gray-900/text-text-primary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-gray-800/text-text-primary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-gray-700/text-text-secondary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-gray-600/text-text-secondary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-gray-500/text-text-tertiary/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Background colors
  sed -i '' 's/bg-gray-50/bg-bg-tertiary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-gray-100/bg-bg-tertiary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-white/bg-bg-secondary/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Border colors
  sed -i '' 's/border-gray-200/border-border-primary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-gray-300/border-border-primary/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Amber/Yellow colors for info boxes
  sed -i '' 's/text-amber-900/text-\[#F59E0B\]/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-amber-800/text-text-secondary/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-amber-50/bg-\[#F59E0B\]\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-amber-200/border-\[#F59E0B\]\/30/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Green colors
  sed -i '' 's/text-green-900/text-green-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-green-800/text-green-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-green-600/text-green-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-green-50/bg-green-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-green-100/bg-green-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-green-200/border-green-500\/30/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Red colors
  sed -i '' 's/text-red-900/text-red-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-red-800/text-red-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-red-600/text-red-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-red-50/bg-red-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-red-100/bg-red-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-red-200/border-red-500\/30/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Yellow colors
  sed -i '' 's/text-yellow-900/text-yellow-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-yellow-800/text-yellow-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-yellow-600/text-yellow-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-yellow-50/bg-yellow-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-yellow-100/bg-yellow-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-yellow-200/border-yellow-500\/30/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Blue colors
  sed -i '' 's/text-blue-900/text-blue-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-blue-800/text-blue-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-blue-600/text-blue-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-blue-50/bg-blue-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-blue-100/bg-blue-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-blue-200/border-blue-500\/30/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Purple colors
  sed -i '' 's/text-purple-900/text-purple-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-purple-800/text-purple-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-purple-600/text-purple-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-purple-50/bg-purple-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-purple-100/bg-purple-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-purple-200/border-purple-500\/30/g' "$file" && ((CHANGES_IN_FILE++))
  
  # Orange colors
  sed -i '' 's/text-orange-900/text-orange-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-orange-800/text-orange-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/text-orange-600/text-orange-400/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-orange-50/bg-orange-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/bg-orange-100/bg-orange-500\/10/g' "$file" && ((CHANGES_IN_FILE++))
  sed -i '' 's/border-orange-200/border-orange-500\/30/g' "$file" && ((CHANGES_IN_FILE++))
  
  if [ $CHANGES_IN_FILE -gt 0 ]; then
    echo "✅ Fixed: $file ($CHANGES_IN_FILE changes)"
    ((TOTAL_FILES++))
    TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGES_IN_FILE))
    # Remove backup
    rm "$file.bak"
  else
    # No changes, restore backup
    mv "$file.bak" "$file"
  fi
done

echo "=========================================="
echo "✅ Complete!"
echo "Files modified: $TOTAL_FILES"
echo "Total changes: $TOTAL_CHANGES"

