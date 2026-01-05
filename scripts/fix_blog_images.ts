import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REPLACEMENT_IMAGES = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', // Marketing chart
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', // Analytics
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80', // Digital Marketing
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', // Team meeting
];

const BROKEN_IDS = [
    'cmgno8lyz004bf49gycct201a',
    'cmgzeous200gojyflks2yvooo',
    'cmgzenzrb000fjyfl87ku9328',
    'cmh8q7b9t0001isqlkc4ot18r'
];

async function main() {
    try {
        console.log('Fixing broken blog images...');

        for (let i = 0; i < BROKEN_IDS.length; i++) {
            const id = BROKEN_IDS[i];
            const image = REPLACEMENT_IMAGES[i % REPLACEMENT_IMAGES.length];

            const updated = await prisma.blogPost.update({
                where: { id },
                data: { featuredImage: image },
            });

            console.log(`Updated [${updated.title}] with new image.`);
        }
    } catch (error) {
        console.error('Error fixing images:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
