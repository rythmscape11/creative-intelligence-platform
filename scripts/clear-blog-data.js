/*
  Clears existing blog posts to avoid duplicates before re-seeding.
  Safe: only deletes BlogPost rows. Categories, Tags, and Users remain.
*/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing existing blog data...');
  const before = await prisma.blogPost.count();
  const res = await prisma.blogPost.deleteMany({});
  const after = await prisma.blogPost.count();
  console.log(`✅ Deleted ${res.count} blog posts (before: ${before}, after: ${after})`);
}

main()
  .catch((e) => {
    console.error('❌ Failed to clear blog data:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

