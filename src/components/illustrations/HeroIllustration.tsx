/**
 * Hero Illustration - Marketing Strategy Concept
 * Pastel-colored SVG with animated elements
 */

export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ maxWidth: '800px' }}
    >
      {/* Background Blobs */}
      <g className="animate-float" style={{ animationDuration: '8s' }}>
        <ellipse
          cx="200"
          cy="150"
          rx="120"
          ry="100"
          fill="#E3F2FD"
          opacity="0.6"
        />
      </g>
      
      <g className="animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}>
        <ellipse
          cx="600"
          cy="400"
          rx="150"
          ry="120"
          fill="#F3E5F5"
          opacity="0.6"
        />
      </g>
      
      <g className="animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}>
        <ellipse
          cx="400"
          cy="500"
          rx="100"
          ry="80"
          fill="#E0F2F1"
          opacity="0.6"
        />
      </g>

      {/* Main Chart/Graph Illustration */}
      <g transform="translate(150, 150)">
        {/* Chart Background */}
        <rect
          x="0"
          y="0"
          width="500"
          height="350"
          rx="24"
          fill="white"
          opacity="0.9"
          filter="drop-shadow(0 10px 30px rgba(0,0,0,0.1))"
        />
        
        {/* Chart Grid Lines */}
        <g opacity="0.2">
          <line x1="50" y1="80" x2="450" y2="80" stroke="#A8D8EA" strokeWidth="1" />
          <line x1="50" y1="140" x2="450" y2="140" stroke="#A8D8EA" strokeWidth="1" />
          <line x1="50" y1="200" x2="450" y2="200" stroke="#A8D8EA" strokeWidth="1" />
          <line x1="50" y1="260" x2="450" y2="260" stroke="#A8D8EA" strokeWidth="1" />
        </g>
        
        {/* Animated Growth Line */}
        <path
          d="M 50 260 Q 150 240, 200 180 T 350 100 T 450 60"
          stroke="url(#gradient1)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="chart-line"
        />
        
        {/* Data Points */}
        <circle cx="50" cy="260" r="8" fill="#A8D8EA" className="pulse-dot" />
        <circle cx="200" cy="180" r="8" fill="#E6E6FA" className="pulse-dot" style={{ animationDelay: '0.2s' }} />
        <circle cx="350" cy="100" r="8" fill="#B2DFDB" className="pulse-dot" style={{ animationDelay: '0.4s' }} />
        <circle cx="450" cy="60" r="8" fill="#FFAB91" className="pulse-dot" style={{ animationDelay: '0.6s' }} />
        
        {/* Bar Chart Elements */}
        <g transform="translate(50, 280)">
          <rect x="0" y="0" width="60" height="40" rx="8" fill="#FFE5D9" opacity="0.8" className="bar-grow" />
          <rect x="80" y="-20" width="60" height="60" rx="8" fill="#FFD6E8" opacity="0.8" className="bar-grow" style={{ animationDelay: '0.1s' }} />
          <rect x="160" y="-40" width="60" height="80" rx="8" fill="#E3F2FD" opacity="0.8" className="bar-grow" style={{ animationDelay: '0.2s' }} />
          <rect x="240" y="-60" width="60" height="100" rx="8" fill="#F3E5F5" opacity="0.8" className="bar-grow" style={{ animationDelay: '0.3s' }} />
          <rect x="320" y="-80" width="60" height="120" rx="8" fill="#E0F2F1" opacity="0.8" className="bar-grow" style={{ animationDelay: '0.4s' }} />
        </g>
      </g>

      {/* Floating Icons */}
      <g className="animate-float" style={{ animationDuration: '6s' }}>
        {/* Lightbulb Icon */}
        <g transform="translate(100, 400)">
          <circle cx="0" cy="0" r="30" fill="#FFF8E1" opacity="0.8" />
          <path
            d="M -10 -15 Q -10 -25, 0 -25 Q 10 -25, 10 -15 Q 10 -5, 5 5 L -5 5 Q -10 -5, -10 -15 Z"
            fill="#FFAB91"
          />
          <rect x="-6" y="5" width="12" height="8" rx="2" fill="#FFAB91" opacity="0.6" />
        </g>
      </g>

      <g className="animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>
        {/* Target Icon */}
        <g transform="translate(700, 100)">
          <circle cx="0" cy="0" r="35" fill="#FCE4EC" opacity="0.8" />
          <circle cx="0" cy="0" r="20" stroke="#CE93D8" strokeWidth="3" fill="none" />
          <circle cx="0" cy="0" r="12" stroke="#CE93D8" strokeWidth="3" fill="none" />
          <circle cx="0" cy="0" r="4" fill="#CE93D8" />
        </g>
      </g>

      <g className="animate-float" style={{ animationDuration: '9s', animationDelay: '2s' }}>
        {/* Rocket Icon */}
        <g transform="translate(650, 500)">
          <circle cx="0" cy="0" r="32" fill="#E0F2F1" opacity="0.8" />
          <path
            d="M -8 10 L 0 -15 L 8 10 L 0 5 Z"
            fill="#C5E1A5"
          />
          <ellipse cx="0" cy="0" rx="4" ry="6" fill="white" />
          <path d="M -10 10 Q -12 15, -8 18" stroke="#C5E1A5" strokeWidth="2" fill="none" />
          <path d="M 10 10 Q 12 15, 8 18" stroke="#C5E1A5" strokeWidth="2" fill="none" />
        </g>
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8D8EA" />
          <stop offset="50%" stopColor="#E6E6FA" />
          <stop offset="100%" stopColor="#FFAB91" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

