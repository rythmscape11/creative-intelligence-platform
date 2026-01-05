
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function resetPlans() {
    console.log('🔄 Resetting Razorpay Plan IDs in DB...');

    await prisma.pricingPlan.updateMany({
        where: { id: { in: ['PRO', 'AGENCY'] } },
        data: {
            razorpayIdMonthly: null,
            razorpayIdYearly: null,
        }
    });

    console.log('✅ Plan IDs cleared. Please run sync script now.');
}

resetPlans()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
