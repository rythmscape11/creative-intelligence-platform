/**
 * Widget Generator - Generate JavaScript snippets for conversion widgets
 * No external dependencies - pure JavaScript widget code generation
 */

export type WidgetType = 'exit-intent' | 'slide-in' | 'sticky-bar' | 'social-proof' | 'countdown' | 'popup';

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  delay?: number;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
}

/**
 * Generate Exit Intent Popup widget code
 */
function generateExitIntentPopup(config: WidgetConfig): string {
  return `<!-- Exit Intent Popup Widget -->
<script>
(function() {
  let shown = false;
  
  function showExitPopup() {
    if (shown) return;
    shown = true;
    
    const overlay = document.createElement('div');
    overlay.id = 'exit-intent-overlay';
    overlay.style.cssText = \`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-center;
      animation: fadeIn 0.3s ease-in;
    \`;
    
    const popup = document.createElement('div');
    popup.style.cssText = \`
      background: ${config.backgroundColor || '#ffffff'};
      color: ${config.textColor || '#000000'};
      padding: 40px;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      animation: slideUp 0.3s ease-out;
    \`;
    
    popup.innerHTML = \`
      <button id="close-popup" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: ${config.textColor || '#000000'};">&times;</button>
      <h2 style="margin: 0 0 15px 0; font-size: 28px; font-weight: bold;">${config.title}</h2>
      <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">${config.message}</p>
      <a href="${config.buttonUrl}" style="display: inline-block; background: ${config.buttonColor || '#F59E0B'}; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">${config.buttonText}</a>
    \`;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    document.getElementById('close-popup').onclick = function() {
      overlay.remove();
    };
    
    overlay.onclick = function(e) {
      if (e.target === overlay) overlay.remove();
    };
  }
  
  document.addEventListener('mouseout', function(e) {
    if (e.clientY < 0) showExitPopup();
  });
  
  const style = document.createElement('style');
  style.textContent = \`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  \`;
  document.head.appendChild(style);
})();
</script>`;
}

/**
 * Generate Slide-in widget code
 */
function generateSlideIn(config: WidgetConfig): string {
  const position = config.position || 'bottom-right';
  const positionStyles = {
    'bottom-right': 'bottom: 20px; right: 20px;',
    'bottom-left': 'bottom: 20px; left: 20px;',
    'top-right': 'top: 20px; right: 20px;',
    'top-left': 'top: 20px; left: 20px;'
  };

  return `<!-- Slide-in Widget -->
<script>
(function() {
  setTimeout(function() {
    const widget = document.createElement('div');
    widget.id = 'slide-in-widget';
    widget.style.cssText = \`
      position: fixed;
      ${positionStyles[position as keyof typeof positionStyles] || positionStyles['bottom-right']}
      background: ${config.backgroundColor || '#ffffff'};
      color: ${config.textColor || '#000000'};
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 350px;
      z-index: 999999;
      animation: slideIn 0.5s ease-out;
    \`;
    
    widget.innerHTML = \`
      <button id="close-slide-in" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer; color: ${config.textColor || '#000000'};">&times;</button>
      <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold;">${config.title}</h3>
      <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">${config.message}</p>
      <a href="${config.buttonUrl}" style="display: inline-block; background: ${config.buttonColor || '#F59E0B'}; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">${config.buttonText}</a>
    \`;
    
    document.body.appendChild(widget);
    
    document.getElementById('close-slide-in').onclick = function() {
      widget.remove();
    };
  }, ${config.delay || 3000});
  
  const style = document.createElement('style');
  style.textContent = \`
    @keyframes slideIn {
      from { transform: translateX(${position.includes('right') ? '100%' : '-100%'}); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  \`;
  document.head.appendChild(style);
})();
</script>`;
}

/**
 * Generate Sticky Bar widget code
 */
function generateStickyBar(config: WidgetConfig): string {
  const position = config.position || 'top';

  return `<!-- Sticky Bar Widget -->
<script>
(function() {
  const bar = document.createElement('div');
  bar.id = 'sticky-bar';
  bar.style.cssText = \`
    position: fixed;
    ${position}: 0;
    left: 0;
    width: 100%;
    background: ${config.backgroundColor || '#000000'};
    color: ${config.textColor || '#ffffff'};
    padding: 15px 20px;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    animation: slideDown 0.5s ease-out;
  \`;
  
  bar.innerHTML = \`
    <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 20px;">
      <span style="font-weight: bold; font-size: 16px;">${config.title}</span>
      <span style="font-size: 14px;">${config.message}</span>
      <a href="${config.buttonUrl}" style="background: ${config.buttonColor || '#F59E0B'}; color: #000; padding: 10px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; white-space: nowrap;">${config.buttonText}</a>
    </div>
    <button id="close-bar" style="background: none; border: none; color: ${config.textColor || '#ffffff'}; font-size: 24px; cursor: pointer; padding: 0 10px;">&times;</button>
  \`;
  
  document.body.appendChild(bar);
  
  // Add padding to body to prevent content overlap
  document.body.style.paddingTop = position === 'top' ? '60px' : '0';
  document.body.style.paddingBottom = position === 'bottom' ? '60px' : '0';
  
  document.getElementById('close-bar').onclick = function() {
    bar.remove();
    document.body.style.paddingTop = '0';
    document.body.style.paddingBottom = '0';
  };
  
  const style = document.createElement('style');
  style.textContent = \`
    @keyframes slideDown {
      from { transform: translateY(${position === 'top' ? '-100%' : '100%'}); }
      to { transform: translateY(0); }
    }
  \`;
  document.head.appendChild(style);
})();
</script>`;
}

/**
 * Generate Social Proof widget code
 */
function generateSocialProof(config: WidgetConfig): string {
  return `<!-- Social Proof Widget -->
<script>
(function() {
  const notifications = [
    { name: 'Sarah M.', action: 'just signed up', time: '2 minutes ago' },
    { name: 'John D.', action: 'made a purchase', time: '5 minutes ago' },
    { name: 'Emily R.', action: 'started a trial', time: '8 minutes ago' },
    { name: 'Michael B.', action: 'joined the community', time: '12 minutes ago' }
  ];
  
  let currentIndex = 0;
  
  function showNotification() {
    const notification = notifications[currentIndex];
    currentIndex = (currentIndex + 1) % notifications.length;
    
    const widget = document.createElement('div');
    widget.className = 'social-proof-notification';
    widget.style.cssText = \`
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: ${config.backgroundColor || '#ffffff'};
      color: ${config.textColor || '#000000'};
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 300px;
      z-index: 999999;
      animation: slideInLeft 0.5s ease-out, slideOutLeft 0.5s ease-in 4.5s;
      display: flex;
      align-items: center;
      gap: 12px;
    \`;
    
    widget.innerHTML = \`
      <div style="width: 40px; height: 40px; border-radius: 50%; background: ${config.buttonColor || '#F59E0B'}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000;">
        \${notification.name.charAt(0)}
      </div>
      <div style="flex: 1;">
        <div style="font-weight: bold; font-size: 14px;">\${notification.name}</div>
        <div style="font-size: 12px; opacity: 0.8;">\${notification.action}</div>
        <div style="font-size: 11px; opacity: 0.6;">\${notification.time}</div>
      </div>
    \`;
    
    document.body.appendChild(widget);
    
    setTimeout(() => widget.remove(), 5000);
  }
  
  // Show first notification after delay
  setTimeout(showNotification, ${config.delay || 5000});
  
  // Show subsequent notifications every 15 seconds
  setInterval(showNotification, 15000);
  
  const style = document.createElement('style');
  style.textContent = \`
    @keyframes slideInLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutLeft {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(-100%); opacity: 0; }
    }
  \`;
  document.head.appendChild(style);
})();
</script>`;
}

/**
 * Generate Countdown Timer widget code
 */
function generateCountdown(config: WidgetConfig): string {
  return `<!-- Countdown Timer Widget -->
<script>
(function() {
  const widget = document.createElement('div');
  widget.id = 'countdown-widget';
  widget.style.cssText = \`
    position: fixed;
    ${config.position === 'top' ? 'top' : 'bottom'}: 0;
    left: 0;
    width: 100%;
    background: ${config.backgroundColor || '#000000'};
    color: ${config.textColor || '#ffffff'};
    padding: 20px;
    z-index: 999999;
    text-align: center;
  \`;
  
  widget.innerHTML = \`
    <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 30px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 200px;">
        <div style="font-weight: bold; font-size: 18px; margin-bottom: 5px;">${config.title}</div>
        <div style="font-size: 14px;">${config.message}</div>
      </div>
      <div id="countdown-timer" style="display: flex; gap: 15px; font-weight: bold; font-size: 24px;"></div>
      <a href="${config.buttonUrl}" style="background: ${config.buttonColor || '#F59E0B'}; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; white-space: nowrap;">${config.buttonText}</a>
    </div>
  \`;
  
  document.body.appendChild(widget);
  
  // Countdown to end of day
  function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const diff = endOfDay - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown-timer').innerHTML = \`
      <span>\$\{hours.toString().padStart(2, '0')\}h</span>
      <span>\$\{minutes.toString().padStart(2, '0')\}m</span>
      <span>\$\{seconds.toString().padStart(2, '0')\}s</span>
    \`;
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
</script>`;
}

/**
 * Generate widget code based on type
 */
export function generateWidgetCode(config: WidgetConfig): string {
  switch (config.type) {
    case 'exit-intent':
      return generateExitIntentPopup(config);
    case 'slide-in':
      return generateSlideIn(config);
    case 'sticky-bar':
      return generateStickyBar(config);
    case 'social-proof':
      return generateSocialProof(config);
    case 'countdown':
      return generateCountdown(config);
    default:
      return generateExitIntentPopup(config);
  }
}

