/**
 * Upgrade Modal Component
 * 
 * Reusable modal that appears when a user tries to access a gated feature.
 * Shows the required plan and links to pricing page.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Crown, Sparkles, Zap, ArrowRight } from 'lucide-react';

export interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
    currentTier: string;
    requiredTier: string;
    benefits?: string[];
}

const tierIcons: Record<string, React.ElementType> = {
    PRO: Zap,
    AGENCY: Crown,
    ENTERPRISE: Sparkles,
};

const tierColors: Record<string, string> = {
    PRO: 'from-green-500 to-emerald-600',
    AGENCY: 'from-blue-500 to-indigo-600',
    ENTERPRISE: 'from-purple-500 to-violet-600',
};

export function UpgradeModal({
    isOpen,
    onClose,
    feature,
    currentTier,
    requiredTier,
    benefits = [],
}: UpgradeModalProps) {
    const router = useRouter();
    const Icon = tierIcons[requiredTier] || Zap;
    const gradientColors = tierColors[requiredTier] || 'from-blue-500 to-indigo-600';

    const defaultBenefits: Record<string, string[]> = {
        PRO: [
            'Unlimited AI strategies',
            'Clean PDF/PPTX/DOCX exports (no watermarks)',
            'Advanced AI insights & recommendations',
            'Email support (24h response)',
        ],
        AGENCY: [
            'Everything in Pro',
            'Full white-label reports',
            'Ad platform integration',
            '10 team seats',
            'Basic API access (10,000 calls/mo)',
        ],
        ENTERPRISE: [
            'Everything in Agency',
            'Unlimited API calls',
            'Dedicated account manager',
            'Custom AI model training',
            'SLA guarantee (99.9% uptime)',
        ],
    };

    const displayBenefits = benefits.length > 0 ? benefits : (defaultBenefits[requiredTier] || []);

    const handleUpgrade = () => {
        router.push('/pricing');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className={`mx-auto mb-4 p-3 rounded-full bg-gradient-to-r ${gradientColors}`}>
                        <Icon className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Upgrade to {requiredTier}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        <span className="font-semibold">{feature}</span> requires a {requiredTier} plan or higher.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        With {requiredTier}, you get:
                    </div>
                    <ul className="space-y-2">
                        {displayBenefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                                <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${gradientColors}`}>
                                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Maybe Later
                    </Button>
                    <Button
                        onClick={handleUpgrade}
                        className={`w-full sm:w-auto bg-gradient-to-r ${gradientColors} hover:opacity-90`}
                    >
                        Upgrade Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Hook to manage upgrade modal state
 */
export function useUpgradeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [modalProps, setModalProps] = useState<Omit<UpgradeModalProps, 'isOpen' | 'onClose'>>({
        feature: '',
        currentTier: 'FREE',
        requiredTier: 'PRO',
    });

    const showUpgradeModal = (props: Omit<UpgradeModalProps, 'isOpen' | 'onClose'>) => {
        setModalProps(props);
        setIsOpen(true);
    };

    const hideUpgradeModal = () => {
        setIsOpen(false);
    };

    return {
        isOpen,
        modalProps,
        showUpgradeModal,
        hideUpgradeModal,
    };
}
