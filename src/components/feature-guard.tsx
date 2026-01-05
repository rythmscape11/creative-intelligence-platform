'use client';

import { ReactNode } from 'react';
import { FeatureKey } from '@/lib/features';
import { useFeatures } from '@/context/feature-context';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

interface FeatureGuardProps {
    feature: FeatureKey;
    children: ReactNode;
    fallback?: ReactNode;
    showComingSoon?: boolean;
}

export function FeatureGuard({
    feature,
    children,
    fallback = null,
    showComingSoon = false
}: FeatureGuardProps) {
    const { isLive, flags } = useFeatures();
    const status = flags[feature];

    if (isLive(feature)) {
        return <>{children}</>;
    }

    if (status === 'COMING_SOON' && showComingSoon) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative opacity-60 grayscale cursor-not-allowed select-none">
                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 backdrop-blur-sm">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Coming Soon
                                </Badge>
                            </div>
                            <div className="pointer-events-none">
                                {children}
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This feature is coming soon!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return <>{fallback}</>;
}
