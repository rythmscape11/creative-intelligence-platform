#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  'src/app/tools/seo/keyword-research-enhanced/page.tsx',
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

console.log('🔧 Fixing indentation issues...\n');

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  let inToolStateSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect the "// Tool state and logic" comment
    if (line.trim() === '// Tool state and logic') {
      newLines.push(line);
      inToolStateSection = true;
      continue;
    }
    
    // If we're in the tool state section and find a line starting with "const [" without proper indentation
    if (inToolStateSection && line.match(/^const \[/) && !line.match(/^  const \[/)) {
      newLines.push('  ' + line);
      continue;
    }
    
    // Exit tool state section when we hit the return statement
    if (line.trim().startsWith('return (')) {
      inToolStateSection = false;
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

