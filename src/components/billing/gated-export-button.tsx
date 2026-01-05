/**
 * Gated Export Button
 * 
 * Export button with subscription gating.
 * Shows upgrade modal for non-paying users.
 */

'use client';

import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useSubscription } from '@/components/billing/subscription-provider';
import { UpgradeModal } from '@/components/billing/upgrade-modal';
import { Download, Lock, Loader2 } from 'lucide-react';

interface GatedExportButtonProps extends Omit<ButtonProps, 'onClick'> {
    onExport: () => Promise<void>;
    format: string;
    label?: string;
    requiredTier?: 'PRO' | 'AGENCY' | 'ENTERPRISE';
}

export function GatedExportButton({
    onExport,
    format,
    label,
    requiredTier = 'PRO',
    disabled,
    ...buttonProps
}: GatedExportButtonProps) {
    const { tier, checkFeature } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const canExport = checkFeature('export');

    const handleClick = async () => {
        if (!canExport) {
            setShowUpgradeModal(true);
            return;
        }

        setIsLoading(true);
        try {
            await onExport();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={handleClick}
                disabled={disabled || isLoading}
                {...buttonProps}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                    </>
                ) : canExport ? (
                    <>
                        <Download className="mr-2 h-4 w-4" />
                        {label || `Export ${format.toUpperCase()}`}
                    </>
                ) : (
                    <>
                        <Lock className="mr-2 h-4 w-4" />
                        {label || `Export ${format.toUpperCase()}`}
                        <span className="ml-2 text-xs bg-yellow-400/20 px-1.5 py-0.5 rounded text-yellow-600">
                            PRO
                        </span>
                    </>
                )}
            </Button>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                feature={`${format.toUpperCase()} Export`}
                currentTier={tier}
                requiredTier={requiredTier}
                benefits={[
                    'Clean exports without watermarks',
                    'PDF, PPTX, DOCX, and XLSX formats',
                    'Advanced AI insights included',
                    'Priority email support',
                ]}
            />
        </>
    );
}

/**
 * Wrapper for existing export buttons to add gating
 */
export function withExportGating<T extends { onClick?: () => void }>(
    WrappedComponent: React.ComponentType<T>
) {
    return function GatedComponent(props: T & { requiredTier?: 'PRO' | 'AGENCY' }) {
        const { tier, checkFeature } = useSubscription();
        const [showUpgradeModal, setShowUpgradeModal] = useState(false);

        const canExport = checkFeature('export');

        const handleClick = () => {
            if (!canExport) {
                setShowUpgradeModal(true);
                return;
            }
            props.onClick?.();
        };

        return (
            <>
                <WrappedComponent {...props} onClick={handleClick} />
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    feature="Export"
                    currentTier={tier}
                    requiredTier={props.requiredTier || 'PRO'}
                />
            </>
        );
    };
}
