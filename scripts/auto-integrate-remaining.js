#!/usr/bin/env node

/**
 * Automated script to integrate remaining 11 tool interfaces
 * This reads original tool pages and injects their interfaces into enhanced pages
 */

const fs = require('fs');
const path = require('path');

const remainingTools = [
  { name: 'best-time-to-post', category: 'social' },
  { name: 'engagement-calculator', category: 'social' },
  { name: 'hashtag-generator', category: 'social' },
  { name: 'image-resizer', category: 'social' },
  { name: 'social-audit-tool', category: 'social' },
  { name: 'keyword-research', category: 'seo' },
  { name: 'page-speed-analyzer', category: 'seo' },
  { name: 'robots-txt-generator', category: 'seo' },
  { name: 'schema-generator', category: 'seo' },
  { name: 'serp-preview', category: 'seo' },
  { name: 'xml-sitemap-generator', category: 'seo' },
];

function integrateTool(tool) {
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
  
  console.log(`\n📝 Processing: ${tool.name}`);
  
  try {
    const originalContent = fs.readFileSync(originalPath, 'utf-8');
    const enhancedContent = fs.readFileSync(enhancedPath, 'utf-8');
    
    // Extract imports from original (everything before export default)
    const originalImportsMatch = originalContent.match(/^([\s\S]*?)export default/);
    if (!originalImportsMatch) {
      console.error(`❌ Could not extract imports from ${tool.name}`);
      return false;
    }
    const originalImports = originalImportsMatch[1].trim();
    
    // Extract component logic from original (state, effects, handlers)
    const logicMatch = originalContent.match(/export default function.*?\{([\s\S]*?)return \(/);
    const componentLogic = logicMatch ? logicMatch[1].trim() : '';
    
    // Extract tool interface from original (content inside ToolLayout)
    const toolLayoutMatch = originalContent.match(/<ToolLayout[\s\S]*?>\s*<div className="space-y-6">([\s\S]*?)<\/div>\s*<\/ToolLayout>/);
    if (!toolLayoutMatch) {
      console.error(`❌ Could not extract tool interface from ${tool.name}`);
      return false;
    }
    const toolInterface = toolLayoutMatch[1].trim();
    
    // Get enhanced page SEO imports
    const seoImportsMatch = enhancedContent.match(/import \{[\s\S]*?\} from '@\/components\/seo';/);
    const seoImports = seoImportsMatch ? seoImportsMatch[0] : '';
    
    // Get content import from enhanced page
    const contentImportMatch = enhancedContent.match(/import \{.*?\} from '@\/data\/tools\/.*?-content';/);
    const contentImport = contentImportMatch ? contentImportMatch[0] : '';
    
    // Get content destructuring from enhanced page
    const destructuringMatch = enhancedContent.match(/const \{ (.*?) \} = .*Content;/);
    const destructuring = destructuringMatch ? destructuringMatch[1] : 'metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer';
    
    // Get component name from enhanced page
    const componentNameMatch = enhancedContent.match(/export default function (\w+)/);
    const componentName = componentNameMatch ? componentNameMatch[1] : 'EnhancedPage';
    
    // Get content variable name
    const contentVarMatch = enhancedContent.match(/const \{.*?\} = (\w+Content);/);
    const contentVar = contentVarMatch ? contentVarMatch[1] : 'toolContent';
    
    // Extract everything after the placeholder section in enhanced page
    const afterPlaceholderMatch = enhancedContent.match(/<\/ContentSection>\s*([\s\S]*?)<\/ToolLayout>/);
    const afterPlaceholder = afterPlaceholderMatch ? afterPlaceholderMatch[1].trim() : '';
    
    // Extract schema markup from enhanced page
    const schemaMatch = enhancedContent.match(/(return \(\s*<>[\s\S]*?<\/SoftwareApplicationSchema>)/);
    const schemaMarkup = schemaMatch ? schemaMatch[1] : '';
    
    // Build new enhanced page content
    const newContent = `'use client';

${originalImports}
${seoImports}
${contentImport}

export default function ${componentName}() {
  const { ${destructuring} } = ${contentVar};

  // Tool state and logic
${componentLogic}

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: '${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tools', url: '/tools#${tool.category}' },
          { name: metadata.title, url: '/tools/${tool.category}/${tool.name}' },
        ]}
      />

      <HowToSchema
        name={\`How to Use \${metadata.title}\`}
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/${tool.category}/${tool.name}"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={metadata.title}
        description={metadata.description}
        category="${tool.category}"
      >
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {hero.subtitle}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {hero.description}
            </p>
          </div>

          <QuickAnswer
            question={quickAnswer.question}
            answer={quickAnswer.answer}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <TableOfContents items={tableOfContents} />
            </div>

            <div className="lg:col-span-3 space-y-12">
              <ContentSection
                id="tool"
                title={\`Use the \${metadata.title}\`}
              >
                <div className="space-y-6">
${toolInterface}
                </div>
              </ContentSection>

              ${afterPlaceholder}
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}
`;
    
    // Write the new enhanced page
    fs.writeFileSync(enhancedPath, newContent, 'utf-8');
    
    console.log(`✅ Successfully integrated ${tool.name}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${tool.name}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Starting automated integration of remaining 11 tools...\n');

let processed = 0;
let failed = 0;

remainingTools.forEach(tool => {
  if (integrateTool(tool)) {
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
  console.log(`   3. Test pages manually`);
  console.log(`   4. Commit changes\n`);
}

