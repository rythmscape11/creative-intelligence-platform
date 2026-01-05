#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  'src/app/tools/seo/page-speed-analyzer-enhanced/page.tsx',
  'src/app/tools/seo/robots-txt-generator-enhanced/page.tsx',
  'src/app/tools/seo/schema-generator-enhanced/page.tsx',
  'src/app/tools/seo/serp-preview-enhanced/page.tsx',
  'src/app/tools/seo/xml-sitemap-generator-enhanced/page.tsx',
  'src/app/tools/social/best-time-to-post-enhanced/page.tsx',
  'src/app/tools/social/engagement-calculator-enhanced/page.tsx',
  'src/app/tools/social/hashtag-generator-enhanced/page.tsx',
  'src/app/tools/social/image-resizer-enhanced/page.tsx',
  'src/app/tools/social/social-audit-tool-enhanced/page.tsx',
];

console.log('🔧 Fixing extra closing divs...\n');

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find the pattern: </ContentSection> followed by extra </div> tags before </ToolLayout>
  let inExtraDiv = false;
  let foundRelatedTools = false;
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect the related tools ContentSection closing
    if (line.includes('</ContentSection>') && foundRelatedTools) {
      newLines.push(line);
      inExtraDiv = true;
      continue;
    }
    
    if (line.includes('id="related-tools"')) {
      foundRelatedTools = true;
    }
    
    // Skip extra closing divs between </ContentSection> and </ToolLayout>
    if (inExtraDiv) {
      if (line.trim() === '</div>') {
        // Skip this line
        continue;
      } else if (line.includes('</ToolLayout>')) {
        // Found ToolLayout closing, stop skipping
        inExtraDiv = false;
        // Add the proper closing divs before ToolLayout
        newLines.push('            </div>');
        newLines.push('          </div>');
        newLines.push('        </div>');
        newLines.push(line);
        continue;
      }
    }
    
    newLines.push(line);
  }
  
  const newContent = newLines.join('\n');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`⏭️  No issues: ${file}`);
  }
});

console.log('\n✨ Done!');

