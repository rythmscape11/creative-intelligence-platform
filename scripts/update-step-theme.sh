#!/bin/bash

# Script to update Strategy Builder step components to black theme

FILES=(
  "src/components/strategy/enhanced-steps/market-context-step.tsx"
  "src/components/strategy/enhanced-steps/objectives-step.tsx"
  "src/components/strategy/enhanced-steps/resources-step.tsx"
  "src/components/strategy/enhanced-steps/channels-step.tsx"
  "src/components/strategy/enhanced-steps/context-step.tsx"
)

for file in "${FILES[@]}"; do
  echo "Updating $file..."
  
  # Text colors
  sed -i '' 's/text-text-primary/text-white/g' "$file"
  sed -i '' 's/text-text-secondary/text-gray-300/g' "$file"
  sed -i '' 's/text-text-tertiary/text-gray-400/g' "$file"
  
  # Background colors
  sed -i '' 's/bg-bg-primary/bg-black/g' "$file"
  sed -i '' 's/bg-bg-secondary/bg-black/g' "$file"
  sed -i '' 's/bg-bg-tertiary/bg-\[#2A2A2A\]/g' "$file"
  sed -i '' 's/bg-bg-elevated/bg-\[#2A2A2A\]/g' "$file"
  sed -i '' 's/bg-bg-hover/bg-\[#3A3A3A\]/g' "$file"
  
  # Border colors
  sed -i '' 's/border-border-primary/border-\[#2A2A2A\]/g' "$file"
  sed -i '' 's/border-border-secondary/border-\[#3A3A3A\]/g' "$file"
  
  # Accent colors
  sed -i '' 's/bg-accent-secondary/bg-\[#F59E0B\]/g' "$file"
  sed -i '' 's/hover:bg-accent-secondary\/90/hover:bg-\[#D97706\]/g' "$file"
  sed -i '' 's/focus:ring-accent-secondary/focus:ring-\[#F59E0B\]/g' "$file"
  sed -i '' 's/focus:border-accent-secondary/focus:border-\[#F59E0B\]/g' "$file"
  sed -i '' 's/text-accent-secondary/text-\[#F59E0B\]/g' "$file"
  sed -i '' 's/border-accent-secondary/border-\[#F59E0B\]/g' "$file"
  
  # Placeholder colors
  sed -i '' 's/placeholder:text-text-tertiary/placeholder:text-gray-500/g' "$file"
  
  echo "✓ Updated $file"
done

echo ""
echo "All step components updated to black theme!"

