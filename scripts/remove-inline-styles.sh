#!/bin/bash

# Script to remove inline CSS variable styles from Growth Suite pages
# Replaces them with proper Tailwind classes

echo "🎨 Removing inline CSS variable styles..."
echo "============================================"

# Find all Growth Suite page files
FILES=$(find src/app/growth-suite -name "*.tsx" -type f)

total_changes=0

for file in $FILES; do
  echo "Processing: $file"
  changes=0
  
  # Remove style={{ color: 'var(--color-neutral-charcoal)' }} and similar
  # Replace with text-text-primary
  if grep -q "style={{ color: 'var(--color-neutral-charcoal)'" "$file"; then
    # This is complex - need to handle multiline
    perl -i -pe 's/\s*style=\{\{\s*color:\s*['"'"']var\(--color-neutral-charcoal\)['"'"']\s*\}\}//g' "$file"
    ((changes++))
  fi
  
  # Remove style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-neutral-charcoal)' }}
  if grep -q "fontFamily: 'var(--font-family-display)'" "$file"; then
    perl -i -pe 's/\s*style=\{\{\s*fontFamily:\s*['"'"']var\(--font-family-display\)['"'"'],?\s*color:\s*['"'"']var\(--color-neutral-charcoal\)['"'"']\s*\}\}//g' "$file"
    ((changes++))
  fi
  
  # Remove style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}
  if grep -q "opacity: 0.7" "$file"; then
    perl -i -pe 's/\s*style=\{\{\s*color:\s*['"'"']var\(--color-neutral-charcoal\)['"'"'],\s*opacity:\s*0\.7\s*\}\}//g' "$file"
    ((changes++))
  fi
  
  # Remove style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}
  if grep -q "opacity: 0.6" "$file"; then
    perl -i -pe 's/\s*style=\{\{\s*color:\s*['"'"']var\(--color-neutral-charcoal\)['"'"'],\s*opacity:\s*0\.6\s*\}\}//g' "$file"
    ((changes++))
  fi
  
  # Remove style={{ color: 'var(--color-primary-yellow)' }}
  if grep -q "var(--color-primary-yellow)" "$file"; then
    perl -i -pe 's/\s*style=\{\{\s*color:\s*['"'"']var\(--color-primary-yellow[^}]*\}\}//g' "$file"
    ((changes++))
  fi
  
  # Remove style={{ color: platform.color }}
  if grep -q "style={{ color: platform.color }}" "$file"; then
    sed -i '' 's/style={{ color: platform\.color }}//g' "$file"
    ((changes++))
  fi
  
  # Remove style={{ backgroundColor: 'var(--color-primary-*' }}
  if grep -q "backgroundColor: 'var(--color-primary" "$file"; then
    perl -i -pe 's/\s*style=\{\{\s*backgroundColor:\s*['"'"']var\(--color-primary[^}]*\}\}//g' "$file"
    ((changes++))
  fi
  
  # Remove style={{ borderColor: 'var(--color-primary-yellow)', color: 'var(--color-neutral-charcoal)' }}
  if grep -q "borderColor: 'var(--color-primary-yellow)'" "$file"; then
    perl -i -pe 's/\s*style=\{\{\s*borderColor:\s*['"'"']var\(--color-primary-yellow\)['"'"'],\s*color:\s*['"'"']var\(--color-neutral-charcoal\)['"'"']\s*\}\}//g' "$file"
    ((changes++))
  fi
  
  # Remove multiline style attributes
  if grep -q "style={{" "$file"; then
    # Use perl to handle multiline replacements
    perl -i -0pe 's/\s*style=\{\{\s*[^}]*\}\}//gs' "$file"
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
echo "🎨 Inline styles removed!"
echo ""
echo "⚠️  Note: You may need to add proper Tailwind classes where styles were removed"

