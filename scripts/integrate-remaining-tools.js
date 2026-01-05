#!/usr/bin/env node

/**
 * Automated script to integrate tool interfaces into remaining enhanced pages
 * This copies the interactive tool UI from original pages into enhanced versions
 */

const fs = require('fs');
const path = require('path');

// Define remaining tools that need integration
const remainingTools = [
  // Email Tools (3)
  { name: 'list-segmentation-calculator', category: 'email', contentImport: 'listSegmentationCalculatorContent', title: 'List Segmentation Calculator' },
  { name: 'signature-generator', category: 'email', contentImport: 'signatureGeneratorContent', title: 'Signature Generator' },
  { name: 'spam-score-checker', category: 'email', contentImport: 'spamScoreCheckerContent', title: 'Spam Score Checker' },
  
  // SEO Tools (6)
  { name: 'keyword-research', category: 'seo', contentImport: 'keywordResearchContent', title: 'Keyword Research' },
  { name: 'page-speed-analyzer', category: 'seo', contentImport: 'pageSpeedAnalyzerContent', title: 'Page Speed Analyzer' },
  { name: 'robots-txt-generator', category: 'seo', contentImport: 'robotsTxtGeneratorContent', title: 'Robots.txt Generator' },
  { name: 'schema-generator', category: 'seo', contentImport: 'schemaGeneratorContent', title: 'Schema Generator' },
  { name: 'serp-preview', category: 'seo', contentImport: 'serpPreviewContent', title: 'SERP Preview' },
  { name: 'xml-sitemap-generator', category: 'seo', contentImport: 'xmlSitemapGeneratorContent', title: 'XML Sitemap Generator' },
  
  // Social Tools (6)
  { name: 'best-time-to-post', category: 'social', contentImport: 'bestTimeToPostContent', title: 'Best Time to Post' },
  { name: 'engagement-calculator', category: 'social', contentImport: 'engagementCalculatorContent', title: 'Engagement Calculator' },
  { name: 'hashtag-generator', category: 'social', contentImport: 'hashtagGeneratorContent', title: 'Hashtag Generator' },
  { name: 'image-resizer', category: 'social', contentImport: 'imageResizerContent', title: 'Image Resizer' },
  { name: 'social-audit-tool', category: 'social', contentImport: 'socialAuditToolContent', title: 'Social Audit Tool' },
  { name: 'utm-builder', category: 'social', contentImport: 'utmBuilderContent', title: 'UTM Builder' },
];

function extractToolSection(originalContent) {
  // Extract imports
  const importLines = [];
  const lines = originalContent.split('\n');
  let inImports = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('import ') || line.startsWith('from ') || (inImports && line.trim() === '')) {
      importLines.push(line);
    } else if (line.startsWith('export default')) {
      inImports = false;
      break;
    }
  }
  
  // Extract component logic (state, effects, handlers)
  const componentMatch = originalContent.match(/export default function.*?\{([\s\S]*?)return \(/);
  const componentLogic = componentMatch ? componentMatch[1] : '';
  
  // Extract the tool section (everything inside ToolLayout but before closing tag)
  const toolLayoutMatch = originalContent.match(/<ToolLayout[\s\S]*?>([\s\S]*?)<\/ToolLayout>/);
  const toolContent = toolLayoutMatch ? toolLayoutMatch[1] : '';
  
  return {
    imports: importLines.join('\n'),
    logic: componentLogic.trim(),
    toolContent: toolContent.trim()
  };
}

function integrateToolInterface(tool) {
  const originalPath = path.join(process.cwd(), 'src/app/tools', tool.category, tool.name, 'page.tsx');
  const enhancedPath = path.join(process.cwd(), 'src/app/tools', tool.category, `${tool.name}-enhanced`, 'page.tsx');
  
  if (!fs.existsSync(originalPath)) {
    console.error(`❌ Original not found: ${originalPath}`);
    return false;
  }
  
  if (!fs.existsSync(enhancedPath)) {
    console.error(`❌ Enhanced not found: ${enhancedPath}`);
    return false;
  }
  
  console.log(`\n📝 Processing: ${tool.title}`);
  
  try {
    // Read both files
    const originalContent = fs.readFileSync(originalPath, 'utf-8');
    const enhancedContent = fs.readFileSync(enhancedPath, 'utf-8');
    
    // Extract tool interface from original
    const extracted = extractToolSection(originalContent);
    
    // Get the enhanced page structure
    const enhancedLines = enhancedContent.split('\n');
    
    // Find where to insert imports (after 'use client' and before existing imports)
    const useClientIndex = enhancedLines.findIndex(line => line.includes("'use client'"));
    
    // Extract existing SEO imports from enhanced page
    const seoImportsStart = enhancedLines.findIndex(line => line.includes('FAQSection'));
    const seoImportsEnd = enhancedLines.findIndex(line => line.includes('} from \'@/components/seo\''));
    
    // Extract content import
    const contentImportLine = enhancedLines.find(line => line.includes(`${tool.contentImport}`));
    
    // Build new imports section
    const newImports = [
      "'use client';",
      "",
      extracted.imports,
      enhancedLines.slice(seoImportsStart, seoImportsEnd + 1).join('\n'),
      contentImportLine
    ].filter(Boolean).join('\n');
    
    // Find the component function name in enhanced page
    const componentNameMatch = enhancedContent.match(/export default function (\w+)/);
    const componentName = componentNameMatch ? componentNameMatch[1] : 'EnhancedPage';
    
    // Extract SEO content destructuring
    const destructuringMatch = enhancedContent.match(/const \{ (.*?) \} = .*Content;/);
    const destructuring = destructuringMatch ? destructuringMatch[1] : 'metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer';
    
    // Find the placeholder section to replace
    const placeholderStart = enhancedContent.indexOf('<ContentSection\n                id="tool"');
    const placeholderEnd = enhancedContent.indexOf('</ContentSection>', placeholderStart) + '</ContentSection>'.length;
    
    if (placeholderStart === -1 || placeholderEnd === -1) {
      console.error(`❌ Could not find placeholder section in ${tool.name}`);
      return false;
    }
    
    // Extract the tool interface from original (the content inside ToolLayout)
    const toolInterfaceMatch = originalContent.match(/<div className="space-y-6">([\s\S]*?)<\/div>\s*<\/ToolLayout>/);
    const toolInterface = toolInterfaceMatch ? toolInterfaceMatch[1].trim() : '';
    
    // Build the new ContentSection with tool interface
    const newToolSection = `<ContentSection
                id="tool"
                title="Use the ${tool.title}"
              >
                <div className="space-y-6">
${toolInterface}
                </div>
              </ContentSection>`;
    
    // Replace placeholder with new tool section
    const beforePlaceholder = enhancedContent.substring(0, placeholderStart);
    const afterPlaceholder = enhancedContent.substring(placeholderEnd);
    
    // Build complete new enhanced page
    const newEnhancedContent = `${newImports}

export default function ${componentName}() {
  const { ${destructuring} } = ${tool.contentImport};

  // Tool state and logic
${extracted.logic}

${beforePlaceholder}${newToolSection}${afterPlaceholder}`;
    
    // Write the updated enhanced page
    fs.writeFileSync(enhancedPath, newEnhancedContent, 'utf-8');
    
    console.log(`✅ Successfully integrated ${tool.title}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${tool.name}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Starting automated tool interface integration...\n');
console.log(`📊 Total tools to process: ${remainingTools.length}\n`);

let processed = 0;
let failed = 0;

remainingTools.forEach(tool => {
  if (integrateToolInterface(tool)) {
    processed++;
  } else {
    failed++;
  }
});

console.log(`\n\n📈 Summary:`);
console.log(`   ✅ Successfully integrated: ${processed}/${remainingTools.length}`);
console.log(`   ❌ Failed: ${failed}/${remainingTools.length}`);

if (processed > 0) {
  console.log(`\n✨ Next steps:`);
  console.log(`   1. Run: npm run build`);
  console.log(`   2. Fix any TypeScript errors`);
  console.log(`   3. Test a few pages manually`);
  console.log(`   4. Commit changes\n`);
}

