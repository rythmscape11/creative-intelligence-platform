#!/usr/bin/env node

/**
 * Script to integrate interactive tool interfaces into enhanced pages
 * This script copies the tool UI from original pages into enhanced versions
 */

const fs = require('fs');
const path = require('path');

// Define all tools to process
const tools = [
  // Content Tools (8)
  { name: 'blog-outline-generator', category: 'content', contentImport: 'blogOutlineGeneratorContent', title: 'Blog Outline Generator' },
  { name: 'content-calendar-generator', category: 'content', contentImport: 'contentCalendarGeneratorContent', title: 'Content Calendar Generator' },
  { name: 'email-subject-tester', category: 'content', contentImport: 'emailSubjectTesterContent', title: 'Email Subject Tester' },
  { name: 'headline-analyzer', category: 'content', contentImport: 'headlineAnalyzerContent', title: 'Headline Analyzer' },
  { name: 'keyword-density-checker', category: 'content', contentImport: 'keywordDensityCheckerContent', title: 'Keyword Density Checker' },
  { name: 'meta-description-generator', category: 'content', contentImport: 'metaDescriptionGeneratorContent', title: 'Meta Description Generator' },
  { name: 'readability-scorer', category: 'content', contentImport: 'readabilityScorerContent', title: 'Readability Scorer' },
  { name: 'social-caption-generator', category: 'content', contentImport: 'socialCaptionGeneratorContent', title: 'Social Caption Generator' },
  
  // Email Tools (4)
  { name: 'email-preview', category: 'email', contentImport: 'emailPreviewContent', title: 'Email Preview' },
  { name: 'list-segmentation-calculator', category: 'email', contentImport: 'listSegmentationCalculatorContent', title: 'List Segmentation Calculator' },
  { name: 'signature-generator', category: 'email', contentImport: 'signatureGeneratorContent', title: 'Signature Generator' },
  { name: 'spam-score-checker', category: 'email', contentImport: 'spamScoreCheckerContent', title: 'Spam Score Checker' },
  
  // SEO Tools (7) - excluding backlink-checker which is already done
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

function extractToolInterface(originalPagePath) {
  const content = fs.readFileSync(originalPagePath, 'utf-8');
  
  // Extract imports (everything before export default)
  const importsMatch = content.match(/^([\s\S]*?)export default/);
  if (!importsMatch) {
    console.error(`Could not extract imports from ${originalPagePath}`);
    return null;
  }
  
  // Extract the component body (everything inside the return statement)
  const returnMatch = content.match(/return \(([\s\S]*?)\n\s*\);\n\s*\}/);
  if (!returnMatch) {
    console.error(`Could not extract return statement from ${originalPagePath}`);
    return null;
  }
  
  // Extract state and functions (between export default and return)
  const logicMatch = content.match(/export default function.*?\{([\s\S]*?)return \(/);
  
  return {
    imports: importsMatch[1].trim(),
    logic: logicMatch ? logicMatch[1].trim() : '',
    jsx: returnMatch[1].trim()
  };
}

function processToolPage(tool) {
  const originalPath = path.join(process.cwd(), 'src/app/tools', tool.category, tool.name, 'page.tsx');
  const enhancedPath = path.join(process.cwd(), 'src/app/tools', tool.category, `${tool.name}-enhanced`, 'page.tsx');
  
  if (!fs.existsSync(originalPath)) {
    console.error(`❌ Original page not found: ${originalPath}`);
    return false;
  }
  
  if (!fs.existsSync(enhancedPath)) {
    console.error(`❌ Enhanced page not found: ${enhancedPath}`);
    return false;
  }
  
  console.log(`\n📝 Processing: ${tool.title} (${tool.category}/${tool.name})`);
  
  // Read both files
  const originalContent = fs.readFileSync(originalPath, 'utf-8');
  const enhancedContent = fs.readFileSync(enhancedPath, 'utf-8');
  
  // Extract tool interface components from original
  const toolInterface = extractToolInterface(originalPath);
  if (!toolInterface) {
    console.error(`❌ Failed to extract tool interface from ${tool.name}`);
    return false;
  }
  
  // Build the new enhanced page content
  // This is a simplified approach - we'll need to manually verify each page
  console.log(`✅ Extracted tool interface for ${tool.title}`);
  console.log(`   - Imports: ${toolInterface.imports.split('\n').length} lines`);
  console.log(`   - Logic: ${toolInterface.logic.split('\n').length} lines`);
  console.log(`   - JSX: ${toolInterface.jsx.split('\n').length} lines`);
  
  return true;
}

// Main execution
console.log('🚀 Starting tool interface integration...\n');
console.log(`📊 Total tools to process: ${tools.length}\n`);

let processed = 0;
let failed = 0;

tools.forEach(tool => {
  if (processToolPage(tool)) {
    processed++;
  } else {
    failed++;
  }
});

console.log(`\n\n📈 Summary:`);
console.log(`   ✅ Processed: ${processed}/${tools.length}`);
console.log(`   ❌ Failed: ${failed}/${tools.length}`);
console.log(`\n⚠️  Note: This script only analyzes the files.`);
console.log(`   Manual integration is required for each page to ensure quality.`);
console.log(`   Use the backlink-checker-enhanced page as a reference template.\n`);

