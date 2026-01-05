/**
 * CTA Widget
 * Floating call-to-action button
 * 
 * Usage: <script src="https://mediaplanpro.com/widgets/cta.js" data-user="USER_ID" data-text="Get Started" data-url="/signup"></script>
 */

(function () {
    'use strict';

    const API_BASE = 'https://mediaplanpro.com';
    const script = document.currentScript;
    const userId = script?.getAttribute('data-user');
    const ctaText = script?.getAttribute('data-text') || 'Get Started';
    const ctaUrl = script?.getAttribute('data-url') || '#';
    const position = script?.getAttribute('data-position') || 'bottom-right';

    if (!userId) {
        console.error('[MediaPlanPro] CTA widget: data-user attribute required');
        return;
    }

    // Widget styles
    const styles = `
    .mpp-cta-button {
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 24px;' : 'top: 24px;'}
      ${position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      z-index: 999999;
      transition: transform 0.3s, box-shadow 0.3s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      cursor: pointer;
      border: none;
    }
    .mpp-cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
    }
    .mpp-cta-button:active {
      transform: translateY(0);
    }
  `;

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create CTA button
    const button = document.createElement('a');
    button.className = 'mpp-cta-button';
    button.href = ctaUrl;
    button.textContent = ctaText;
    document.body.appendChild(button);

    // Track clicks
    button.addEventListener('click', () => {
        fetch(`${API_BASE}/api/growth-suite/heatmaps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionStorage.getItem('mpp_session_id') || 'unknown',
                eventType: 'cta_click',
                properties: {
                    text: ctaText,
                    url: ctaUrl,
                    page: window.location.href,
                },
            }),
        });
    });

    console.log('[MediaPlanPro] CTA widget initialized');
})();
