/**
 * Generate 120 High-Quality Blog Posts
 * 
 * This script generates:
 * - 20 Pillar Posts (3,000+ words each)
 * - 100 Cluster Posts (1,500-2,000 words each)
 * 
 * Total: ~250,000 words of SEO-optimized content
 * 
 * USAGE:
 *   npx tsx scripts/generate-120-quality-posts.ts              # Dry-run (preview only)
 *   npx tsx scripts/generate-120-quality-posts.ts --execute    # Actually create posts
 */

import { PrismaClient } from '@prisma/client';
import { PILLAR_KEYWORDS, CLUSTER_KEYWORDS, CONTENT_STATS } from './content-strategy/keyword-research';
import { generateBlogPost } from './content-strategy/content-generator';

const prisma = new PrismaClient();

const DRY_RUN = !process.argv.includes('--execute');
const BATCH_SIZE = 10; // Insert 10 posts at a time

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  📝 MEDIAPLANPRO - QUALITY CONTENT GENERATION');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No posts will be created');
    console.log('   Run with --execute flag to actually create posts');
    console.log('');
  }
  
  console.log('📊 Content Strategy Overview:');
  console.log(`   - Total Posts: ${CONTENT_STATS.totalPosts}`);
  console.log(`   - Pillar Posts: ${CONTENT_STATS.pillarPosts} (3,000+ words each)`);
  console.log(`   - Cluster Posts: ${CONTENT_STATS.clusterPosts} (1,500-2,000 words each)`);
  console.log(`   - Total Words: ~${CONTENT_STATS.totalWords.toLocaleString()}`);
  console.log('');
  
  // Get admin user
  console.log('👤 Finding admin user...');
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });
  
  if (!adminUser) {
    throw new Error('No admin user found. Please run seed script first.');
  }
  console.log(`✅ Admin user found: ${adminUser.email}`);
  console.log('');
  
  // Get categories
  console.log('📁 Loading categories...');
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    throw new Error('No categories found. Please run seed script first.');
  }
  console.log(`✅ Found ${categories.length} categories`);
  console.log('');
  
  // Get tags
  console.log('🏷️  Loading tags...');
  const tags = await prisma.tag.findMany();
  if (tags.length === 0) {
    throw new Error('No tags found. Please run seed script first.');
  }
  console.log(`✅ Found ${tags.length} tags`);
  console.log('');
  
  // Check existing posts
  console.log('🔍 Checking for existing posts...');
  const existingPosts = await prisma.blogPost.findMany({
    select: { slug: true },
  });
  const existingSlugs = new Set(existingPosts.map(p => p.slug));
  console.log(`📚 Found ${existingSlugs.size} existing posts in database`);
  console.log('');
  
  // Combine all keywords
  const allKeywords = [...PILLAR_KEYWORDS, ...CLUSTER_KEYWORDS];
  
  console.log('🎯 Generating content...');
  console.log('');
  
  const postsToCreate: any[] = [];
  let skipped = 0;
  
  // Generate posts
  for (let i = 0; i < allKeywords.length; i++) {
    const keyword = allKeywords[i];
    const postIndex = i + 1;
    
    // Generate post content
    const generatedPost = generateBlogPost(keyword, postIndex);
    
    // Skip if slug already exists
    if (existingSlugs.has(generatedPost.slug)) {
      skipped++;
      continue;
    }
    
    // Find category
    const category = categories.find(c => 
      c.name.toLowerCase() === keyword.category.toLowerCase()
    );
    
    if (!category) {
      console.log(`⚠️  Category not found for: ${keyword.category}`);
      continue;
    }
    
    // Find tags
    const postTags = tags.filter(t => 
      generatedPost.tags.some(gt => 
        t.slug === gt || t.name.toLowerCase() === gt.replace(/-/g, ' ')
      )
    );
    
    // Generate publish date (distributed over past 2 years)
    const daysAgo = Math.floor(Math.random() * 730); // 0-730 days ago
    const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    postsToCreate.push({
      title: generatedPost.title,
      slug: generatedPost.slug,
      content: generatedPost.content,
      excerpt: generatedPost.excerpt,
      seoTitle: generatedPost.seoTitle,
      seoDescription: generatedPost.seoDescription,
      featuredImage: generatedPost.featuredImage,
      categoryId: category.id,
      authorId: adminUser.id,
      status: 'PUBLISHED',
      publishedAt,
      tagIds: postTags.map(t => t.id),
      type: keyword.type,
      wordCount: keyword.targetWordCount,
    });
    
    if ((i + 1) % 20 === 0) {
      console.log(`   ✓ Generated ${i + 1}/${allKeywords.length} posts...`);
    }
  }
  
  console.log('');
  console.log(`✅ Generated ${postsToCreate.length} unique posts`);
  if (skipped > 0) {
    console.log(`⚠️  Skipped ${skipped} posts (slugs already exist)`);
  }
  console.log('');
  
  // Show preview
  console.log('📋 Preview of first 3 posts:');
  console.log('');
  postsToCreate.slice(0, 3).forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Type: ${post.type.toUpperCase()}`);
    console.log(`   Words: ~${post.wordCount.toLocaleString()}`);
    console.log(`   Category: ${categories.find(c => c.id === post.categoryId)?.name}`);
    console.log(`   Tags: ${post.tagIds.length}`);
    console.log(`   Published: ${post.publishedAt.toLocaleDateString()}`);
    console.log('');
  });
  
  if (DRY_RUN) {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ℹ️  DRY RUN COMPLETE - NO POSTS CREATED');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('To actually create these posts, run:');
    console.log('  npx tsx scripts/generate-120-quality-posts.ts --execute');
    console.log('');
    return;
  }
  
  // Insert posts in batches
  console.log('💾 Inserting posts into database...');
  console.log('');
  
  let created = 0;
  const totalBatches = Math.ceil(postsToCreate.length / BATCH_SIZE);
  
  for (let batch = 0; batch < totalBatches; batch++) {
    const start = batch * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, postsToCreate.length);
    const batchPosts = postsToCreate.slice(start, end);
    
    for (const postData of batchPosts) {
      const { tagIds, type, wordCount, ...postWithoutExtra } = postData;
      
      try {
        await prisma.blogPost.create({
          data: {
            ...postWithoutExtra,
            tags: {
              connect: tagIds.map((id: string) => ({ id })),
            },
          },
        });
        created++;
      } catch (error: any) {
        console.error(`❌ Error creating post "${postData.title}":`, error.message);
      }
    }
    
    const progress = ((batch + 1) / totalBatches * 100).toFixed(1);
    console.log(`   ✓ Batch ${batch + 1}/${totalBatches} complete (${created}/${postsToCreate.length} posts) - ${progress}%`);
  }
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ✅ CONTENT GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Posts Created: ${created}`);
  console.log(`   - Pillar Posts: ${postsToCreate.filter(p => p.type === 'pillar').length}`);
  console.log(`   - Cluster Posts: ${postsToCreate.filter(p => p.type === 'cluster').length}`);
  console.log(`   - Total Words: ~${postsToCreate.reduce((sum, p) => sum + p.wordCount, 0).toLocaleString()}`);
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('   1. Verify posts at /blog');
  console.log('   2. Check sitemap at /sitemap.xml');
  console.log('   3. Test individual post pages');
  console.log('   4. Monitor search console for indexing');
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

