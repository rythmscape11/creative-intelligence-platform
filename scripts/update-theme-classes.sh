#!/bin/bash

# Script to update dark-only theme classes to light/dark theme classes across the codebase
# This script performs systematic replacements following the Tailwind dark mode pattern

echo "🎨 Starting theme class updates..."

# Define the files to update
FILES=(
  "src/components/home/why-mediaplanpro.tsx"
  "src/components/home/how-it-works.tsx"
  "src/components/home/features.tsx"
  "src/components/home/cta.tsx"
  "src/components/home/free-tools-section.tsx"
  "src/components/home/metrics-that-matter.tsx"
  "src/components/home/latest-blog-posts.tsx"
  "src/components/home/popular-resources.tsx"
  "src/components/home/services-section.tsx"
  "src/components/home/testimonials.tsx"
  "src/components/layout/footer.tsx"
  "src/app/page.tsx"
)

# Background color replacements
echo "📝 Updating background colors..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Primary backgrounds
    sed -i '' 's/className="\([^"]*\)bg-bg-primary\([^"]*\)"/className="\1bg-white dark:bg-bg-primary\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)bg-bg-primary\([^'"'"']*\)'"'"'/className='"'"'\1bg-white dark:bg-bg-primary\2'"'"'/g' "$file"
    
    # Secondary backgrounds
    sed -i '' 's/className="\([^"]*\)bg-bg-secondary\([^"]*\)"/className="\1bg-gray-50 dark:bg-bg-secondary\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)bg-bg-secondary\([^'"'"']*\)'"'"'/className='"'"'\1bg-gray-50 dark:bg-bg-secondary\2'"'"'/g' "$file"
    
    # Tertiary backgrounds
    sed -i '' 's/className="\([^"]*\)bg-bg-tertiary\([^"]*\)"/className="\1bg-gray-100 dark:bg-bg-tertiary\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)bg-bg-tertiary\([^'"'"']*\)'"'"'/className='"'"'\1bg-gray-100 dark:bg-bg-tertiary\2'"'"'/g' "$file"
    
    # Elevated backgrounds
    sed -i '' 's/className="\([^"]*\)bg-bg-elevated\([^"]*\)"/className="\1bg-gray-100 dark:bg-bg-elevated\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)bg-bg-elevated\([^'"'"']*\)'"'"'/className='"'"'\1bg-gray-100 dark:bg-bg-elevated\2'"'"'/g' "$file"
    
    echo "✅ Updated backgrounds in $file"
  fi
done

# Text color replacements
echo "📝 Updating text colors..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Primary text
    sed -i '' 's/className="\([^"]*\)text-text-primary\([^"]*\)"/className="\1text-gray-900 dark:text-text-primary\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)text-text-primary\([^'"'"']*\)'"'"'/className='"'"'\1text-gray-900 dark:text-text-primary\2'"'"'/g' "$file"
    
    # Secondary text
    sed -i '' 's/className="\([^"]*\)text-text-secondary\([^"]*\)"/className="\1text-gray-600 dark:text-text-secondary\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)text-text-secondary\([^'"'"']*\)'"'"'/className='"'"'\1text-gray-600 dark:text-text-secondary\2'"'"'/g' "$file"
    
    # Tertiary text
    sed -i '' 's/className="\([^"]*\)text-text-tertiary\([^"]*\)"/className="\1text-gray-500 dark:text-text-tertiary\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)text-text-tertiary\([^'"'"']*\)'"'"'/className='"'"'\1text-gray-500 dark:text-text-tertiary\2'"'"'/g' "$file"
    
    echo "✅ Updated text colors in $file"
  fi
done

# Border color replacements
echo "📝 Updating border colors..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Primary borders
    sed -i '' 's/className="\([^"]*\)border-border-primary\([^"]*\)"/className="\1border-gray-200 dark:border-border-primary\2"/g' "$file"
    sed -i '' 's/className='"'"'\([^'"'"']*\)border-border-primary\([^'"'"']*\)'"'"'/className='"'"'\1border-gray-200 dark:border-border-primary\2'"'"'/g' "$file"
    
    echo "✅ Updated borders in $file"
  fi
done

echo "✨ Theme class updates complete!"

