/**
 * Announcement Bar Widget
 * Top-of-page announcement banner
 * 
 * Usage: <script src="https://mediaplanpro.com/widgets/announcement.js" data-user="USER_ID" data-text="New feature live!" data-url="/features"></script>
 */

(function () {
    'use strict';

    const API_BASE = 'https://mediaplanpro.com';
    const script = document.currentScript;
    const userId = script?.getAttribute('data-user');
    const text = script?.getAttribute('data-text') || 'Check out our latest updates!';
    const linkUrl = script?.getAttribute('data-url');
    const linkText = script?.getAttribute('data-link-text') || 'Learn more';
    const bgColor = script?.getAttribute('data-bg') || '#6366f1';

    if (!userId) {
        console.error('[MediaPlanPro] Announcement widget: data-user attribute required');
        return;
    }

    // Check if dismissed
    if (localStorage.getItem('mpp_announcement_dismissed')) {
        return;
    }

    // Widget styles
    const styles = `
    .mpp-announcement {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: ${bgColor};
      color: white;
      padding: 12px 24px;
      text-align: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      animation: mpp-slide-down 0.3s ease-out;
    }
    @keyframes mpp-slide-down {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    .mpp-announcement a {
      color: white;
      text-decoration: underline;
      font-weight: 600;
    }
    .mpp-announcement-close {
      position: absolute;
      right: 16px;
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.8;
    }
    .mpp-announcement-close:hover {
      opacity: 1;
    }
    body.mpp-has-announcement {
      padding-top: 48px;
    }
  `;

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create announcement bar
    const bar = document.createElement('div');
    bar.className = 'mpp-announcement';
    bar.innerHTML = `
    <span>${text}</span>
    ${linkUrl ? `<a href="${linkUrl}">${linkText} →</a>` : ''}
    <button class="mpp-announcement-close">&times;</button>
  `;
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add('mpp-has-announcement');

    // Close button
    bar.querySelector('.mpp-announcement-close').addEventListener('click', () => {
        bar.remove();
        document.body.classList.remove('mpp-has-announcement');
        localStorage.setItem('mpp_announcement_dismissed', 'true');
    });

    // Track view
    fetch(`${API_BASE}/api/growth-suite/heatmaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: sessionStorage.getItem('mpp_session_id') || 'unknown',
            eventType: 'announcement_view',
            properties: { text, page: window.location.href },
        }),
    });

    console.log('[MediaPlanPro] Announcement widget initialized');
})();
