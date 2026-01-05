/**
 * Comprehensive Blog Image Audit and Fix Script
 * 
 * This script:
 * 1. Audits all blog posts for broken/missing images
 * 2. Validates image URLs are accessible
 * 3. Fixes broken images with valid placeholders
 * 4. Generates a detailed report
 * 
 * Usage:
 *   # Audit only (no changes)
 *   npx tsx scripts/audit-fix-blog-images.ts --audit
 * 
 *   # Fix broken images
 *   npx tsx scripts/audit-fix-blog-images.ts --fix
 * 
 *   # Force update all images
 *   UNSPLASH_ACCESS_KEY=xxx npx tsx scripts/audit-fix-blog-images.ts --fix --force
 */

import { PrismaClient } from '@prisma/client';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();

const AUDIT_ONLY = process.argv.includes('--audit');
const FIX_MODE = process.argv.includes('--fix');
const FORCE_MODE = process.argv.includes('--force');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

// Fallback placeholder images (high-quality, free-to-use)
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop', // Analytics
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop', // Charts
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop', // Meeting
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop', // Collaboration
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop', // Workspace
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=630&fit=crop', // Planning
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=630&fit=crop', // Strategy
  'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=1200&h=630&fit=crop', // Writing
  'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&h=630&fit=crop', // Social
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=630&fit=crop', // Team
];

interface AuditResult {
  total: number;
  valid: number;
  broken: number;
  missing: number;
  fixed: number;
  brokenPosts: Array<{
    id: string;
    title: string;
    imageUrl: string | null;
    reason: string;
  }>;
}

/**
 * Check if an image URL is accessible
 */
async function isImageAccessible(url: string): Promise<boolean> {
  if (!url) return false;

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;

      const req = client.request(
        {
          method: 'HEAD',
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          timeout: 5000,
        },
        (res) => {
          resolve(res.statusCode === 200 && res.headers['content-type']?.startsWith('image/'));
        }
      );

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    } catch (error) {
      resolve(false);
    }
  });
}

/**
 * Get a placeholder image for a post
 */
function getPlaceholderImage(postId: string, categoryName?: string): string {
  // Use post ID to deterministically select a placeholder
  const hash = postId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}

/**
 * Fetch image from Unsplash based on category
 */
async function fetchUnsplashImage(categoryName: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;

  try {
    const query = `${categoryName} marketing business strategy`;
    const url = new URL('https://api.unsplash.com/photos/random');
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('content_filter', 'high');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return `${data.urls.regular}&w=1200&h=630&fit=crop`;
  } catch (error) {
    console.warn('Failed to fetch from Unsplash:', error);
    return null;
  }
}

/**
 * Audit all blog posts for image issues
 */
async function auditBlogImages(): Promise<AuditResult> {
  console.log('🔍 Auditing blog post images...\n');

  const posts = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      featuredImage: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const result: AuditResult = {
    total: posts.length,
    valid: 0,
    broken: 0,
    missing: 0,
    fixed: 0,
    brokenPosts: [],
  };

  console.log(`Found ${posts.length} blog posts to audit\n`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const progress = `[${i + 1}/${posts.length}]`;

    // Check if image is missing
    if (!post.featuredImage) {
      result.missing++;
      result.brokenPosts.push({
        id: post.id,
        title: post.title,
        imageUrl: null,
        reason: 'Missing image URL',
      });
      console.log(`${progress} ❌ MISSING: "${post.title}"`);
      continue;
    }

    // Check if image URL is accessible
    const isAccessible = await isImageAccessible(post.featuredImage);

    if (!isAccessible) {
      result.broken++;
      result.brokenPosts.push({
        id: post.id,
        title: post.title,
        imageUrl: post.featuredImage,
        reason: 'Image URL not accessible',
      });
      console.log(`${progress} ❌ BROKEN: "${post.title}"`);
      console.log(`   URL: ${post.featuredImage}`);
    } else {
      result.valid++;
      console.log(`${progress} ✅ VALID: "${post.title}"`);
    }

    // Small delay to avoid rate limiting
    if (i % 10 === 0 && i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return result;
}

/**
 * Fix broken blog images
 */
async function fixBrokenImages(brokenPosts: AuditResult['brokenPosts']): Promise<number> {
  console.log(`\n🔧 Fixing ${brokenPosts.length} broken images...\n`);

  let fixed = 0;

  for (let i = 0; i < brokenPosts.length; i++) {
    const post = brokenPosts[i];
    const progress = `[${i + 1}/${brokenPosts.length}]`;

    try {
      // Try to get image from Unsplash first
      const categoryName = await prisma.blogPost
        .findUnique({
          where: { id: post.id },
          select: { category: { select: { name: true } } },
        })
        .then((p) => p?.category?.name || 'marketing');

      let newImageUrl: string | null = null;

      if (UNSPLASH_ACCESS_KEY) {
        newImageUrl = await fetchUnsplashImage(categoryName);
        await new Promise((resolve) => setTimeout(resolve, 200)); // Rate limit
      }

      // Fallback to placeholder
      if (!newImageUrl) {
        newImageUrl = getPlaceholderImage(post.id, categoryName);
      }

      // Update the post
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { featuredImage: newImageUrl },
      });

      console.log(`${progress} ✅ Fixed: "${post.title}"`);
      console.log(`   New URL: ${newImageUrl}`);
      fixed++;
    } catch (error) {
      console.error(`${progress} ❌ Failed to fix: "${post.title}"`, error);
    }
  }

  return fixed;
}

/**
 * Print audit report
 */
function printReport(result: AuditResult) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUDIT REPORT');
  console.log('='.repeat(60));
  console.log(`Total Posts:        ${result.total}`);
  console.log(`Valid Images:       ${result.valid} (${((result.valid / result.total) * 100).toFixed(1)}%)`);
  console.log(`Broken Images:      ${result.broken} (${((result.broken / result.total) * 100).toFixed(1)}%)`);
  console.log(`Missing Images:     ${result.missing} (${((result.missing / result.total) * 100).toFixed(1)}%)`);
  if (result.fixed > 0) {
    console.log(`Fixed Images:       ${result.fixed}`);
  }
  console.log('='.repeat(60));

  if (result.brokenPosts.length > 0 && AUDIT_ONLY) {
    console.log('\n⚠️  Broken Posts:');
    result.brokenPosts.slice(0, 10).forEach((post, i) => {
      console.log(`${i + 1}. "${post.title}"`);
      console.log(`   Reason: ${post.reason}`);
      if (post.imageUrl) {
        console.log(`   URL: ${post.imageUrl}`);
      }
    });
    if (result.brokenPosts.length > 10) {
      console.log(`\n... and ${result.brokenPosts.length - 10} more`);
    }
  }

  console.log('\n');
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Blog Image Audit & Fix Tool\n');
  console.log(`Mode: ${AUDIT_ONLY ? 'AUDIT ONLY' : FIX_MODE ? 'FIX' : 'AUDIT'}`);
  console.log(`Force: ${FORCE_MODE ? 'YES' : 'NO'}`);
  console.log(`Unsplash API: ${UNSPLASH_ACCESS_KEY ? 'CONFIGURED' : 'NOT CONFIGURED'}\n`);

  // Run audit
  const auditResult = await auditBlogImages();

  if (AUDIT_ONLY) {
    printReport(auditResult);
    console.log('💡 To fix broken images, run with --fix flag');
    return;
  }

  if (FIX_MODE && auditResult.brokenPosts.length > 0) {
    const fixed = await fixBrokenImages(auditResult.brokenPosts);
    auditResult.fixed = fixed;
  }

  printReport(auditResult);

  if (FIX_MODE) {
    console.log('✅ Image fix complete!');
  }
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

