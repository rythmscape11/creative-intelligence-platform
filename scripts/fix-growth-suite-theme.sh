#!/bin/bash

# Script to fix Growth Suite theme consistency
# Converts light theme elements to dark theme

echo "🎨 Fixing Growth Suite Theme Consistency..."
echo "============================================"

# Find all Growth Suite page files
FILES=$(find src/app/growth-suite -name "page.tsx" -type f)

total_changes=0

for file in $FILES; do
  echo "Processing: $file"
  changes=0
  
  # Replace bg-gradient-mesh with bg-bg-primary
  if grep -q "bg-gradient-mesh" "$file"; then
    sed -i '' 's/bg-gradient-mesh/bg-bg-primary/g' "$file"
    ((changes++))
  fi
  
  # Replace glass-card with bg-bg-secondary border border-border-primary rounded-lg
  if grep -q "glass-card" "$file"; then
    sed -i '' 's/glass-card/bg-bg-secondary border border-border-primary rounded-lg/g' "$file"
    ((changes++))
  fi
  
  # Replace accent-secondary with [#F59E0B] for backgrounds
  if grep -q "bg-accent-secondary" "$file"; then
    sed -i '' 's/bg-accent-secondary/bg-[#F59E0B]/g' "$file"
    ((changes++))
  fi
  
  # Replace accent-secondary with [#F59E0B] for text colors
  if grep -q "text-accent-secondary" "$file"; then
    sed -i '' 's/text-accent-secondary/text-[#F59E0B]/g' "$file"
    ((changes++))
  fi
  
  # Replace text-white on amber backgrounds with text-black
  if grep -q 'bg-\[#F59E0B\].*text-white' "$file" || grep -q 'text-white.*bg-\[#F59E0B\]' "$file"; then
    # This is complex, will need manual fix
    echo "  ⚠️  Manual fix needed: text-white on amber background"
  fi
  
  # Replace card-pastel-* with bg-bg-tertiary border border-border-primary
  if grep -q "card-pastel-" "$file"; then
    sed -i '' 's/card-pastel-[a-z]*/bg-bg-tertiary border border-border-primary/g' "$file"
    ((changes++))
  fi
  
  # Replace btn btn-primary with proper button classes
  if grep -q "btn btn-primary" "$file"; then
    sed -i '' 's/btn btn-primary/bg-[#F59E0B] text-black hover:bg-[#D97706] rounded-lg px-4 py-2 flex items-center gap-2 transition-all font-semibold/g' "$file"
    ((changes++))
  fi
  
  # Replace old color variables with dark theme colors
  # text-green-600 -> text-green-400
  if grep -q "text-green-600" "$file"; then
    sed -i '' 's/text-green-600/text-green-400/g' "$file"
    ((changes++))
  fi
  
  # text-red-600 -> text-red-400
  if grep -q "text-red-600" "$file"; then
    sed -i '' 's/text-red-600/text-red-400/g' "$file"
    ((changes++))
  fi
  
  # text-yellow-600 -> text-yellow-400
  if grep -q "text-yellow-600" "$file"; then
    sed -i '' 's/text-yellow-600/text-yellow-400/g' "$file"
    ((changes++))
  fi
  
  # text-blue-600 -> text-blue-400
  if grep -q "text-blue-600" "$file"; then
    sed -i '' 's/text-blue-600/text-blue-400/g' "$file"
    ((changes++))
  fi
  
  # text-green-500 -> text-green-400
  if grep -q "text-green-500" "$file"; then
    sed -i '' 's/text-green-500/text-green-400/g' "$file"
    ((changes++))
  fi
  
  # text-red-500 -> text-red-400
  if grep -q "text-red-500" "$file"; then
    sed -i '' 's/text-red-500/text-red-400/g' "$file"
    ((changes++))
  fi
  
  # bg-blue-50 -> bg-blue-500/10
  if grep -q "bg-blue-50" "$file"; then
    sed -i '' 's/bg-blue-50/bg-blue-500\/10/g' "$file"
    ((changes++))
  fi
  
  # bg-green-50 -> bg-green-500/10
  if grep -q "bg-green-50" "$file"; then
    sed -i '' 's/bg-green-50/bg-green-500\/10/g' "$file"
    ((changes++))
  fi
  
  # bg-amber-50 -> bg-[#F59E0B]/10
  if grep -q "bg-amber-50" "$file"; then
    sed -i '' 's/bg-amber-50/bg-[#F59E0B]\/10/g' "$file"
    ((changes++))
  fi
  
  # border-amber-500 -> border-[#F59E0B]
  if grep -q "border-amber-500" "$file"; then
    sed -i '' 's/border-amber-500/border-[#F59E0B]/g' "$file"
    ((changes++))
  fi
  
  # bg-white with opacity -> bg-bg-tertiary
  if grep -q "bg-white bg-opacity" "$file"; then
    sed -i '' 's/bg-white bg-opacity-[0-9]*/bg-bg-tertiary/g' "$file"
    ((changes++))
  fi
  
  # hover:bg-opacity -> hover:bg-bg-hover
  if grep -q "hover:bg-opacity" "$file"; then
    sed -i '' 's/hover:bg-opacity-[0-9]*/hover:bg-bg-hover/g' "$file"
    ((changes++))
  fi
  
  total_changes=$((total_changes + changes))
  
  if [ $changes -gt 0 ]; then
    echo "  ✅ Made $changes replacements"
  else
    echo "  ℹ️  No changes needed"
  fi
done

echo ""
echo "============================================"
echo "✅ Total changes made: $total_changes"
echo "🎨 Growth Suite theme consistency fixed!"
echo ""
echo "⚠️  Note: Some files may need manual review for:"
echo "   - Inline style attributes with CSS variables"
echo "   - Complex color combinations"
echo "   - Text color on amber backgrounds (should be text-black)"

