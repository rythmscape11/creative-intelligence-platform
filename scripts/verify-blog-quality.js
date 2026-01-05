/*
  Comprehensive blog post quality verification script.
  Checks SEO metadata, content quality, and data integrity.
*/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Starting comprehensive blog quality verification...\n');

  // 1. Count verification
  const total = await prisma.blogPost.count();
  const published = await prisma.blogPost.count({ where: { status: 'PUBLISHED' } });
  console.log(`📊 Total Posts: ${total}`);
  console.log(`✅ Published Posts: ${published}`);
  console.log(`📝 Draft Posts: ${total - published}\n`);

  // 2. SEO metadata verification
  console.log('🔍 Checking SEO metadata completeness...');
  const allPosts = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      seoTitle: true,
      seoDescription: true,
      slug: true,
      excerpt: true,
    },
  });

  const missingTitle = allPosts.filter(p => !p.title || p.title === '').length;
  const missingSeoTitle = allPosts.filter(p => !p.seoTitle || p.seoTitle === '').length;
  const missingSeoDesc = allPosts.filter(p => !p.seoDescription || p.seoDescription === '').length;
  const missingSlug = allPosts.filter(p => !p.slug || p.slug === '').length;
  const missingExcerpt = allPosts.filter(p => !p.excerpt || p.excerpt === '').length;

  console.log(`  - Missing title: ${missingTitle}`);
  console.log(`  - Missing seoTitle: ${missingSeoTitle}`);
  console.log(`  - Missing seoDescription: ${missingSeoDesc}`);
  console.log(`  - Missing slug: ${missingSlug}`);
  console.log(`  - Missing excerpt: ${missingExcerpt}\n`);

  // 3. Category and tag assignments
  console.log('🔍 Checking category and tag assignments...');
  const postsWithCategories = await prisma.blogPost.findMany({ select: { categoryId: true } });
  const missingCategory = postsWithCategories.filter(p => !p.categoryId).length;
  const postsWithTags = await prisma.blogPost.findMany({
    include: { tags: true },
    take: 100,
  });
  const postsWithoutTags = postsWithTags.filter(p => p.tags.length === 0).length;

  console.log(`  - Posts without category: ${missingCategory}`);
  console.log(`  - Posts without tags (sample of 100): ${postsWithoutTags}\n`);

  // 4. Featured images
  console.log('🔍 Checking featured images...');
  const postsImages = await prisma.blogPost.findMany({ select: { featuredImage: true } });
  const missingImage = postsImages.filter(p => !p.featuredImage || p.featuredImage === '').length;
  console.log(`  - Posts without featured image: ${missingImage}\n`);

  // 5. Publication dates
  console.log('🔍 Checking publication dates...');
  const missingPubDate = await prisma.blogPost.count({ 
    where: { 
      AND: [
        { status: 'PUBLISHED' },
        { publishedAt: null }
      ]
    } 
  });
  console.log(`  - Published posts without publishedAt: ${missingPubDate}\n`);

  // 6. Random sample verification
  console.log('🔍 Sampling 10 random posts for detailed verification...\n');
  const samplePosts = await prisma.blogPost.findMany({
    include: {
      category: true,
      tags: true,
      author: true,
    },
    take: 10,
    skip: Math.floor(Math.random() * (total - 10)),
  });

  samplePosts.forEach((post, idx) => {
    const wordCount = post.content.split(/\s+/).length;
    const hasH2 = post.content.includes('<h2>');
    const hasH3 = post.content.includes('<h3>');
    const hasLinks = post.content.includes('<a href=');
    const titleLength = post.seoTitle?.length || 0;
    const descLength = post.seoDescription?.length || 0;
    
    console.log(`Sample ${idx + 1}: ${post.title.substring(0, 60)}...`);
    console.log(`  - Slug: ${post.slug}`);
    console.log(`  - Word count: ${wordCount} ${wordCount >= 2000 ? '✅' : '⚠️'}`);
    console.log(`  - SEO title length: ${titleLength} ${titleLength >= 60 && titleLength <= 70 ? '✅' : '⚠️'}`);
    console.log(`  - SEO desc length: ${descLength} ${descLength >= 150 && descLength <= 160 ? '✅' : '⚠️'}`);
    console.log(`  - Has H2 headings: ${hasH2 ? '✅' : '❌'}`);
    console.log(`  - Has H3 headings: ${hasH3 ? '✅' : '❌'}`);
    console.log(`  - Has internal links: ${hasLinks ? '✅' : '❌'}`);
    console.log(`  - Category: ${post.category?.name || 'MISSING'}`);
    console.log(`  - Tags: ${post.tags.length} tags`);
    console.log(`  - Published: ${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'NOT SET'}`);
    console.log('');
  });

  // 7. Summary
  console.log('📊 VERIFICATION SUMMARY\n');
  console.log('✅ = Pass, ⚠️ = Warning, ❌ = Fail\n');
  
  const checks = [
    { name: 'Total posts = 2000', pass: total === 2000 },
    { name: 'All posts published', pass: published === 2000 },
    { name: 'All posts have titles', pass: missingTitle === 0 },
    { name: 'All posts have SEO titles', pass: missingSeoTitle === 0 },
    { name: 'All posts have SEO descriptions', pass: missingSeoDesc === 0 },
    { name: 'All posts have slugs', pass: missingSlug === 0 },
    { name: 'All posts have excerpts', pass: missingExcerpt === 0 },
    { name: 'All posts have categories', pass: missingCategory === 0 },
    { name: 'All posts have featured images', pass: missingImage === 0 },
    { name: 'All published posts have dates', pass: missingPubDate === 0 },
  ];

  checks.forEach(check => {
    const icon = check.pass ? '✅' : '❌';
    console.log(`${icon} ${check.name}`);
  });

  const allPassed = checks.every(c => c.pass);
  console.log(`\n${allPassed ? '🎉 ALL CHECKS PASSED!' : '⚠️ SOME CHECKS FAILED'}\n`);

  // 8. Sample URLs
  console.log('🔗 Sample Blog Post URLs:\n');
  const urlSamples = await prisma.blogPost.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });
  
  urlSamples.forEach((post, idx) => {
    console.log(`${idx + 1}. http://localhost:3001/blog/${post.slug}`);
  });
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

