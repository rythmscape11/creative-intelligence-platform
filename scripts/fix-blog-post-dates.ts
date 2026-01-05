#!/usr/bin/env tsx

/**
 * Fix Blog Post Dates Script
 * 
 * This script updates all blog posts with future publishedAt dates to have past dates.
 * This ensures they appear in the sitemap immediately.
 * 
 * Usage:
 *   npx tsx scripts/fix-blog-post-dates.ts --dry-run  # Preview changes
 *   npx tsx scripts/fix-blog-post-dates.ts --execute  # Apply changes
 */

import { prisma } from '../src/lib/prisma';

const DRY_RUN = !process.argv.includes('--execute');

async function fixBlogPostDates() {
  console.log('🔍 Checking blog post dates...\n');

  try {
    // Get all posts with future publishedAt dates
    const futurePosts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        slug: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: {
        publishedAt: 'asc',
      },
    });

    console.log(`Found ${futurePosts.length} posts with future publishedAt dates\n`);

    if (futurePosts.length === 0) {
      console.log('✅ All posts have valid publishedAt dates!');
      return;
    }

    if (DRY_RUN) {
      console.log('🔍 DRY RUN MODE - No changes will be made\n');
      console.log('Sample of posts that would be updated:');
      futurePosts.slice(0, 10).forEach((post, idx) => {
        console.log(`${idx + 1}. ${post.slug}`);
        console.log(`   Current publishedAt: ${post.publishedAt}`);
        console.log(`   Would change to: ${post.createdAt}`);
      });
      console.log(`\n... and ${futurePosts.length - 10} more posts\n`);
      console.log('Run with --execute flag to apply changes');
      return;
    }

    // Update posts in batches
    console.log('📝 Updating posts...\n');
    
    let updated = 0;
    const batchSize = 100;

    for (let i = 0; i < futurePosts.length; i += batchSize) {
      const batch = futurePosts.slice(i, i + batchSize);
      
      // Update each post to use its createdAt as publishedAt
      await Promise.all(
        batch.map(async (post) => {
          await prisma.blogPost.update({
            where: { id: post.id },
            data: {
              publishedAt: post.createdAt,
            },
          });
        })
      );

      updated += batch.length;
      console.log(`✅ Updated ${updated}/${futurePosts.length} posts`);
    }

    console.log(`\n✅ Successfully updated ${updated} posts!`);

    // Verify the fix
    const remainingFuturePosts = await prisma.blogPost.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gt: new Date(),
        },
      },
    });

    const totalPublished = await prisma.blogPost.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date(),
        },
      },
    });

    console.log(`\n📊 Final Statistics:`);
    console.log(`   Posts with future dates: ${remainingFuturePosts}`);
    console.log(`   Posts with past/current dates: ${totalPublished}`);
    console.log(`   Total published posts: ${totalPublished + remainingFuturePosts}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixBlogPostDates()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

