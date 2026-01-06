const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMissingPayment() {
    try {
        // Find user by email
        const user = await prisma.user.findFirst({
            where: { email: 'mukherjeeanustup@gmail.com' }
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('Found user:', user.id, user.email);

        // Check if payment already exists
        const existing = await prisma.payment.findFirst({
            where: { razorpayPaymentId: 'pay_RpbPjs9O5h2pLc' }
        });

        if (existing) {
            console.log('Payment already exists');
            return;
        }

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                userId: user.id,
                razorpayPaymentId: 'pay_RpbPjs9O5h2pLc',
                razorpayOrderId: 'order_RpbPXSXIoreoT4',
                amount: 49900,
                currency: 'INR',
                status: 'SUCCEEDED',
                description: 'Credit purchase - 100 credits',
                paymentGateway: 'razorpay',
            }
        });

        console.log('Created payment:', payment.id);

        // Add credits
        const usage = await prisma.analyserUsage.upsert({
            where: { userId: user.id },
            update: {
                creditsRemaining: { increment: 100 },
            },
            create: {
                userId: user.id,
                creditsRemaining: 100,
                creditsUsed: 0,
            },
        });

        console.log('Updated credits:', usage);

    } catch (e) {
        console.log('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
addMissingPayment();
