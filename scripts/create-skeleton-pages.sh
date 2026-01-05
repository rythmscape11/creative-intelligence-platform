#!/bin/bash

# Skeleton Page Generator for MediaPlanPro Tools
# This script creates skeleton enhanced pages for all 30 tools
# Each page includes the basic structure and placeholders for content

echo "🚀 Creating skeleton enhanced pages for all tools..."

# Function to create skeleton page
create_skeleton_page() {
    local category=$1
    local tool_slug=$2
    local tool_name=$3
    local file_path="src/app/tools/${category}/${tool_slug}/page.tsx"
    
    echo "Creating skeleton for: ${tool_name} (${category}/${tool_slug})"
    
    # Check if file already exists
    if [ -f "$file_path" ]; then
        echo "⚠️  File already exists: $file_path"
        echo "   Skipping to avoid overwriting existing tool..."
        return
    fi
    
    # Create directory if it doesn't exist
    mkdir -p "src/app/tools/${category}/${tool_slug}"
    
    # Create skeleton page file
    cat > "$file_path" << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import { checkUsageLimit } from '@/lib/utils/toolUsageTracker';

// SEO Components
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

// TODO: Import tool-specific content data
// import { TOOL_CONTENT } from '@/data/tools/TOOL_SLUG-content';

export default function TOOL_NAME_Page() {
  const [usageLimit, setUsageLimit] = useState({ 
    canUse: true, 
    remaining: 10, 
    limit: 10, 
    isPro: false, 
    usedToday: 0 
  });

  useEffect(() => {
    checkUsageLimit('TOOL_SLUG').then(setUsageLimit);
  }, []);

  // TODO: Add schema data from content file
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.mediaplanpro.com' },
    { name: 'Tools', url: 'https://www.mediaplanpro.com/tools' },
    { name: 'CATEGORY_NAME', url: 'https://www.mediaplanpro.com/tools/CATEGORY' },
    { name: 'TOOL_NAME', url: 'https://www.mediaplanpro.com/tools/CATEGORY/TOOL_SLUG' },
  ];

  return (
    <>
      {/* TODO: Add schema markup */}
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbSchema items={breadcrumbs} />
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              TOOL_NAME
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              TODO: Add tool subtitle
            </p>
          </div>
          
          {/* TODO: Add QuickAnswer component */}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
            {/* Sidebar - TOC */}
            <div className="lg:col-span-1">
              {/* TODO: Add TableOfContents component */}
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              
              {/* Tool Interface */}
              <section id="tool" className="scroll-mt-20">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* TODO: Add existing tool interface */}
                  <p className="text-gray-600">Tool interface placeholder</p>
                </div>
              </section>

              {/* TODO: Add all content sections */}
              {/* - How to Use (800-1,200 words) */}
              {/* - Benefits & Use Cases (1,000-1,500 words) */}
              {/* - Best Practices (800-1,200 words) */}
              {/* - Examples (1,200-1,800 words) */}
              {/* - Advanced Features (500-800 words) */}
              {/* - Integration Guide (400-600 words) */}
              {/* - Glossary (300-500 words) */}
              {/* - FAQ Section (1,500-2,000 words) */}
              {/* - Related Tools (200-300 words) */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
EOF

    # Replace placeholders
    sed -i '' "s/TOOL_SLUG/${tool_slug}/g" "$file_path"
    sed -i '' "s/TOOL_NAME/${tool_name}/g" "$file_path"
    sed -i '' "s/CATEGORY/${category}/g" "$file_path"
    
    # Capitalize category name for display
    category_display=$(echo "$category" | sed 's/.*/\u&/')
    sed -i '' "s/CATEGORY_NAME/${category_display}/g" "$file_path"
    
    echo "✅ Created: $file_path"
}

# Content Tools
echo ""
echo "📝 Creating Content Tools..."
create_skeleton_page "content" "blog-outline-generator" "Blog Outline Generator"
create_skeleton_page "content" "content-calendar-generator" "Content Calendar Generator"
create_skeleton_page "content" "email-subject-tester" "Email Subject Tester"
create_skeleton_page "content" "headline-analyzer" "Headline Analyzer"
create_skeleton_page "content" "keyword-density-checker" "Keyword Density Checker"
create_skeleton_page "content" "meta-description-generator" "Meta Description Generator"
create_skeleton_page "content" "readability-scorer" "Readability Scorer"
create_skeleton_page "content" "social-caption-generator" "Social Caption Generator"

# Email Tools
echo ""
echo "📧 Creating Email Tools..."
create_skeleton_page "email" "email-preview" "Email Preview"
create_skeleton_page "email" "list-segmentation-calculator" "List Segmentation Calculator"
create_skeleton_page "email" "signature-generator" "Email Signature Generator"
create_skeleton_page "email" "spam-score-checker" "Spam Score Checker"

# SEO Tools
echo ""
echo "🔍 Creating SEO Tools..."
create_skeleton_page "seo" "backlink-checker" "Backlink Checker"
create_skeleton_page "seo" "keyword-research" "Keyword Research"
create_skeleton_page "seo" "page-speed-analyzer" "Page Speed Analyzer"
create_skeleton_page "seo" "robots-txt-generator" "Robots.txt Generator"
create_skeleton_page "seo" "schema-generator" "Schema Generator"
create_skeleton_page "seo" "serp-preview" "SERP Preview"
create_skeleton_page "seo" "xml-sitemap-generator" "XML Sitemap Generator"

# Social Media Tools
echo ""
echo "📱 Creating Social Media Tools..."
create_skeleton_page "social" "best-time-to-post" "Best Time to Post"
create_skeleton_page "social" "engagement-calculator" "Engagement Calculator"
create_skeleton_page "social" "hashtag-generator" "Hashtag Generator"
create_skeleton_page "social" "image-resizer" "Image Resizer"
create_skeleton_page "social" "social-audit-tool" "Social Audit Tool"
create_skeleton_page "social" "utm-builder" "UTM Builder"

echo ""
echo "✨ Skeleton page generation complete!"
echo ""
echo "📊 Summary:"
echo "   - Content Tools: 8 pages"
echo "   - Email Tools: 4 pages"
echo "   - SEO Tools: 7 pages"
echo "   - Social Tools: 6 pages"
echo "   - Total: 25 skeleton pages created"
echo ""
echo "📝 Next Steps:"
echo "   1. Create content data files in src/data/tools/"
echo "   2. Fill in TODO sections in each skeleton page"
echo "   3. Add tool-specific content (5,000+ words per page)"
echo "   4. Test each page locally"
echo "   5. Commit and deploy in batches"
echo ""

