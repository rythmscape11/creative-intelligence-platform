import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { EnhancedStrategyBuilder } from '@/components/strategy/enhanced-strategy-builder';
import { EnhancedStrategyInput } from '@/lib/validations/enhanced-strategy';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export const metadata: Metadata = {
    title: 'Edit Strategy | Aureon One',
    description: 'Edit your marketing strategy inputs and regenerate insights.',
};

export default async function EditStrategyPage({ params }: PageProps) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
        redirect('/auth/signin');
    }

    try {
        const strategy = await prisma.marketingStrategy.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                input: true,
            },
        });

        if (!strategy) {
            notFound();
        }

        // Parse the input JSON into the typed object
        const initialData = JSON.parse(strategy.input) as Partial<EnhancedStrategyInput>;

        return (
            <div className="min-h-screen bg-bg-primary">
                {/* Header */}
                <div className="bg-bg-secondary border-b border-border-primary">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-text-primary">
                                        Edit Marketing Strategy
                                    </h1>
                                    <p className="mt-2 text-text-secondary">
                                        Update your business details and regenerate your strategy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Strategy Builder with Initial Data */}
                <div className="py-8">
                    <EnhancedStrategyBuilder initialData={initialData} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading strategy for edit:', error);
        notFound();
    }
}
