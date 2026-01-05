'use client';

import { useRouter } from 'next/navigation';
import { useToolAccess } from '@/hooks/use-tool-access';
import { Button } from '@/components/ui/button';
import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ToolGateProps {
    toolId: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Component to gate access to tools based on user plan
 * Shows upgrade prompt if user doesn't have access
 */
export function ToolGate({ toolId, children, fallback }: ToolGateProps) {
    const { isLoading, hasAccess, userPlan, isAdmin } = useToolAccess();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (hasAccess(toolId) || isAdmin) {
        return <>{children}</>;
    }

    // Show fallback or default upgrade prompt
    if (fallback) {
        return <>{fallback}</>;
    }

    return <UpgradePrompt toolId={toolId} currentPlan={userPlan} />;
}

interface UpgradePromptProps {
    toolId: string;
    currentPlan: string;
}

function UpgradePrompt({ toolId, currentPlan }: UpgradePromptProps) {
    const planMessages: Record<string, { plan: string; price: string; features: string[] }> = {
        'lead-chaser': {
            plan: 'Agency',
            price: '$299/mo',
            features: ['Automated lead nurturing', 'Email sequences', 'Lead scoring'],
        },
        'blog-automation': {
            plan: 'Agency',
            price: '$299/mo',
            features: ['AI blog generation', 'Auto-scheduling', 'SEO optimization'],
        },
        'competitor-analysis': {
            plan: 'Pro',
            price: '$49/mo',
            features: ['Competitor tracking', 'Market analysis', 'AI insights'],
        },
        'agency-branding': {
            plan: 'Agency',
            price: '$299/mo',
            features: ['White-label reports', 'Custom logos', 'Client branding'],
        },
        'enhanced-strategy': {
            plan: 'Pro',
            price: '$49/mo',
            features: ['Director-level strategies', 'Advanced AI', 'Export options'],
        },
    };

    const info = planMessages[toolId] || {
        plan: 'Pro',
        price: '$49/mo',
        features: ['Advanced features', 'Priority support'],
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-b from-muted/50 to-background rounded-xl border border-border">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <LockClosedIcon className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-2">
                Upgrade to {info.plan}
            </h2>

            <p className="text-muted-foreground text-center max-w-md mb-6">
                You're currently on the <strong>{currentPlan}</strong> plan.
                Unlock this feature by upgrading to {info.plan}.
            </p>

            <div className="flex flex-col items-center gap-2 mb-8">
                {info.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <SparklesIcon className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/pricing">
                    <Button size="lg" className="px-8">
                        Upgrade to {info.plan} • {info.price}
                    </Button>
                </Link>
                <Link href="/demo?plan=agency">
                    <Button variant="outline" size="lg">
                        Book a Demo
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default ToolGate;
