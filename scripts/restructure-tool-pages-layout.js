#!/usr/bin/env node

/**
 * Script to restructure all 30 enhanced tool pages
 * Moves the interactive tool to the top, content sections below
 * 
 * Current Layout:
 * 1. Hero Section (title, subtitle, description)
 * 2. Quick Answer Box
 * 3. Grid with TOC sidebar + Main Content
 * 4. Tool Interface (inside ContentSection)
 * 5. Educational content sections
 * 
 * New Layout:
 * 1. Hero Section (title, subtitle only - condensed)
 * 2. Tool Interface (MOVED TO TOP - outside grid)
 * 3. Grid with TOC sidebar + Main Content
 * 4. Quick Answer Box (moved down into grid)
 * 5. Educational content sections
 */

const fs = require('fs');
const glob = require('glob');

function restructureToolPage(filePath) {
  console.log(`\n📝 Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Step 1: Condense hero section - remove long description paragraph
    // Look for the pattern of hero section with 3 paragraphs and condense to 2
    const heroPattern = /<div className="text-center max-w-3xl mx-auto">\s*<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>[\s\S]*?<\/p>\s*<p[^>]*>[\s\S]*?<\/p>\s*<\/div>/;
    
    if (heroPattern.test(content)) {
      content = content.replace(
        /<div className="text-center max-w-3xl mx-auto">\s*(<h1[^>]*>[\s\S]*?<\/h1>)\s*(<p[^>]*>[\s\S]*?<\/p>)\s*<p[^>]*>[\s\S]*?<\/p>\s*<\/div>/,
        '<div className="text-center mb-8">\n            $1\n            $2\n          </div>'
      );
      console.log('  ✓ Condensed hero section');
    }
    
    // Step 2: Find and extract the tool interface section
    // Look for ContentSection with id="tool"
    const toolSectionPattern = /<ContentSection\s+id="tool"[\s\S]*?<\/ContentSection>/;
    const toolSectionMatch = content.match(toolSectionPattern);
    
    if (toolSectionMatch) {
      const toolSection = toolSectionMatch[0];
      
      // Extract just the content inside ContentSection (remove the wrapper)
      const toolContentMatch = toolSection.match(/<ContentSection[^>]*>\s*([\s\S]*?)\s*<\/ContentSection>/);
      
      if (toolContentMatch) {
        const toolContent = toolContentMatch[1];
        
        // Remove the tool section from its current location
        content = content.replace(toolSectionPattern, '<!-- TOOL_MOVED_TO_TOP -->');
        
        // Find where to insert the tool (after hero section, before grid)
        // Look for the QuickAnswer component or the grid div
        const insertPattern = /(<\/div>\s*<QuickAnswer|<div className="grid grid-cols-1 lg:grid-cols-4)/;
        
        if (insertPattern.test(content)) {
          // Create the new tool section (outside ContentSection, as a standalone section)
          const newToolSection = `
          {/* Tool Interface - MOVED TO TOP */}
          <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
            ${toolContent.trim()}
          </section>

          `;
          
          content = content.replace(insertPattern, newToolSection + '$1');
          console.log('  ✓ Moved tool interface to top');
        }
      }
    }
    
    // Step 3: Move QuickAnswer inside the grid (after TOC, before other content)
    // Find QuickAnswer component
    const quickAnswerPattern = /<QuickAnswer\s+question=[\s\S]*?\/>/;
    const quickAnswerMatch = content.match(quickAnswerPattern);
    
    if (quickAnswerMatch) {
      const quickAnswer = quickAnswerMatch[0];
      
      // Remove QuickAnswer from current location
      content = content.replace(quickAnswerPattern, '');
      
      // Find the main content div inside grid (lg:col-span-3)
      const mainContentPattern = /(<div className="lg:col-span-3 space-y-12">)/;
      
      if (mainContentPattern.test(content)) {
        // Insert QuickAnswer as first item in main content
        content = content.replace(
          mainContentPattern,
          `$1\n              {/* Quick Answer Box */}\n              ${quickAnswer}\n`
        );
        console.log('  ✓ Moved QuickAnswer into grid');
      }
    }
    
    // Step 4: Replace the placeholder comment with nothing (clean up)
    content = content.replace(/\s*<!-- TOOL_MOVED_TO_TOP -->\s*/g, '\n');
    
    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('  ✅ Layout restructured successfully');
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
  console.log('🔍 Finding all enhanced tool pages...\n');
  
  const toolPages = glob.sync('src/app/tools/**/*-enhanced/page.tsx');
  
  console.log(`Found ${toolPages.length} tool pages to restructure:\n`);
  toolPages.forEach(page => console.log(`  - ${page}`));
  console.log('');
  
  let totalFixed = 0;
  
  for (const pagePath of toolPages) {
    if (restructureToolPage(pagePath)) {
      totalFixed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Layout restructuring complete!`);
  console.log(`   Files restructured: ${totalFixed}/${toolPages.length}`);
  console.log('');
  console.log('📋 Summary of changes:');
  console.log('   1. ✓ Condensed hero section (removed long description)');
  console.log('   2. ✓ Moved tool interface to top (immediately after hero)');
  console.log('   3. ✓ Moved QuickAnswer into content grid');
  console.log('   4. ✓ Educational content remains below tool');
  console.log('');
}

main().catch(console.error);

