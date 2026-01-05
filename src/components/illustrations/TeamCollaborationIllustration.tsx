/**
 * Team Collaboration Illustration
 * Abstract people working together with pastel colors
 */

export function TeamCollaborationIllustration() {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ maxWidth: '600px' }}
    >
      {/* Background Elements */}
      <ellipse cx="300" cy="200" rx="250" ry="180" fill="#E3F2FD" opacity="0.3" />
      
      {/* Person 1 - Left */}
      <g transform="translate(150, 180)" className="person-bounce" style={{ animationDelay: '0s' }}>
        {/* Body */}
        <ellipse cx="0" cy="40" rx="35" ry="45" fill="#FFE5D9" />
        {/* Head */}
        <circle cx="0" cy="0" r="25" fill="#FFAB91" />
        {/* Hair */}
        <path d="M -20 -5 Q -25 -15, -15 -20 Q 0 -25, 15 -20 Q 25 -15, 20 -5" fill="#CE93D8" />
        {/* Arm holding document */}
        <ellipse cx="25" cy="50" rx="12" ry="30" fill="#FFD6E8" transform="rotate(30 25 50)" />
      </g>
      
      {/* Person 2 - Center */}
      <g transform="translate(300, 200)" className="person-bounce" style={{ animationDelay: '0.2s' }}>
        {/* Body */}
        <ellipse cx="0" cy="40" rx="38" ry="48" fill="#E0F2F1" />
        {/* Head */}
        <circle cx="0" cy="0" r="28" fill="#B2DFDB" />
        {/* Hair */}
        <ellipse cx="0" cy="-10" rx="30" ry="20" fill="#C5E1A5" />
        {/* Arms */}
        <ellipse cx="-30" cy="45" rx="10" ry="28" fill="#E0F2F1" transform="rotate(-20 -30 45)" />
        <ellipse cx="30" cy="45" rx="10" ry="28" fill="#E0F2F1" transform="rotate(20 30 45)" />
      </g>
      
      {/* Person 3 - Right */}
      <g transform="translate(450, 190)" className="person-bounce" style={{ animationDelay: '0.4s' }}>
        {/* Body */}
        <ellipse cx="0" cy="40" rx="36" ry="46" fill="#F3E5F5" />
        {/* Head */}
        <circle cx="0" cy="0" r="26" fill="#E6E6FA" />
        {/* Hair */}
        <path d="M -22 0 Q -28 -10, -20 -18 Q 0 -22, 20 -18 Q 28 -10, 22 0" fill="#A8D8EA" />
        {/* Arm */}
        <ellipse cx="-28" cy="48" rx="11" ry="32" fill="#FCE4EC" transform="rotate(-25 -28 48)" />
      </g>
      
      {/* Shared Document/Board in Center */}
      <g transform="translate(250, 120)">
        <rect
          x="0"
          y="0"
          width="100"
          height="80"
          rx="12"
          fill="white"
          stroke="#A8D8EA"
          strokeWidth="3"
          className="board-float"
        />
        {/* Chart on board */}
        <g opacity="0.6">
          <rect x="15" y="15" width="15" height="40" rx="4" fill="#FFE5D9" />
          <rect x="35" y="25" width="15" height="30" rx="4" fill="#E0F2F1" />
          <rect x="55" y="10" width="15" height="45" rx="4" fill="#F3E5F5" />
        </g>
        {/* Trend line */}
        <path
          d="M 15 50 L 40 35 L 65 20"
          stroke="#FFAB91"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      
      {/* Connection Lines */}
      <g opacity="0.3" className="connection-pulse">
        <path
          d="M 175 200 Q 240 160, 280 180"
          stroke="#A8D8EA"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
        />
        <path
          d="M 320 200 Q 380 170, 425 190"
          stroke="#E6E6FA"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
        />
      </g>
      
      {/* Floating Ideas/Bubbles */}
      <g className="idea-float" style={{ animationDelay: '0s' }}>
        <circle cx="100" cy="100" r="20" fill="#FFF8E1" opacity="0.8" />
        <text x="100" y="108" textAnchor="middle" fontSize="20">💡</text>
      </g>
      
      <g className="idea-float" style={{ animationDelay: '0.5s' }}>
        <circle cx="500" cy="120" r="18" fill="#FCE4EC" opacity="0.8" />
        <text x="500" y="127" textAnchor="middle" fontSize="18">✨</text>
      </g>
      
      <g className="idea-float" style={{ animationDelay: '1s' }}>
        <circle cx="520" cy="280" r="22" fill="#E0F2F1" opacity="0.8" />
        <text x="520" y="289" textAnchor="middle" fontSize="20">🎯</text>
      </g>
    </svg>
  );
}

