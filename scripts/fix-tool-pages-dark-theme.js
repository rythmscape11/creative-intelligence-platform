#!/usr/bin/env node

/**
 * Script to fix dark theme colors across all 30 enhanced tool pages
 * Replaces light theme colors with dark theme compatible colors
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color replacements for dark theme compatibility
const colorReplacements = [
  // Amber colors
  { from: /bg-amber-100(?!\/)/g, to: 'bg-amber-500/10' },
  { from: /text-amber-700(?! dark:)/g, to: 'text-amber-600 dark:text-amber-400' },
  
  // Background colors
  { from: /bg-white(?! )/g, to: 'bg-bg-secondary' },
  { from: /bg-gray-50(?! )/g, to: 'bg-bg-tertiary' },
  { from: /bg-gray-100(?! )/g, to: 'bg-bg-secondary' },
  
  // Text colors
  { from: /text-gray-900(?! )/g, to: 'text-text-primary' },
  { from: /text-gray-600(?! )/g, to: 'text-text-secondary' },
  { from: /text-gray-500(?! )/g, to: 'text-text-secondary' },
  
  // Border colors
  { from: /border-gray-200(?! )/g, to: 'border-border-primary' },
  { from: /border-gray-300(?! )/g, to: 'border-border-primary' },
  
  // Gradient backgrounds (need special handling)
  { from: /from-amber-50 to-orange-50/g, to: 'from-amber-500/5 to-orange-500/5' },
];

async function fixToolPages() {
  console.log('🔍 Finding all enhanced tool pages...\n');

  // Find all enhanced tool page files
  const toolPages = glob.sync('src/app/tools/**/*-enhanced/page.tsx');
  
  console.log(`Found ${toolPages.length} tool pages to fix:\n`);
  toolPages.forEach(page => console.log(`  - ${page}`));
  console.log('');
  
  let totalFixed = 0;
  let totalReplacements = 0;
  
  for (const pagePath of toolPages) {
    console.log(`\n📝 Processing: ${pagePath}`);
    
    try {
      // Read file content
      let content = fs.readFileSync(pagePath, 'utf8');
      const originalContent = content;
      let pageReplacements = 0;
      
      // Apply all color replacements
      for (const { from, to } of colorReplacements) {
        const matches = content.match(from);
        if (matches) {
          content = content.replace(from, to);
          pageReplacements += matches.length;
          console.log(`  ✓ Replaced ${matches.length}x: ${from.source} → ${to}`);
        }
      }
      
      // Only write if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(pagePath, content, 'utf8');
        totalFixed++;
        totalReplacements += pageReplacements;
        console.log(`  ✅ Fixed ${pageReplacements} color instances`);
      } else {
        console.log(`  ⏭️  No changes needed`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error processing ${pagePath}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Dark theme fixes complete!`);
  console.log(`   Files fixed: ${totalFixed}/${toolPages.length}`);
  console.log(`   Total replacements: ${totalReplacements}`);
  console.log('');
}

// Run the script
fixToolPages().catch(console.error);

