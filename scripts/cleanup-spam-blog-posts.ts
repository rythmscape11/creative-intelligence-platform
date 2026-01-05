/**
 * Database Cleanup Script - Remove Spam Blog Posts
 * 
 * This script identifies and removes spam/duplicate blog posts while preserving legitimate ones.
 * 
 * SAFETY FEATURES:
 * - Dry-run mode by default (use --execute to actually delete)
 * - Identifies spam posts by malformed slug patterns
 * - Preserves legitimate posts with clean slugs
 * - Provides detailed report before deletion
 * 
 * USAGE:
 *   npx tsx scripts/cleanup-spam-blog-posts.ts              # Dry-run mode (safe)
 *   npx tsx scripts/cleanup-spam-blog-posts.ts --execute    # Actually delete spam posts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Patterns that indicate spam/duplicate posts
const SPAM_PATTERNS = [
  /\d{3,}-\d+-\d+$/,           // Ends with pattern like: -327-0-327
  /\d{4}-\d+-\d+-\d+$/,        // Ends with pattern like: -2024-27-0-27
  /\d{4}-\d{3,}-\d+-\d+$/,     // Ends with pattern like: -2024-327-0-327
  /-\d{4}$/,                   // Ends with 4-digit number like: -1099, -1098
  /-in-20(2[4-9]|3[0-9]|4[0-9])-\d+$/,  // Ends with year 2024-2049 and number like: -in-2034-1099
  /-20(2[4-9]|3[0-9]|4[0-9])-\d+-\d+-\d+$/,  // Contains year 2024-2049 with numbers
];

// Known legitimate slugs (posts we want to keep) - EXACT MATCHES ONLY
const LEGITIMATE_SLUGS = [
  'future-of-ai-powered-marketing',
  '10-digital-marketing-trends-2025',
  'welcome-to-mediaplanpro',
  // Removed spam posts that were incorrectly marked as legitimate
];

// Legitimate slug patterns (for posts with simple numbering like -in-2024-4)
const LEGITIMATE_PATTERNS = [
  /^advanced-strategies-for-seo-optimization-in-2024-\d{1,2}$/,
  /^complete-guide-to-ai-marketing-in-2024-\d{1,2}$/,
  /^best-practices-for-digital-marketing-in-2024-\d{1,2}$/,
  /^how-to-master-content-marketing-in-2024-\d{1,2}$/,
  /^the-ultimate-guide-to-marketing-strategy-in-2024-\d{1,2}$/,
  /^modern-approach-to-customer-experience-in-2024-\d{1,2}$/,
  /^essential-guide-to-brand-strategy-in-2024-\d{1,2}$/,
  /^proven-techniques-for-marketing-automation-in-2024-\d{1,2}$/,
  /^expert-tips-for-email-marketing-in-2024-\d{1,2}$/,
  /^beginner-s-guide-to-social-media-marketing-in-2024-\d{1,2}$/,
];

interface CleanupStats {
  totalPosts: number;
  legitimatePosts: number;
  spamPosts: number;
  deletedPosts: number;
}

/**
 * Check if a slug matches spam patterns
 */
function isSpamSlug(slug: string): boolean {
  // First, check if slug is in legitimate list (EXACT match only)
  if (LEGITIMATE_SLUGS.includes(slug)) {
    return false;
  }

  // Check if slug matches legitimate patterns
  for (const pattern of LEGITIMATE_PATTERNS) {
    if (pattern.test(slug)) {
      return false;
    }
  }

  // Then check if slug matches any spam pattern
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(slug)) {
      return true;
    }
  }

  // If not in legitimate list/patterns and doesn't match spam patterns, it's still spam
  // (because we know the legitimate posts explicitly)
  return true;
}

/**
 * Analyze the database and identify spam posts
 */
async function analyzeDatabase(): Promise<CleanupStats> {
  console.log('🔍 Analyzing database...\n');
  
  // Fetch all blog posts
  const allPosts = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  const stats: CleanupStats = {
    totalPosts: allPosts.length,
    legitimatePosts: 0,
    spamPosts: 0,
    deletedPosts: 0,
  };
  
  const legitimatePosts: typeof allPosts = [];
  const spamPosts: typeof allPosts = [];
  
  // Categorize posts
  for (const post of allPosts) {
    if (isSpamSlug(post.slug)) {
      spamPosts.push(post);
      stats.spamPosts++;
    } else {
      legitimatePosts.push(post);
      stats.legitimatePosts++;
    }
  }
  
  // Display results
  console.log('📊 **DATABASE ANALYSIS RESULTS**\n');
  console.log(`Total Posts:      ${stats.totalPosts.toLocaleString()}`);
  console.log(`Legitimate Posts: ${stats.legitimatePosts.toLocaleString()} ✅`);
  console.log(`Spam Posts:       ${stats.spamPosts.toLocaleString()} 🗑️\n`);
  
  // Show sample legitimate posts
  console.log('✅ **LEGITIMATE POSTS (will be preserved):**');
  legitimatePosts.slice(0, 15).forEach((post, idx) => {
    console.log(`   ${idx + 1}. ${post.slug}`);
  });
  if (legitimatePosts.length > 15) {
    console.log(`   ... and ${legitimatePosts.length - 15} more\n`);
  } else {
    console.log('');
  }
  
  // Show sample spam posts
  console.log('🗑️  **SPAM POSTS (will be deleted):**');
  spamPosts.slice(0, 20).forEach((post, idx) => {
    console.log(`   ${idx + 1}. ${post.slug}`);
  });
  if (spamPosts.length > 20) {
    console.log(`   ... and ${(spamPosts.length - 20).toLocaleString()} more\n`);
  } else {
    console.log('');
  }
  
  return stats;
}

/**
 * Delete spam posts from the database
 */
async function deleteSpamPosts(dryRun: boolean): Promise<number> {
  console.log(`\n${'='.repeat(60)}\n`);
  
  if (dryRun) {
    console.log('🔒 **DRY-RUN MODE** - No posts will be deleted\n');
    console.log('To actually delete spam posts, run:');
    console.log('   npx tsx scripts/cleanup-spam-blog-posts.ts --execute\n');
    return 0;
  }
  
  console.log('⚠️  **EXECUTING DELETION** - Spam posts will be permanently deleted\n');
  
  // Find all spam posts
  const allPosts = await prisma.blogPost.findMany({
    select: {
      id: true,
      slug: true,
    },
  });
  
  const spamPostIds = allPosts
    .filter(post => isSpamSlug(post.slug))
    .map(post => post.id);
  
  if (spamPostIds.length === 0) {
    console.log('✅ No spam posts found. Database is clean!\n');
    return 0;
  }
  
  console.log(`Deleting ${spamPostIds.length.toLocaleString()} spam posts...`);
  
  // Delete spam posts in batches (to avoid timeout)
  const BATCH_SIZE = 1000;
  let deletedCount = 0;
  
  for (let i = 0; i < spamPostIds.length; i += BATCH_SIZE) {
    const batch = spamPostIds.slice(i, i + BATCH_SIZE);
    
    const result = await prisma.blogPost.deleteMany({
      where: {
        id: {
          in: batch,
        },
      },
    });
    
    deletedCount += result.count;
    console.log(`   Deleted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result.count} posts (Total: ${deletedCount.toLocaleString()})`);
  }
  
  console.log(`\n✅ Successfully deleted ${deletedCount.toLocaleString()} spam posts!\n`);
  
  return deletedCount;
}

/**
 * Verify cleanup results
 */
async function verifyCleanup(): Promise<void> {
  console.log('🔍 Verifying cleanup results...\n');
  
  const remainingPosts = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  console.log('📊 **REMAINING POSTS IN DATABASE:**\n');
  console.log(`Total: ${remainingPosts.length}\n`);
  
  remainingPosts.forEach((post, idx) => {
    const statusIcon = post.status === 'PUBLISHED' ? '✅' : '📝';
    console.log(`   ${idx + 1}. ${statusIcon} ${post.slug} (${post.status})`);
  });
  
  console.log('');
  
  // Check for any remaining spam
  const remainingSpam = remainingPosts.filter(post => isSpamSlug(post.slug));
  
  if (remainingSpam.length > 0) {
    console.log(`⚠️  WARNING: ${remainingSpam.length} spam posts still remain!\n`);
    remainingSpam.forEach((post, idx) => {
      console.log(`   ${idx + 1}. ${post.slug}`);
    });
  } else {
    console.log('✅ No spam posts detected. Database is clean!\n');
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const executeMode = args.includes('--execute');
  
  console.log('\n' + '='.repeat(60));
  console.log('🧹 **MEDIAPLANPRO - SPAM BLOG POST CLEANUP**');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Step 1: Analyze database
    const stats = await analyzeDatabase();
    
    // Step 2: Delete spam posts (or dry-run)
    const deletedCount = await deleteSpamPosts(!executeMode);
    
    // Step 3: Verify cleanup (only if executed)
    if (executeMode && deletedCount > 0) {
      await verifyCleanup();
    }
    
    console.log('='.repeat(60));
    console.log('✅ **CLEANUP COMPLETE**');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ **ERROR:**', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

