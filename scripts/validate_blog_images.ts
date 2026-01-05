import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const posts = await prisma.blogPost.findMany({
            select: {
                id: true,
                title: true,
                featuredImage: true,
            },
        });

        console.log(`Checking ${posts.length} blog images...`);

        for (const post of posts) {
            if (!post.featuredImage) {
                console.log(`[MISSING] ${post.title} (ID: ${post.id})`);
                continue;
            }

            try {
                const response = await fetch(post.featuredImage, { method: 'HEAD' });
                if (!response.ok) {
                    console.log(`[BROKEN] ${post.title} (ID: ${post.id}) - Status: ${response.status} - URL: ${post.featuredImage}`);
                } else {
                    // console.log(`[OK] ${post.title}`);
                }
            } catch (error) {
                console.log(`[ERROR] ${post.title} (ID: ${post.id}) - ${error.message} - URL: ${post.featuredImage}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
