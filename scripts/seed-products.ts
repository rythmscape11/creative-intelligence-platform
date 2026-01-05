
import { PrismaClient } from '@prisma/client';
import { FRAMEWORK_PRODUCTS } from '../src/config/products';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding products...');

    for (const product of FRAMEWORK_PRODUCTS) {
        const existing = await prisma.product.findUnique({
            where: { slug: product.slug },
        });

        if (existing) {
            console.log(`Update product: ${product.name}`);
            await prisma.product.update({
                where: { slug: product.slug },
                data: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    currency: product.currency,
                    assets: JSON.stringify(product.assets),
                    isActive: true,
                },
            });
        } else {
            console.log(`Create product: ${product.name}`);
            await prisma.product.create({
                data: {
                    slug: product.slug,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    currency: product.currency,
                    assets: JSON.stringify(product.assets),
                    isActive: true,
                },
            });
        }
    }

    console.log('✅ Products seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
