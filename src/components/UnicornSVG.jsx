export default function UnicornSVG({ size = 80 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Rainbow Unicorn"
    >
      {/* Rainbow arching behind the unicorn */}
      {[
        ['#FF6B6B', 48],
        ['#FF9F43', 43],
        ['#FFEAA7', 38],
        ['#55EFC4', 33],
        ['#74B9FF', 28],
        ['#A29BFE', 23],
        ['#FD79A8', 18],
      ].map(([color, r], i) => (
        <path
          key={i}
          d={`M ${50 - r} 58 A ${r} ${r} 0 0 1 ${50 + r} 58`}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}

      {/* Body — white rounded shape */}
      <ellipse cx="50" cy="72" rx="22" ry="16" fill="#fff" stroke="#f0d0e8" strokeWidth="1.5" />

      {/* Legs */}
      <rect x="34" y="83" width="5" height="12" rx="2.5" fill="#fff" stroke="#f0d0e8" strokeWidth="1.2" />
      <rect x="42" y="83" width="5" height="12" rx="2.5" fill="#fff" stroke="#f0d0e8" strokeWidth="1.2" />
      <rect x="53" y="83" width="5" height="12" rx="2.5" fill="#fff" stroke="#f0d0e8" strokeWidth="1.2" />
      <rect x="61" y="83" width="5" height="12" rx="2.5" fill="#fff" stroke="#f0d0e8" strokeWidth="1.2" />

      {/* Neck */}
      <path d="M 38 60 Q 35 52 42 46" stroke="#fff" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M 38 60 Q 35 52 42 46" stroke="#f0d0e8" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Head */}
      <ellipse cx="46" cy="42" rx="13" ry="12" fill="#fff" stroke="#f0d0e8" strokeWidth="1.5" />

      {/* Horn — golden */}
      <polygon points="46,20 43,38 49,38" fill="url(#hornGrad)" />
      <defs>
        <linearGradient id="hornGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>
      {/* Horn shimmer lines */}
      <line x1="44.5" y1="25" x2="43.5" y2="30" stroke="#fff8" strokeWidth="1" />
      <line x1="46.5" y1="22" x2="45.5" y2="27" stroke="#fff8" strokeWidth="0.7" />

      {/* Ear */}
      <polygon points="55,34 60,26 63,34" fill="#fff" stroke="#f0d0e8" strokeWidth="1.2" />
      <polygon points="56.5,34 60,28.5 62,34" fill="#FFB6C1" />

      {/* Eye */}
      <ellipse cx="52" cy="42" rx="3.5" ry="4" fill="#1a1a2e" />
      <ellipse cx="53.2" cy="40.8" rx="1.2" ry="1.2" fill="#fff" />
      {/* Eyelashes */}
      <line x1="49.5" y1="38.5" x2="48.5" y2="36.5" stroke="#1a1a2e" strokeWidth="0.8" />
      <line x1="51" y1="38" x2="50.5" y2="36" stroke="#1a1a2e" strokeWidth="0.8" />
      <line x1="52.5" y1="38" x2="52.5" y2="35.8" stroke="#1a1a2e" strokeWidth="0.8" />

      {/* Rosy cheek */}
      <ellipse cx="56" cy="46" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.6" />

      {/* Nostril */}
      <ellipse cx="57" cy="50" rx="1.5" ry="1" fill="#f0a0b8" />

      {/* Mane — rainbow stripes flowing from head */}
      {[
        '#FF6B6B', '#FF9F43', '#FFEAA7', '#55EFC4', '#74B9FF', '#A29BFE',
      ].map((color, i) => (
        <path
          key={`mane-${i}`}
          d={`M ${37 + i * 0.4} ${38 + i * 1.5} Q ${28 - i * 1.5} ${52 + i * 2} ${30 + i * 0.5} ${68}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}

      {/* Tail — rainbow */}
      {[
        '#FF6B6B', '#FF9F43', '#FFEAA7', '#55EFC4', '#74B9FF', '#A29BFE',
      ].map((color, i) => (
        <path
          key={`tail-${i}`}
          d={`M ${72 + i * 0.3} ${68} Q ${88 + i} ${80 + i * 2} ${78 - i} ${94}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}

      {/* Sparkles */}
      <text x="15" y="32" fontSize="8">✨</text>
      <text x="78" y="28" fontSize="7">⭐</text>
      <text x="72" y="50" fontSize="6">✨</text>
    </svg>
  )
}
