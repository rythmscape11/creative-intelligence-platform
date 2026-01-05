import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBlogPosts() {
  try {
    console.log('🔍 Checking blog posts in database...\n');

    // Count total posts
    const totalPosts = await prisma.blogPost.count();
    console.log(`📊 Total blog posts: ${totalPosts}`);

    // Count by status
    const publishedCount = await prisma.blogPost.count({
      where: { status: 'PUBLISHED' },
    });
    const draftCount = await prisma.blogPost.count({
      where: { status: 'DRAFT' },
    });
    const scheduledCount = await prisma.blogPost.count({
      where: { status: 'SCHEDULED' },
    });
    const archivedCount = await prisma.blogPost.count({
      where: { status: 'ARCHIVED' },
    });

    console.log(`\n📈 Posts by status:`);
    console.log(`  ✅ PUBLISHED: ${publishedCount}`);
    console.log(`  📝 DRAFT: ${draftCount}`);
    console.log(`  ⏰ SCHEDULED: ${scheduledCount}`);
    console.log(`  📦 ARCHIVED: ${archivedCount}`);

    // Sample a few posts
    if (totalPosts > 0) {
      console.log(`\n📄 Sample posts (first 5):`);
      const samplePosts = await prisma.blogPost.findMany({
        take: 5,
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      samplePosts.forEach((post, idx) => {
        console.log(`\n  ${idx + 1}. ${post.title}`);
        console.log(`     Status: ${post.status}`);
        console.log(`     Author: ${post.author.name} (${post.author.email})`);
        console.log(`     Category: ${post.category.name}`);
        console.log(`     Published: ${post.publishedAt ? post.publishedAt.toISOString() : 'Not published'}`);
        console.log(`     Created: ${post.createdAt.toISOString()}`);
      });
    }

    // Check categories
    const categoryCount = await prisma.category.count();
    console.log(`\n\n📁 Total categories: ${categoryCount}`);

    if (categoryCount > 0) {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: {
              blogPosts: true,
            },
          },
        },
      });

      console.log(`\n📂 Categories with post counts:`);
      categories.forEach((cat) => {
        console.log(`  - ${cat.name}: ${cat._count.blogPosts} posts`);
      });
    }

    // Check tags
    const tagCount = await prisma.tag.count();
    console.log(`\n\n🏷️  Total tags: ${tagCount}`);

    // Check users (authors)
    const userCount = await prisma.user.count();
    console.log(`\n👥 Total users: ${userCount}`);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        include: {
          _count: {
            select: {
              blogPosts: true,
            },
          },
        },
      });

      console.log(`\n✍️  Users with blog post counts:`);
      users.forEach((user) => {
        console.log(`  - ${user.name} (${user.email}): ${user._count.blogPosts} posts`);
      });
    }

    console.log('\n✅ Database check complete!\n');
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogPosts();

