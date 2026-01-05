import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const posts = await prisma.blogPost.findMany({
            select: {
                id: true,
                title: true,
                featuredImage: true,
                slug: true,
            },
        });

        console.log('Checking Blog Post Images:');
        posts.forEach(post => {
            console.log(`[${post.id}] ${post.title}`);
            console.log(`  Slug: ${post.slug}`);
            console.log(`  Image: ${post.featuredImage || 'NULL'}`);
            console.log('---');
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
