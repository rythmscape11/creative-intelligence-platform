/**
 * Empty State Illustration - No Strategies Yet
 * Minimalist pastel illustration for empty states
 */

export function EmptyStateIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ maxWidth: '400px' }}
    >
      {/* Background Circle */}
      <circle
        cx="200"
        cy="150"
        r="120"
        fill="#E3F2FD"
        opacity="0.3"
        className="pulse-bg"
      />
      
      {/* Document Stack */}
      <g transform="translate(150, 80)">
        {/* Back Document */}
        <rect
          x="15"
          y="15"
          width="80"
          height="100"
          rx="8"
          fill="#F3E5F5"
          opacity="0.6"
          className="doc-float"
          style={{ animationDelay: '0.2s' }}
        />
        
        {/* Middle Document */}
        <rect
          x="8"
          y="8"
          width="80"
          height="100"
          rx="8"
          fill="#E0F2F1"
          opacity="0.8"
          className="doc-float"
          style={{ animationDelay: '0.1s' }}
        />
        
        {/* Front Document */}
        <rect
          x="0"
          y="0"
          width="80"
          height="100"
          rx="8"
          fill="white"
          stroke="#A8D8EA"
          strokeWidth="2"
          className="doc-float"
        />
        
        {/* Document Lines */}
        <g opacity="0.3">
          <line x1="15" y1="20" x2="65" y2="20" stroke="#A8D8EA" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="30" x2="55" y2="30" stroke="#A8D8EA" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="40" x2="60" y2="40" stroke="#A8D8EA" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="50" x2="50" y2="50" stroke="#A8D8EA" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        {/* Plus Icon */}
        <g transform="translate(40, 70)">
          <circle cx="0" cy="0" r="15" fill="#FFAB91" className="pulse-icon" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
      
      {/* Decorative Elements */}
      <g className="sparkle" style={{ animationDelay: '0s' }}>
        <circle cx="120" cy="100" r="3" fill="#CE93D8" />
      </g>
      <g className="sparkle" style={{ animationDelay: '0.3s' }}>
        <circle cx="280" cy="120" r="4" fill="#C5E1A5" />
      </g>
      <g className="sparkle" style={{ animationDelay: '0.6s' }}>
        <circle cx="250" cy="220" r="3" fill="#FFAB91" />
      </g>
      <g className="sparkle" style={{ animationDelay: '0.9s' }}>
        <circle cx="140" cy="200" r="4" fill="#FFD6E8" />
      </g>
    </svg>
  );
}

