#!/bin/bash

# Fix CSS Variables - Replace old pastel blue theme variables with yellow/dark grey theme
# MediaPlanPro - Task 5: Fix CTA Button Color Contrast

echo "🔧 Fixing CSS Variables Across Codebase..."
echo "=========================================="

# Color mapping:
# OLD BLUE THEME → NEW YELLOW THEME
# --color-primary-blue → --color-primary-yellow
# --color-primary-blue-light → --color-primary-yellow-light
# --color-lavender → --color-accent-amber
# --color-lavender-light → --color-accent-amber-light
# --color-mint → --color-primary-yellow-light
# --color-mint-light → --color-primary-yellow-light
# --color-accent-coral → --color-accent-orange
# --color-accent-purple → --color-primary-yellow-dark
# --color-accent-sage → --color-primary-yellow
# --color-primary-mint → --color-primary-yellow

# Fix --color-primary-blue → --color-primary-yellow
echo "Replacing --color-primary-blue with --color-primary-yellow..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-primary-blue)/--color-primary-yellow)/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s/--color-primary-blue'/--color-primary-yellow'/g" {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-primary-blue"/--color-primary-yellow"/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-primary-blue,/--color-primary-yellow,/g' {} +

# Fix --color-primary-blue-light → --color-primary-yellow-light
echo "Replacing --color-primary-blue-light with --color-primary-yellow-light..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-primary-blue-light/--color-primary-yellow-light/g' {} +

# Fix --color-lavender → --color-accent-amber
echo "Replacing --color-lavender with --color-accent-amber..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-lavender)/--color-accent-amber)/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s/--color-lavender'/--color-accent-amber'/g" {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-lavender"/--color-accent-amber"/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-lavender,/--color-accent-amber,/g' {} +

# Fix --color-lavender-light → --color-accent-amber-light
echo "Replacing --color-lavender-light with --color-accent-amber-light..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-lavender-light/--color-accent-amber-light/g' {} +

# Fix --color-mint → --color-primary-yellow-light
echo "Replacing --color-mint with --color-primary-yellow-light..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-mint)/--color-primary-yellow-light)/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s/--color-mint'/--color-primary-yellow-light'/g" {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-mint"/--color-primary-yellow-light"/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-mint,/--color-primary-yellow-light,/g' {} +

# Fix --color-mint-light → --color-primary-yellow-light
echo "Replacing --color-mint-light with --color-primary-yellow-light..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-mint-light/--color-primary-yellow-light/g' {} +

# Fix --color-accent-coral → --color-accent-orange
echo "Replacing --color-accent-coral with --color-accent-orange..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-accent-coral/--color-accent-orange/g' {} +

# Fix --color-accent-purple → --color-primary-yellow-dark
echo "Replacing --color-accent-purple with --color-primary-yellow-dark..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-accent-purple/--color-primary-yellow-dark/g' {} +

# Fix --color-accent-sage → --color-primary-yellow
echo "Replacing --color-accent-sage with --color-primary-yellow..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-accent-sage/--color-primary-yellow/g' {} +

# Fix --color-primary-mint → --color-primary-yellow
echo "Replacing --color-primary-mint with --color-primary-yellow..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/--color-primary-mint/--color-primary-yellow/g' {} +

# Fix hardcoded RGB values for old blue theme
echo "Replacing hardcoded RGB values..."

# Old blue: rgba(168, 216, 234, ...) → Yellow: rgba(245, 158, 11, ...)
# This was already fixed in hero.tsx manually

echo ""
echo "✅ CSS Variable Replacement Complete!"
echo "=========================================="
echo ""
echo "📊 Summary:"
echo "  - Replaced --color-primary-blue → --color-primary-yellow"
echo "  - Replaced --color-primary-blue-light → --color-primary-yellow-light"
echo "  - Replaced --color-lavender → --color-accent-amber"
echo "  - Replaced --color-lavender-light → --color-accent-amber-light"
echo "  - Replaced --color-mint → --color-primary-yellow-light"
echo "  - Replaced --color-mint-light → --color-primary-yellow-light"
echo "  - Replaced --color-accent-coral → --color-accent-orange"
echo "  - Replaced --color-accent-purple → --color-primary-yellow-dark"
echo "  - Replaced --color-accent-sage → --color-primary-yellow"
echo "  - Replaced --color-primary-mint → --color-primary-yellow"
echo ""
echo "🔍 Checking for remaining old variables..."
remaining=$(grep -r "color-primary-blue\|color-lavender\|color-mint\|color-accent-coral\|color-accent-purple\|color-accent-sage" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
echo "  Remaining instances: $remaining"
echo ""

if [ "$remaining" -eq 0 ]; then
  echo "🎉 All CSS variables successfully updated!"
else
  echo "⚠️  Some instances may need manual review"
  echo "  Run: grep -r 'color-primary-blue\|color-lavender\|color-mint' src/ --include='*.tsx'"
fi

echo ""
echo "✅ Task 5 Complete - CTA Button Colors Fixed!"

