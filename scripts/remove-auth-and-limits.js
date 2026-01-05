#!/usr/bin/env node

/**
 * Remove Authentication and Usage Limits from All Tools
 * 
 * This script removes:
 * 1. UsageLimitBanner component imports and usage
 * 2. GuestUserBanner component imports and usage
 * 3. checkUsageLimit function calls
 * 4. trackToolUsage function calls
 * 5. usageLimit state management
 * 6. All authentication/limit-related code
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function removeAuthAndLimits(filePath) {
  console.log(`\n📝 Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const changes = [];
  
  // 1. Remove UsageLimitBanner import
  if (content.includes('UsageLimitBanner')) {
    content = content.replace(/import\s+{\s*UsageLimitBanner\s*}\s+from\s+['"]@\/components\/tools\/UsageLimitBanner['"];?\n?/g, '');
    changes.push('Removed UsageLimitBanner import');
    modified = true;
  }
  
  // 2. Remove GuestUserBanner import
  if (content.includes('GuestUserBanner')) {
    content = content.replace(/import\s+{\s*GuestUserBanner\s*}\s+from\s+['"]@\/components\/tools\/GuestUserBanner['"];?\n?/g, '');
    changes.push('Removed GuestUserBanner import');
    modified = true;
  }
  
  // 3. Remove checkUsageLimit and trackToolUsage imports
  if (content.includes('checkUsageLimit') || content.includes('trackToolUsage')) {
    // Remove from import statement
    content = content.replace(/,\s*checkUsageLimit/g, '');
    content = content.replace(/checkUsageLimit\s*,\s*/g, '');
    content = content.replace(/,\s*trackToolUsage/g, '');
    content = content.replace(/trackToolUsage\s*,\s*/g, '');
    
    // Remove entire import if it's now empty
    content = content.replace(/import\s+{\s*}\s+from\s+['"]@\/lib\/utils\/toolUsageTracker['"];?\n?/g, '');
    
    changes.push('Removed checkUsageLimit/trackToolUsage imports');
    modified = true;
  }
  
  // 4. Remove ToolUsageLimit type import
  if (content.includes('ToolUsageLimit')) {
    content = content.replace(/,\s*ToolUsageLimit/g, '');
    content = content.replace(/ToolUsageLimit\s*,\s*/g, '');
    changes.push('Removed ToolUsageLimit type import');
    modified = true;
  }
  
  // 5. Remove usageLimit state
  if (content.includes('usageLimit')) {
    content = content.replace(/const\s+\[usageLimit,\s*setUsageLimit\]\s*=\s*useState[^;]+;?\n?/g, '');
    changes.push('Removed usageLimit state');
    modified = true;
  }
  
  // 6. Remove useEffect for checkUsageLimit
  if (content.includes('checkUsageLimit')) {
    content = content.replace(/useEffect\(\(\)\s*=>\s*{\s*checkUsageLimit\([^)]+\)\.then\(setUsageLimit\);?\s*},\s*\[\]\);?\n?/g, '');
    changes.push('Removed checkUsageLimit useEffect');
    modified = true;
  }
  
  // 7. Remove trackToolUsage calls
  if (content.includes('trackToolUsage')) {
    content = content.replace(/await\s+trackToolUsage\([^)]+\);?\n?/g, '');
    content = content.replace(/trackToolUsage\([^)]+\);?\n?/g, '');
    changes.push('Removed trackToolUsage calls');
    modified = true;
  }
  
  // 8. Remove checkUsageLimit calls after tracking
  if (content.includes('checkUsageLimit')) {
    content = content.replace(/const\s+newLimit\s*=\s*await\s+checkUsageLimit\([^)]+\);?\n?/g, '');
    content = content.replace(/setUsageLimit\(newLimit\);?\n?/g, '');
    changes.push('Removed checkUsageLimit calls');
    modified = true;
  }
  
  // 9. Remove UsageLimitBanner JSX
  if (content.includes('<UsageLimitBanner')) {
    content = content.replace(/<UsageLimitBanner[^>]*\/>/g, '');
    content = content.replace(/<UsageLimitBanner[^>]*>[\s\S]*?<\/UsageLimitBanner>/g, '');
    changes.push('Removed UsageLimitBanner JSX');
    modified = true;
  }
  
  // 10. Remove GuestUserBanner JSX
  if (content.includes('<GuestUserBanner')) {
    content = content.replace(/<GuestUserBanner[^>]*\/>/g, '');
    content = content.replace(/<GuestUserBanner[^>]*>[\s\S]*?<\/GuestUserBanner>/g, '');
    changes.push('Removed GuestUserBanner JSX');
    modified = true;
  }
  
  // 11. Clean up empty lines (max 2 consecutive empty lines)
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Modified ${path.basename(filePath)}`);
    changes.forEach(change => console.log(`     - ${change}`));
    return true;
  } else {
    console.log(`  ⏭️  No changes needed`);
    return false;
  }
}

async function main() {
  console.log('🔧 Removing authentication and usage limits from all tools...\n');
  
  // Find all enhanced tool pages
  const toolPages = glob.sync('src/app/tools/**/*-enhanced/page.tsx');
  
  console.log(`Found ${toolPages.length} tool pages:\n`);
  toolPages.forEach(page => console.log(`  - ${page}`));
  console.log('');
  
  let totalFixed = 0;
  
  for (const pagePath of toolPages) {
    if (removeAuthAndLimits(pagePath)) {
      totalFixed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ COMPLETE: Modified ${totalFixed}/${toolPages.length} files`);
  console.log('='.repeat(60));
  console.log('\n📋 Summary:');
  console.log(`  - Total files processed: ${toolPages.length}`);
  console.log(`  - Files modified: ${totalFixed}`);
  console.log(`  - Files unchanged: ${toolPages.length - totalFixed}`);
  console.log('\n✨ All tools are now completely free with no authentication required!');
}

main().catch(console.error);

