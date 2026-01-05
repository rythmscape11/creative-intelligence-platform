#!/usr/bin/env node

/**
 * Fix Related Tools URLs - Add -enhanced suffix to all tool URLs
 * 
 * This script fixes 404 errors in Related Tools sections by ensuring
 * all tool URLs include the -enhanced suffix.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// URL mapping: old URL -> new URL
const urlMappings = {
  // Content Tools
  '/tools/content/headline-analyzer': '/tools/content/headline-analyzer-enhanced',
  '/tools/content/meta-description-generator': '/tools/content/meta-description-generator-enhanced',
  '/tools/content/blog-outline-generator': '/tools/content/blog-outline-generator-enhanced',
  '/tools/content/content-calendar-generator': '/tools/content/content-calendar-generator-enhanced',
  '/tools/content/email-subject-tester': '/tools/content/email-subject-tester-enhanced',
  '/tools/content/readability-scorer': '/tools/content/readability-scorer-enhanced',
  '/tools/content/keyword-density-checker': '/tools/content/keyword-density-checker-enhanced',
  '/tools/content/social-caption-generator': '/tools/content/social-caption-generator-enhanced',
  
  // SEO Tools
  '/tools/seo/keyword-research': '/tools/seo/keyword-research-enhanced',
  '/tools/seo/backlink-checker': '/tools/seo/backlink-checker-enhanced',
  '/tools/seo/page-speed-analyzer': '/tools/seo/page-speed-analyzer-enhanced',
  '/tools/seo/serp-preview': '/tools/seo/serp-preview-enhanced',
  '/tools/seo/schema-generator': '/tools/seo/schema-generator-enhanced',
  '/tools/seo/robots-txt-generator': '/tools/seo/robots-txt-generator-enhanced',
  '/tools/seo/xml-sitemap-generator': '/tools/seo/xml-sitemap-generator-enhanced',
  
  // Social Tools
  '/tools/social/engagement-calculator': '/tools/social/engagement-calculator-enhanced',
  '/tools/social/hashtag-generator': '/tools/social/hashtag-generator-enhanced',
  '/tools/social/best-time-to-post': '/tools/social/best-time-to-post-enhanced',
  '/tools/social/social-audit-tool': '/tools/social/social-audit-tool-enhanced',
  '/tools/social/utm-builder': '/tools/social/utm-builder-enhanced',
  '/tools/social/image-resizer': '/tools/social/image-resizer-enhanced',
  
  // Email Tools
  '/tools/email/spam-score-checker': '/tools/email/spam-score-checker-enhanced',
  '/tools/email/email-preview': '/tools/email/email-preview-enhanced',
  '/tools/email/signature-generator': '/tools/email/signature-generator-enhanced',
  '/tools/email/list-segmentation-calculator': '/tools/email/list-segmentation-calculator-enhanced',
  
  // Advertising Tools
  '/tools/advertising/roi-calculator': '/tools/advertising/roi-calculator-enhanced',
  '/tools/advertising/cpc-cpm-calculator': '/tools/advertising/cpc-cpm-calculator-enhanced',
  '/tools/advertising/ad-copy-generator': '/tools/advertising/ad-copy-generator-enhanced',
  '/tools/advertising/landing-page-analyzer': '/tools/advertising/landing-page-analyzer-enhanced',
  '/tools/advertising/budget-allocator': '/tools/advertising/budget-allocator-enhanced',
};

function fixRelatedToolsUrls(filePath) {
  console.log(`\n📝 Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changeCount = 0;
  
  // Fix each URL mapping
  for (const [oldUrl, newUrl] of Object.entries(urlMappings)) {
    // Match the URL in the relatedTools array
    const regex = new RegExp(`url: '${oldUrl.replace(/\//g, '\\/')}'`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, `url: '${newUrl}'`);
      changeCount += matches.length;
      modified = true;
      console.log(`  ✓ Fixed: ${oldUrl} -> ${newUrl}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${changeCount} URL(s) in ${path.basename(filePath)}`);
    return true;
  } else {
    console.log(`  ⏭️  No changes needed`);
    return false;
  }
}

async function main() {
  console.log('🔧 Fixing Related Tools URLs across all tool content files...\n');
  
  // Find all tool content files
  const contentFiles = glob.sync('src/data/tools/*-content.ts');
  
  console.log(`Found ${contentFiles.length} tool content files:\n`);
  contentFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let totalFixed = 0;
  
  for (const filePath of contentFiles) {
    if (fixRelatedToolsUrls(filePath)) {
      totalFixed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ COMPLETE: Fixed URLs in ${totalFixed}/${contentFiles.length} files`);
  console.log('='.repeat(60));
  console.log('\n📋 Summary:');
  console.log(`  - Total files processed: ${contentFiles.length}`);
  console.log(`  - Files modified: ${totalFixed}`);
  console.log(`  - Files unchanged: ${contentFiles.length - totalFixed}`);
  console.log('\n✨ All Related Tools URLs now point to -enhanced pages!');
}

main().catch(console.error);

