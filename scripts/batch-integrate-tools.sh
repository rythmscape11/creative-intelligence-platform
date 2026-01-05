#!/bin/bash

# Batch script to help track which enhanced pages still need tool interface integration

echo "🔍 Checking integration status..."
echo ""

# Count total enhanced pages
total=$(find src/app/tools -name "*-enhanced" -type d | wc -l | tr -d ' ')
echo "📊 Total enhanced pages: $total"

# Count pages with UsageLimitBanner (integrated)
integrated=$(grep -l "UsageLimitBanner" src/app/tools/*/*-enhanced/page.tsx | wc -l | tr -d ' ')
echo "✅ Pages with tool interface: $integrated"

# Calculate remaining
remaining=$((total - integrated))
echo "❌ Pages still needing integration: $remaining"
echo ""

# List pages that still need integration
echo "📋 Pages needing integration:"
for file in src/app/tools/*/*-enhanced/page.tsx; do
  if ! grep -q "UsageLimitBanner" "$file"; then
    basename $(dirname $file)
  fi
done | sort

echo ""
echo "Progress: $integrated/$total ($(( integrated * 100 / total ))%)"

