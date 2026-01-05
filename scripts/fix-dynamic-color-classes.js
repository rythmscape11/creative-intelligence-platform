#!/usr/bin/env node

/**
 * Script to fix dynamic Tailwind color classes that don't work with JIT
 * and create light theme backgrounds on dark theme pages
 * 
 * Converts:
 * - bg-${color}-50 → bg-${color}-500/10
 * - border-${color}-200 → border-${color}-500/30
 * - text-${color}-600 → text-${color}-400
 * 
 * By converting getScoreColor() to return objects instead of strings
 */

const fs = require('fs');

const filesToFix = [
  'src/app/tools/content/email-subject-tester-enhanced/page.tsx',
  'src/app/tools/social/engagement-calculator-enhanced/page.tsx',
  'src/app/tools/social/social-audit-tool-enhanced/page.tsx',
  'src/app/tools/advertising/landing-page-analyzer-enhanced/page.tsx',
  'src/app/tools/seo/page-speed-analyzer-enhanced/page.tsx',
  'src/app/tools/seo/backlink-checker-enhanced/page.tsx',
  'src/app/tools/email/spam-score-checker-enhanced/page.tsx',
];

function fixDynamicColors(filePath) {
  console.log(`\n📝 Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changes = 0;
    
    // Pattern 1: Fix getScoreColor function to return object
    const getScoreColorPattern = /const getScoreColor = \(score: number\) => \{[\s\S]*?return '[^']+';[\s\S]*?\};/;
    
    if (getScoreColorPattern.test(content)) {
      content = content.replace(
        getScoreColorPattern,
        `const getScoreColor = (score: number) => {
    if (score >= 80) return {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
    };
    if (score >= 60) return {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    };
    if (score >= 40) return {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
    };
    return {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
    };
  };`
      );
      changes++;
      console.log('  ✓ Fixed getScoreColor function');
    }
    
    // Pattern 2: Fix scoreColor variable assignment
    const scoreColorVarPattern = /const scoreColor = result \? getScoreColor\([^)]+\) : '[^']+';/;
    
    if (scoreColorVarPattern.test(content)) {
      content = content.replace(
        scoreColorVarPattern,
        `const scoreColor = result ? getScoreColor(result.score) : {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
  };`
      );
      changes++;
      console.log('  ✓ Fixed scoreColor variable');
    }
    
    // Pattern 3: Fix dynamic className with bg-${color}-50
    const dynamicBgPattern = /className=\{`([^`]*?)bg-\$\{[^}]+\}-50([^`]*?)`\}/g;
    
    if (dynamicBgPattern.test(content)) {
      content = content.replace(
        dynamicBgPattern,
        (match, before, after) => {
          // Extract the variable name
          const varMatch = match.match(/\$\{([^}]+)\}/);
          if (varMatch) {
            const varName = varMatch[1];
            return `className={\`${before}\${${varName}.bg}${after}\`}`;
          }
          return match;
        }
      );
      changes++;
      console.log('  ✓ Fixed dynamic bg classes');
    }
    
    // Pattern 4: Fix dynamic className with border-${color}-200
    const dynamicBorderPattern = /border-\$\{[^}]+\}-200/g;
    
    if (dynamicBorderPattern.test(content)) {
      content = content.replace(
        dynamicBorderPattern,
        (match) => {
          const varMatch = match.match(/\$\{([^}]+)\}/);
          if (varMatch) {
            const varName = varMatch[1];
            return `\${${varName}.border}`;
          }
          return match;
        }
      );
      changes++;
      console.log('  ✓ Fixed dynamic border classes');
    }
    
    // Pattern 5: Fix dynamic className with text-${color}-600
    const dynamicTextPattern = /text-\$\{[^}]+\}-600/g;
    
    if (dynamicTextPattern.test(content)) {
      content = content.replace(
        dynamicTextPattern,
        (match) => {
          const varMatch = match.match(/\$\{([^}]+)\}/);
          if (varMatch) {
            const varName = varMatch[1];
            return `\${${varName}.text}`;
          }
          return match;
        }
      );
      changes++;
      console.log('  ✓ Fixed dynamic text classes');
    }
    
    // Pattern 6: Fix ratingColors object (for engagement calculator)
    const ratingColorsPattern = /const ratingColors = \{[\s\S]*?Excellent: '[^']+',[\s\S]*?\};/;
    
    if (ratingColorsPattern.test(content)) {
      content = content.replace(
        ratingColorsPattern,
        `const ratingColors = {
    Excellent: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    Good: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    Average: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    Poor: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  };`
      );
      changes++;
      console.log('  ✓ Fixed ratingColors object');
    }
    
    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Fixed ${changes} patterns`);
      return true;
    } else {
      console.log('  ⏭️  No changes needed');
      return false;
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Fixing dynamic color classes in tool pages...\n');
  
  let totalFixed = 0;
  
  for (const filePath of filesToFix) {
    if (fixDynamicColors(filePath)) {
      totalFixed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Dynamic color class fixes complete!`);
  console.log(`   Files fixed: ${totalFixed}/${filesToFix.length}`);
  console.log('');
  console.log('📋 Changes made:');
  console.log('   1. ✓ Converted getScoreColor() to return objects');
  console.log('   2. ✓ Fixed bg-${color}-50 → ${color}.bg');
  console.log('   3. ✓ Fixed border-${color}-200 → ${color}.border');
  console.log('   4. ✓ Fixed text-${color}-600 → ${color}.text');
  console.log('   5. ✓ All colors now use dark theme compatible values');
  console.log('');
}

main().catch(console.error);

