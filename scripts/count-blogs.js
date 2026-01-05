/*
  Counts total blog posts and published posts, plus category/tag counts.
*/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.blogPost.count();
  const published = await prisma.blogPost.count({ where: { status: 'PUBLISHED' } });
  const categories = await prisma.category.count();
  const tags = await prisma.tag.count();
  console.log(JSON.stringify({ total, published, categories, tags }, null, 2));
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

