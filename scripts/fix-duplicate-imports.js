#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need fixing
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

console.log('🔧 Fixing duplicate imports and use client directives...\n');

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Remove duplicate 'use client'
  if (content.includes("'use client';\n\n'use client';")) {
    content = content.replace("'use client';\n\n'use client';", "'use client';");
    modified = true;
  }
  
  // Remove duplicate ToolLayout import
  const toolLayoutImport = "import { ToolLayout } from '@/components/tools/ToolLayout';";
  const lines = content.split('\n');
  const newLines = [];
  let foundToolLayout = false;
  
  for (const line of lines) {
    if (line.trim() === toolLayoutImport) {
      if (!foundToolLayout) {
        newLines.push(line);
        foundToolLayout = true;
      } else {
        modified = true;
        // Skip duplicate
      }
    } else {
      newLines.push(line);
    }
  }
  
  if (modified) {
    content = newLines.join('\n');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`⏭️  No issues: ${file}`);
  }
});

console.log('\n✨ Done!');

