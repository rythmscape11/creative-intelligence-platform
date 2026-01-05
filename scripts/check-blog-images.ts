import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBlogImages() {
  console.log('🔍 Checking blog posts for missing featured images...\n');

  const publishedPosts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImage: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  console.log(`📊 Total published posts: ${publishedPosts.length}\n`);

  const postsWithoutImages = publishedPosts.filter(post => !post.featuredImage);
  const postsWithImages = publishedPosts.filter(post => post.featuredImage);

  console.log(`✅ Posts with images: ${postsWithImages.length}`);
  console.log(`❌ Posts without images: ${postsWithoutImages.length}\n`);

  if (postsWithoutImages.length > 0) {
    console.log('📝 Posts missing featured images:');
    console.log('─'.repeat(80));
    postsWithoutImages.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.publishedAt?.toLocaleDateString() || 'N/A'}`);
      console.log('');
    });
  }

  console.log('\n📋 Latest 3 posts (shown on homepage):');
  console.log('─'.repeat(80));
  const latest3 = publishedPosts.slice(0, 3);
  latest3.forEach((post, index) => {
    const hasImage = post.featuredImage ? '✅' : '❌';
    console.log(`${index + 1}. ${hasImage} ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Image: ${post.featuredImage || 'MISSING'}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkBlogImages().catch(console.error);

