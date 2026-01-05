/*
  Populate featured images for blog posts and avatars for users.
  - Sources featured images from Unsplash (preferred) or Picsum fallback
  - Generates avatar URLs using DiceBear when missing

  Usage:
    # Dry run (no DB writes)
    npx tsx scripts/update-blog-media.ts --dry-run

    # Update only posts missing images
    UNSPLASH_ACCESS_KEY=XXXX npx tsx scripts/update-blog-media.ts

    # Force overwrite all images/avatars
    UNSPLASH_ACCESS_KEY=XXXX npx tsx scripts/update-blog-media.ts --force
*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');

// Rate limit safety
const WAIT_MS = 120; // small delay between fetches
const MAX_PER_CATEGORY = 200; // cap fetched images per category

interface UnsplashPhoto {
  urls: { raw: string; full: string; regular: string; small: string };
  alt_description: string | null;
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function buildSearchQuery(categoryName: string) {
  // Tune keywords for marketing/business analytics imagery
  const base = `${categoryName} marketing business analytics strategy data chart presentation office team`;
  return base;
}

async function fetchUnsplashImages(query: string, count: number): Promise<string[]> {
  if (!UNSPLASH_ACCESS_KEY) return [];

  const perPage = 30;
  const pages = Math.ceil(count / perPage);
  const results: string[] = [];

  for (let page = 1; page <= pages; page++) {
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('content_filter', 'high');

    const resp = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!resp.ok) {
      console.warn('Unsplash request failed', resp.status, await resp.text());
      break;
    }

    const data = (await resp.json()) as { results: UnsplashPhoto[] };
    for (const photo of data.results) {
      // Use regular size which balances quality and bandwidth
      results.push(photo.urls.regular);
      if (results.length >= count) break;
    }
    if (results.length >= count) break;
    await sleep(WAIT_MS);
  }

  return results;
}

function picsumFallback(count: number): string[] {
  // Deterministic Picsum URLs to ensure caching and sizing
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = (i % 1000) + 1;
    // 1200x675 ~ 16:9
    out.push(`https://picsum.photos/id/${id}/1200/675`);
  }
  return out;
}

function dicebearAvatar(name: string, size = 128) {
  const seed = encodeURIComponent(name || 'User');
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&scale=100&size=${size}&backgroundType=gradientLinear`;
}

async function buildCategoryImagePool() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const pool: Record<string, string[]> = {};

  for (const cat of categories) {
    const query = buildSearchQuery(cat.name);
    let urls: string[] = [];
    if (UNSPLASH_ACCESS_KEY) {
      urls = await fetchUnsplashImages(query, Math.min(MAX_PER_CATEGORY, 120));
    }
    if (urls.length === 0) {
      urls = picsumFallback(120);
    }
    pool[cat.id] = urls;
  }

  return pool;
}

async function updateFeaturedImages() {
  const pool = await buildCategoryImagePool();

  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, categoryId: true, featuredImage: true },
    orderBy: { publishedAt: 'desc' },
  });

  let updated = 0;
  for (const post of posts) {
    const needs = FORCE || !post.featuredImage;
    if (!needs) continue;

    const images = pool[post.categoryId] || picsumFallback(50);
    const pick = images[(Math.abs(hashCode(post.id)) % images.length)];

    if (DRY_RUN) {
      console.log(`[DRY] Post ${post.id} <- ${pick}`);
      continue;
    }

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { featuredImage: pick },
    });
    updated++;
  }

  return { total: posts.length, updated };
}

async function updateAvatars() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, avatar: true },
  });

  let updated = 0;
  for (const user of users) {
    const needs = FORCE || !user.avatar;
    if (!needs) continue;

    const url = dicebearAvatar(user.name || 'User');

    if (DRY_RUN) {
      console.log(`[DRY] User ${user.id} <- ${url}`);
      continue;
    }

    await prisma.user.update({ where: { id: user.id }, data: { avatar: url } });
    updated++;
  }

  return { total: users.length, updated };
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

async function main() {
  console.log('Starting media update...');
  console.log({ FORCE, DRY_RUN, hasUnsplashKey: Boolean(UNSPLASH_ACCESS_KEY) });

  const [imgStats, avatarStats] = await Promise.all([
    updateFeaturedImages(),
    updateAvatars(),
  ]);

  console.log('Featured Images:', imgStats);
  console.log('Avatars:', avatarStats);
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

