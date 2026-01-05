#!/usr/bin/env ts-node

/**
 * Batch Enhanced Page Generator
 * Creates all remaining enhanced tool pages using template
 */

import * as fs from 'fs';
import * as path from 'path';

interface ToolConfig {
  name: string;
  category: 'email' | 'seo' | 'social';
  path: string;
  contentImport: string;
  title: string;
  hasComplexUI?: boolean;
}

const tools: ToolConfig[] = [
  // Email Tools (3 remaining)
  {
    name: 'list-segmentation-calculator',
    category: 'email',
    path: 'src/app/tools/email/list-segmentation-calculator-enhanced',
    contentImport: 'listSegmentationCalculatorContent',
    title: 'List Segmentation Calculator',
  },
  {
    name: 'signature-generator',
    category: 'email',
    path: 'src/app/tools/email/signature-generator-enhanced',
    contentImport: 'signatureGeneratorContent',
    title: 'Email Signature Generator',
  },
  {
    name: 'spam-score-checker',
    category: 'email',
    path: 'src/app/tools/email/spam-score-checker-enhanced',
    contentImport: 'spamScoreCheckerContent',
    title: 'Spam Score Checker',
  },
  // SEO Tools (7)
  {
    name: 'backlink-checker',
    category: 'seo',
    path: 'src/app/tools/seo/backlink-checker-enhanced',
    contentImport: 'backlinkCheckerContent',
    title: 'Backlink Checker',
  },
  {
    name: 'keyword-research',
    category: 'seo',
    path: 'src/app/tools/seo/keyword-research-enhanced',
    contentImport: 'keywordResearchContent',
    title: 'Keyword Research Tool',
  },
  {
    name: 'page-speed-analyzer',
    category: 'seo',
    path: 'src/app/tools/seo/page-speed-analyzer-enhanced',
    contentImport: 'pageSpeedAnalyzerContent',
    title: 'Page Speed Analyzer',
  },
  {
    name: 'robots-txt-generator',
    category: 'seo',
    path: 'src/app/tools/seo/robots-txt-generator-enhanced',
    contentImport: 'robotsTxtGeneratorContent',
    title: 'Robots.txt Generator',
  },
  {
    name: 'schema-generator',
    category: 'seo',
    path: 'src/app/tools/seo/schema-generator-enhanced',
    contentImport: 'schemaGeneratorContent',
    title: 'Schema Markup Generator',
  },
  {
    name: 'serp-preview',
    category: 'seo',
    path: 'src/app/tools/seo/serp-preview-enhanced',
    contentImport: 'serpPreviewContent',
    title: 'SERP Preview Tool',
  },
  {
    name: 'xml-sitemap-generator',
    category: 'seo',
    path: 'src/app/tools/seo/xml-sitemap-generator-enhanced',
    contentImport: 'xmlSitemapGeneratorContent',
    title: 'XML Sitemap Generator',
  },
  // Social Tools (6)
  {
    name: 'best-time-to-post',
    category: 'social',
    path: 'src/app/tools/social/best-time-to-post-enhanced',
    contentImport: 'bestTimeToPostContent',
    title: 'Best Time to Post',
  },
  {
    name: 'engagement-calculator',
    category: 'social',
    path: 'src/app/tools/social/engagement-calculator-enhanced',
    contentImport: 'engagementCalculatorContent',
    title: 'Engagement Rate Calculator',
  },
  {
    name: 'hashtag-generator',
    category: 'social',
    path: 'src/app/tools/social/hashtag-generator-enhanced',
    contentImport: 'hashtagGeneratorContent',
    title: 'Hashtag Generator',
  },
  {
    name: 'image-resizer',
    category: 'social',
    path: 'src/app/tools/social/image-resizer-enhanced',
    contentImport: 'imageResizerContent',
    title: 'Image Resizer',
  },
  {
    name: 'social-audit-tool',
    category: 'social',
    path: 'src/app/tools/social/social-audit-tool-enhanced',
    contentImport: 'socialAuditToolContent',
    title: 'Social Media Audit Tool',
  },
  {
    name: 'utm-builder',
    category: 'social',
    path: 'src/app/tools/social/utm-builder-enhanced',
    contentImport: 'utmBuilderContent',
    title: 'UTM Builder',
  },
];

function generateEnhancedPage(tool: ToolConfig): string {
  const categoryCapitalized = tool.category.charAt(0).toUpperCase() + tool.category.slice(1);
  const categoryUrl = tool.category === 'email' ? 'email' : tool.category === 'seo' ? 'seo' : 'social';
  
  return `'use client';

import { ToolLayout } from '@/components/tools/ToolLayout';
import {
  FAQSection,
  TableOfContents,
  QuickAnswer,
  HowToSchema,
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  ContentSection,
  RelatedTools,
} from '@/components/seo';
import { ${tool.contentImport} } from '@/data/tools/${tool.name}-content';

export default function ${tool.contentImport.replace('Content', '')}EnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = ${tool.contentImport};

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: '${categoryCapitalized} Tools', url: '/tools#${categoryUrl}' },
          { name: '${tool.title}', url: '/tools/${categoryUrl}/${tool.name}' },
        ]}
      />

      <HowToSchema
        name="How to Use ${tool.title}"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name="${tool.title}"
        description={metadata.description}
        url="https://mediaplanpro.com/tools/${categoryUrl}/${tool.name}"
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
          {/* Hero Section */}
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

          {/* Quick Answer */}
          <QuickAnswer
            question={quickAnswer.question}
            answer={quickAnswer.answer}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <TableOfContents items={tableOfContents} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Tool Interface - Placeholder */}
              <ContentSection
                id="tool"
                title="Use the ${tool.title}"
              >
                <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Interactive Tool
                    </h3>
                    <p className="text-gray-700 mb-6">
                      The original ${tool.title} tool interface is available at{' '}
                      <a href="/tools/${categoryUrl}/${tool.name}" className="text-amber-600 hover:text-amber-700 font-semibold underline">
                        /tools/${categoryUrl}/${tool.name}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      This enhanced page provides comprehensive SEO content and guidance.
                      Use the link above to access the interactive tool.
                    </p>
                  </div>
                </div>
              </ContentSection>

              {/* How to Use Section */}
              <ContentSection
                id="how-to-use"
                title="How to Use the ${tool.title}"
              >
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Follow these steps to get the most out of the ${tool.title}:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    {howToSteps.map((step, index) => (
                      <li key={index}>
                        <strong>{step.name}:</strong> {step.text}
                      </li>
                    ))}
                  </ol>
                </div>
              </ContentSection>

              {/* FAQ Section */}
              <FAQSection
                toolName="${tool.title}"
                faqs={faqs}
              />

              {/* Related Tools */}
              <ContentSection
                id="related-tools"
                title="Related ${categoryCapitalized} Tools"
              >
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}
`;
}

// Generate all pages
console.log('🚀 Generating enhanced pages...\n');

let created = 0;
let errors = 0;

tools.forEach((tool) => {
  try {
    const content = generateEnhancedPage(tool);
    const filePath = path.join(process.cwd(), tool.path, 'page.tsx');
    const dir = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Created: ${tool.path}/page.tsx`);
    created++;
  } catch (error) {
    console.error(`❌ Error creating ${tool.name}:`, error);
    errors++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Created: ${created} files`);
console.log(`   ❌ Errors: ${errors} files`);
console.log(`\n🎉 Done! All enhanced pages generated.`);

