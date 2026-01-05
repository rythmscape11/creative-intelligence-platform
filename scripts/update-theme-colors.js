const fs = require('fs');
const path = require('path');

const files = [
  'src/components/strategy/enhanced-steps/market-context-step.tsx',
  'src/components/strategy/enhanced-steps/objectives-step.tsx',
  'src/components/strategy/enhanced-steps/resources-step.tsx',
  'src/components/strategy/enhanced-steps/channels-step.tsx',
  'src/components/strategy/enhanced-steps/context-step.tsx',
];

const replacements = [
  // Text colors
  { from: /text-text-primary/g, to: 'text-white' },
  { from: /text-text-secondary/g, to: 'text-gray-300' },
  { from: /text-text-tertiary/g, to: 'text-gray-400' },
  
  // Background colors
  { from: /bg-bg-primary/g, to: 'bg-black' },
  { from: /bg-bg-secondary/g, to: 'bg-black' },
  { from: /bg-bg-tertiary/g, to: 'bg-[#2A2A2A]' },
  { from: /bg-bg-elevated/g, to: 'bg-[#2A2A2A]' },
  { from: /bg-bg-hover/g, to: 'bg-[#3A3A3A]' },
  
  // Border colors
  { from: /border-border-primary/g, to: 'border-[#2A2A2A]' },
  { from: /border-border-secondary/g, to: 'border-[#3A3A3A]' },
  
  // Accent colors - order matters!
  { from: /hover:bg-accent-secondary\/90/g, to: 'hover:bg-[#D97706]' },
  { from: /bg-accent-secondary/g, to: 'bg-[#F59E0B]' },
  { from: /focus:ring-accent-secondary/g, to: 'focus:ring-[#F59E0B]' },
  { from: /focus:border-accent-secondary/g, to: 'focus:border-[#F59E0B]' },
  { from: /text-accent-secondary/g, to: 'text-[#F59E0B]' },
  { from: /border-accent-secondary/g, to: 'border-[#F59E0B]' },
  
  // Placeholder colors
  { from: /placeholder:text-text-tertiary/g, to: 'placeholder:text-gray-500' },
  
  // Hover text colors
  { from: /hover:text-text-primary/g, to: 'hover:text-white' },
];

files.forEach(filePath => {
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${filePath}`);
});

console.log('\n✅ All files updated successfully!');

