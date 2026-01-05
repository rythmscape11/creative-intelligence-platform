'use client';

/**
 * Nudge Tracker Hook
 * 
 * Tracks upgrade nudges shown to prevent spam.
 * Respects maxPerSession from config.
 */

import { useState, useCallback, useEffect } from 'react';
import { NUDGE_CONFIG, getNudgeByTrigger, NudgeMessage } from '@/config/upgrade-nudges';

const STORAGE_KEY = 'nudge_tracker';
const COOLDOWN_KEY = 'nudge_cooldown';

interface NudgeState {
    shownThisSession: string[];
    lastShownAt: number | null;
}

function getStoredState(): NudgeState {
    if (typeof window === 'undefined') {
        return { shownThisSession: [], lastShownAt: null };
    }

    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // Ignore parse errors
    }

    return { shownThisSession: [], lastShownAt: null };
}

function saveState(state: NudgeState) {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
}

export function useNudgeTracker() {
    const [state, setState] = useState<NudgeState>(getStoredState);
    const [currentNudge, setCurrentNudge] = useState<NudgeMessage | null>(null);

    // Sync state on mount
    useEffect(() => {
        setState(getStoredState());
    }, []);

    /**
     * Check if we can show a nudge
     */
    const canShowNudge = useCallback((): boolean => {
        if (!NUDGE_CONFIG.enabled) return false;

        // Check session limit
        if (state.shownThisSession.length >= NUDGE_CONFIG.maxPerSession) {
            return false;
        }

        // Check cooldown
        if (state.lastShownAt) {
            const cooldownMs = NUDGE_CONFIG.cooldownMinutes * 60 * 1000;
            if (Date.now() - state.lastShownAt < cooldownMs) {
                return false;
            }
        }

        return true;
    }, [state]);

    /**
     * Try to show a nudge for a trigger
     * Returns the nudge if shown, null otherwise
     */
    const tryShowNudge = useCallback((trigger: string): NudgeMessage | null => {
        if (!canShowNudge()) return null;

        const nudge = getNudgeByTrigger(trigger);
        if (!nudge) return null;

        // Check if this specific nudge was already shown
        if (state.shownThisSession.includes(nudge.id)) {
            return null;
        }

        // Update state
        const newState: NudgeState = {
            shownThisSession: [...state.shownThisSession, nudge.id],
            lastShownAt: Date.now(),
        };

        setState(newState);
        saveState(newState);
        setCurrentNudge(nudge);

        return nudge;
    }, [canShowNudge, state]);

    /**
     * Dismiss current nudge
     */
    const dismissNudge = useCallback(() => {
        setCurrentNudge(null);
    }, []);

    /**
     * Reset tracker (for testing)
     */
    const reset = useCallback(() => {
        const newState = { shownThisSession: [], lastShownAt: null };
        setState(newState);
        saveState(newState);
        setCurrentNudge(null);
    }, []);

    return {
        canShowNudge,
        tryShowNudge,
        dismissNudge,
        currentNudge,
        shownCount: state.shownThisSession.length,
        maxNudges: NUDGE_CONFIG.maxPerSession,
        reset,
    };
}
