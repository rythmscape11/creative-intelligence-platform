/**
 * Lead Capture Widget
 * Embeddable script for capturing visitor emails
 * 
 * Usage: <script src="https://mediaplanpro.com/widgets/lead-capture.js" data-user="USER_ID"></script>
 */

(function () {
    'use strict';

    // Configuration
    const API_BASE = 'https://mediaplanpro.com';
    const script = document.currentScript;
    const userId = script?.getAttribute('data-user');
    const widgetId = script?.getAttribute('data-widget');

    if (!userId) {
        console.error('[MediaPlanPro] Lead capture widget: data-user attribute required');
        return;
    }

    // Widget styles
    const styles = `
    .mpp-widget-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    .mpp-widget-overlay.visible {
      opacity: 1;
      visibility: visible;
    }
    .mpp-widget-container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      transform: translateY(20px);
      transition: transform 0.3s;
    }
    .mpp-widget-overlay.visible .mpp-widget-container {
      transform: translateY(0);
    }
    .mpp-widget-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    .mpp-widget-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #1a1a1a;
    }
    .mpp-widget-desc {
      color: #666;
      margin-bottom: 24px;
    }
    .mpp-widget-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
    .mpp-widget-input:focus {
      outline: none;
      border-color: #6366f1;
    }
    .mpp-widget-button {
      width: 100%;
      padding: 12px 24px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .mpp-widget-button:hover {
      background: #4f46e5;
    }
    .mpp-widget-success {
      text-align: center;
      padding: 20px;
    }
    .mpp-widget-success svg {
      width: 48px;
      height: 48px;
      color: #22c55e;
      margin-bottom: 16px;
    }
  `;

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create widget HTML
    const overlay = document.createElement('div');
    overlay.className = 'mpp-widget-overlay';
    overlay.innerHTML = `
    <div class="mpp-widget-container" style="position: relative;">
      <button class="mpp-widget-close">&times;</button>
      <div class="mpp-widget-content">
        <h2 class="mpp-widget-title">Get Our Free Guide</h2>
        <p class="mpp-widget-desc">Enter your email to receive exclusive marketing tips and strategies.</p>
        <form class="mpp-widget-form">
          <input type="email" class="mpp-widget-input" placeholder="Enter your email" required>
          <button type="submit" class="mpp-widget-button">Get Free Access</button>
        </form>
      </div>
    </div>
  `;
    document.body.appendChild(overlay);

    // Show widget after delay
    setTimeout(() => {
        // Check if already shown in session
        if (sessionStorage.getItem('mpp_widget_shown')) return;
        overlay.classList.add('visible');
        sessionStorage.setItem('mpp_widget_shown', 'true');
    }, 5000);

    // Close widget
    overlay.querySelector('.mpp-widget-close').addEventListener('click', () => {
        overlay.classList.remove('visible');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
        }
    });

    // Handle form submit
    overlay.querySelector('.mpp-widget-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = overlay.querySelector('.mpp-widget-input').value;

        try {
            // Track lead capture event
            await fetch(`${API_BASE}/api/growth-suite/widgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'lead_capture',
                    userId,
                    widgetId,
                    email,
                    page: window.location.href,
                    timestamp: new Date().toISOString(),
                }),
            });

            // Show success
            overlay.querySelector('.mpp-widget-content').innerHTML = `
        <div class="mpp-widget-success">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h2 class="mpp-widget-title">Thank You!</h2>
          <p class="mpp-widget-desc">Check your inbox for your free guide.</p>
        </div>
      `;

            setTimeout(() => {
                overlay.classList.remove('visible');
            }, 3000);
        } catch (error) {
            console.error('[MediaPlanPro] Lead capture error:', error);
        }
    });
})();
