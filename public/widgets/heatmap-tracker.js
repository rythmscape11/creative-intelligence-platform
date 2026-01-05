/**
 * Heatmap Tracker Widget
 * Embeddable script for tracking clicks and scroll depth
 * 
 * Usage: <script src="https://mediaplanpro.com/widgets/heatmap-tracker.js" data-user="USER_ID"></script>
 */

(function () {
    'use strict';

    const API_BASE = 'https://mediaplanpro.com';
    const script = document.currentScript;
    const userId = script?.getAttribute('data-user');

    if (!userId) {
        console.error('[MediaPlanPro] Heatmap tracker: data-user attribute required');
        return;
    }

    // Generate session ID
    let sessionId = sessionStorage.getItem('mpp_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('mpp_session_id', sessionId);
    }

    // Debounce helper
    function debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Track event
    async function trackEvent(eventType, properties) {
        try {
            await fetch(`${API_BASE}/api/growth-suite/heatmaps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    eventType,
                    properties: {
                        ...properties,
                        page: window.location.pathname,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                    },
                }),
            });
        } catch (error) {
            // Silent fail for tracking
        }
    }

    // Track pageview
    trackEvent('pageview', {
        referrer: document.referrer,
        title: document.title,
    });

    // Track clicks
    document.addEventListener('click', (e) => {
        trackEvent('click', {
            x: e.pageX,
            y: e.pageY,
            element: e.target.tagName,
            text: e.target.textContent?.substring(0, 50),
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    const trackScroll = debounce(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;

            // Track at 25%, 50%, 75%, 100%
            if ([25, 50, 75, 100].includes(scrollPercent)) {
                trackEvent('scroll', { depth: scrollPercent });
            }
        }
    }, 200);

    window.addEventListener('scroll', trackScroll);

    // Track page unload
    window.addEventListener('beforeunload', () => {
        trackEvent('leave', { maxScroll, timeOnPage: Date.now() });
    });

    console.log('[MediaPlanPro] Heatmap tracker initialized');
})();
