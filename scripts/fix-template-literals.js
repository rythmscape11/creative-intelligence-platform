#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  { path: 'src/app/tools/seo/keyword-research-enhanced/page.tsx', title: 'Keyword Research Tool' },
  { path: 'src/app/tools/seo/page-speed-analyzer-enhanced/page.tsx', title: 'Page Speed Analyzer' },
  { path: 'src/app/tools/seo/robots-txt-generator-enhanced/page.tsx', title: 'Robots.txt Generator' },
  { path: 'src/app/tools/seo/schema-generator-enhanced/page.tsx', title: 'Schema Markup Generator' },
  { path: 'src/app/tools/seo/serp-preview-enhanced/page.tsx', title: 'SERP Preview Tool' },
  { path: 'src/app/tools/seo/xml-sitemap-generator-enhanced/page.tsx', title: 'XML Sitemap Generator' },
  { path: 'src/app/tools/social/best-time-to-post-enhanced/page.tsx', title: 'Best Time to Post Analyzer' },
  { path: 'src/app/tools/social/engagement-calculator-enhanced/page.tsx', title: 'Engagement Rate Calculator' },
  { path: 'src/app/tools/social/hashtag-generator-enhanced/page.tsx', title: 'Hashtag Generator' },
  { path: 'src/app/tools/social/image-resizer-enhanced/page.tsx', title: 'Social Media Image Resizer' },
  { path: 'src/app/tools/social/social-audit-tool-enhanced/page.tsx', title: 'Social Media Audit Tool' },
];

console.log('🔧 Fixing template literals in HowToSchema...\n');

files.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${file.path} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace template literal in HowToSchema name prop
  const oldPattern = /name=\{\`How to Use \$\{metadata\.title\}\`\}/g;
  const newValue = `name="How to Use ${file.title}"`;
  
  if (content.match(oldPattern)) {
    content = content.replace(oldPattern, newValue);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${file.path}`);
  } else {
    console.log(`⏭️  No template literal found: ${file.path}`);
  }
});

console.log('\n✨ Done!');

