/**
 * Add Missing Categories and Tags
 * 
 * This script adds the categories and tags needed for the 120-post content strategy
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('');
  console.log('📁 Adding missing categories and tags...');
  console.log('');
  
  // Add missing categories
  const categoriesToAdd = [
    {
      name: 'SEO',
      slug: 'seo',
      description: 'Search engine optimization strategies and best practices',
      color: '#EF4444',
    },
    {
      name: 'Social Media',
      slug: 'social-media',
      description: 'Social media marketing tactics and platform strategies',
      color: '#EC4899',
    },
    {
      name: 'Email Marketing',
      slug: 'email-marketing',
      description: 'Email campaign strategies and automation',
      color: '#06B6D4',
    },
    {
      name: 'Analytics',
      slug: 'analytics',
      description: 'Marketing analytics, metrics, and data-driven insights',
      color: '#8B5CF6',
    },
    {
      name: 'Advertising',
      slug: 'advertising',
      description: 'Paid advertising strategies including PPC, social ads, and display',
      color: '#F97316',
    },
    {
      name: 'Growth Hacking',
      slug: 'growth-hacking',
      description: 'Growth marketing tactics and viral strategies',
      color: '#14B8A6',
    },
  ];
  
  console.log('Creating categories...');
  for (const category of categoriesToAdd) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`  ✓ ${created.name}`);
  }
  
  // Add missing tags
  const tagsToAdd = [
    { name: 'SEO', slug: 'seo' },
    { name: 'Content Marketing', slug: 'content-marketing' },
    { name: 'Social Media', slug: 'social-media' },
    { name: 'Email Marketing', slug: 'email-marketing' },
    { name: 'Analytics', slug: 'analytics' },
    { name: 'Advertising', slug: 'advertising' },
    { name: 'Growth Hacking', slug: 'growth-hacking' },
    { name: 'PPC', slug: 'ppc' },
    { name: 'Conversion Optimization', slug: 'conversion-optimization' },
    { name: 'Link Building', slug: 'link-building' },
    { name: 'Keyword Research', slug: 'keyword-research' },
    { name: 'Instagram', slug: 'instagram' },
    { name: 'LinkedIn', slug: 'linkedin' },
    { name: 'Facebook', slug: 'facebook' },
    { name: 'Twitter', slug: 'twitter' },
    { name: 'TikTok', slug: 'tiktok' },
    { name: 'Google Analytics', slug: 'google-analytics' },
    { name: 'Google Ads', slug: 'google-ads' },
    { name: 'Facebook Ads', slug: 'facebook-ads' },
    { name: 'Email Automation', slug: 'email-automation' },
    { name: 'A/B Testing', slug: 'ab-testing' },
    { name: 'Landing Pages', slug: 'landing-pages' },
    { name: 'Retargeting', slug: 'retargeting' },
    { name: 'Influencer Marketing', slug: 'influencer-marketing' },
    { name: 'Video Marketing', slug: 'video-marketing' },
  ];
  
  console.log('');
  console.log('Creating tags...');
  for (const tag of tagsToAdd) {
    const created = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    console.log(`  ✓ ${created.name}`);
  }
  
  console.log('');
  console.log('✅ All categories and tags created successfully!');
  console.log('');
  
  // Show summary
  const totalCategories = await prisma.category.count();
  const totalTags = await prisma.tag.count();
  
  console.log('📊 Summary:');
  console.log(`   - Total Categories: ${totalCategories}`);
  console.log(`   - Total Tags: ${totalTags}`);
  console.log('');
}

main()
  .catch((error) => {
    console.error('');
    console.error('❌ Error:', error);
    console.error('');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

