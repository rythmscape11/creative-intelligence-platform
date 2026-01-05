'use client';

/**
 * Tool Usage Tracker Hook
 * 
 * Tracks tool usage per session and triggers email capture
 * after threshold is reached.
 */

import { useState, useCallback, useEffect } from 'react';
import { logEmailCaptured } from '@/lib/monetization-events';

const STORAGE_PREFIX = 'tool_usage_';
const ACCESS_GRANTED_KEY = 'tool_access_granted';
const CAPTURED_EMAIL_KEY = 'captured_email';
const DEFAULT_THRESHOLD = 3;

interface ToolUsageState {
    usageCount: number;
    hasAccess: boolean;
    capturedEmail: string | null;
}

export function useToolUsage(toolId: string, threshold: number = DEFAULT_THRESHOLD) {
    const [state, setState] = useState<ToolUsageState>({
        usageCount: 0,
        hasAccess: false,
        capturedEmail: null,
    });
    const [showEmailCapture, setShowEmailCapture] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const accessGranted = localStorage.getItem(ACCESS_GRANTED_KEY) === 'true';
        const capturedEmail = localStorage.getItem(CAPTURED_EMAIL_KEY);
        const usageCount = parseInt(localStorage.getItem(`${STORAGE_PREFIX}${toolId}`) || '0', 10);

        setState({
            usageCount,
            hasAccess: accessGranted,
            capturedEmail,
        });
    }, [toolId]);

    /**
     * Increment usage and check if email capture should be shown
     */
    const trackUsage = useCallback((): boolean => {
        if (typeof window === 'undefined') return false;

        // If already has access, don't track
        if (localStorage.getItem(ACCESS_GRANTED_KEY) === 'true') {
            return false;
        }

        // Increment usage count
        const key = `${STORAGE_PREFIX}${toolId}`;
        const currentCount = parseInt(localStorage.getItem(key) || '0', 10);
        const newCount = currentCount + 1;
        localStorage.setItem(key, String(newCount));

        setState(prev => ({ ...prev, usageCount: newCount }));

        // Check if threshold reached
        if (newCount >= threshold) {
            setShowEmailCapture(true);
            return true;
        }

        return false;
    }, [toolId, threshold]);

    /**
     * Grant access after email capture
     */
    const grantAccess = useCallback((email: string) => {
        if (typeof window === 'undefined') return;

        localStorage.setItem(ACCESS_GRANTED_KEY, 'true');
        localStorage.setItem(CAPTURED_EMAIL_KEY, email);

        setState(prev => ({
            ...prev,
            hasAccess: true,
            capturedEmail: email,
        }));

        setShowEmailCapture(false);

        // Log the conversion event
        logEmailCaptured(`tool:${toolId}`, toolId);
    }, [toolId]);

    /**
     * Check if user can use the tool freely
     */
    const canUseFreely = useCallback((): boolean => {
        return state.hasAccess || state.usageCount < threshold;
    }, [state.hasAccess, state.usageCount, threshold]);

    /**
     * Get remaining free uses
     */
    const remainingUses = Math.max(0, threshold - state.usageCount);

    /**
     * Dismiss email capture (doesn't grant access)
     */
    const dismissCapture = useCallback(() => {
        setShowEmailCapture(false);
    }, []);

    /**
     * Reset usage (for testing)
     */
    const resetUsage = useCallback(() => {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(`${STORAGE_PREFIX}${toolId}`);
        localStorage.removeItem(ACCESS_GRANTED_KEY);
        localStorage.removeItem(CAPTURED_EMAIL_KEY);

        setState({
            usageCount: 0,
            hasAccess: false,
            capturedEmail: null,
        });
    }, [toolId]);

    return {
        usageCount: state.usageCount,
        hasAccess: state.hasAccess,
        capturedEmail: state.capturedEmail,
        showEmailCapture,
        remainingUses,
        trackUsage,
        grantAccess,
        canUseFreely,
        dismissCapture,
        resetUsage,
    };
}

/**
 * Get usage message for display
 */
export function getUsageMessage(remainingUses: number, toolName: string): string {
    if (remainingUses <= 0) {
        return `Enter your email to continue using ${toolName} for free`;
    }
    if (remainingUses === 1) {
        return `1 free use remaining`;
    }
    return `${remainingUses} free uses remaining`;
}
