#!/bin/bash

# Script to fix dark theme colors in all 30 enhanced tool pages
# Replaces light theme colors with dark theme compatible colors

# Color replacements for dark theme compatibility
declare -A replacements=(
  ["bg-amber-100"]="bg-amber-500/10"
  ["text-amber-700"]="text-amber-600 dark:text-amber-400"
  ["bg-white"]="bg-bg-secondary"
  ["text-gray-900"]="text-text-primary"
  ["text-gray-600"]="text-text-secondary"
  ["text-gray-500"]="text-text-secondary"
  ["border-gray-200"]="border-border-primary"
  ["border-gray-300"]="border-border-primary"
  ["bg-gray-50"]="bg-bg-tertiary"
  ["bg-gray-100"]="bg-bg-secondary"
)

# Find all enhanced tool pages
tool_pages=$(find src/app/tools -name "*-enhanced" -type d)

echo "Found tool pages to fix:"
echo "$tool_pages"
echo ""
echo "Starting dark theme fixes..."

for dir in $tool_pages; do
  page_file="$dir/page.tsx"
  
  if [ -f "$page_file" ]; then
    echo "Processing: $page_file"
    
    # Create backup
    cp "$page_file" "$page_file.backup"
    
    # Apply replacements
    for old in "${!replacements[@]}"; do
      new="${replacements[$old]}"
      # Use perl for more reliable replacement
      perl -i -pe "s/$old/$new/g" "$page_file"
    done
    
    echo "  ✓ Fixed dark theme colors"
  fi
done

echo ""
echo "Dark theme fixes complete!"
echo "Backup files created with .backup extension"
echo "Review changes and remove backups if satisfied"

