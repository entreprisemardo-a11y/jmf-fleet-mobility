import React from 'react';

interface JmfLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  collapsed?: boolean;
}

export const JmfLogo: React.FC<JmfLogoProps> = ({
  className = 'h-10',
  variant = 'dark',
  collapsed = false,
}) => {
  const isDark = variant === 'dark';
  const primaryText = isDark ? '#FFFFFF' : '#0B1828';
  const subText = isDark ? '#94A3B8' : '#2D3B4E';

  if (collapsed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 70 70" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Circular Telematics Radar Icon for Collapsed Mode */}
          <circle
            cx="35"
            cy="35"
            r="30"
            stroke="#0098EA"
            strokeWidth="2.5"
            strokeDasharray="5 4"
            fill={isDark ? '#0F1D33' : '#F0F9FF'}
          />
          {/* Waves */}
          <path d="M 28 17 C 32 14, 38 14, 42 17" stroke="#0098EA" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 24 13 C 31 8, 39 8, 46 13" stroke="#0098EA" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Map Pin */}
          <path
            d="M 35 21 C 42 21, 47 26, 47 33 C 47 41, 35 52, 35 52 C 35 52, 23 41, 23 33 C 23 26, 28 21, 35 21 Z"
            fill="#0050B3"
          />
          {/* 3 Metric Bars */}
          <rect x="29" y="34" width="2.8" height="5" rx="0.7" fill="#FFFFFF" />
          <rect x="33.6" y="31" width="2.8" height="8" rx="0.7" fill="#FFFFFF" />
          <rect x="38.2" y="28" width="2.8" height="11" rx="0.7" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 420 205"
        className="h-full w-auto max-h-20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Royal Blue to Bright Blue Gradient for J & M */}
          <linearGradient id={`jmf-blue-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0050B3" />
            <stop offset="40%" stopColor="#0066CC" />
            <stop offset="100%" stopColor="#0088EA" />
          </linearGradient>

          {/* Sleek Steel Titanium Gradient for F */}
          <linearGradient id={`jmf-steel-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C7A89" />
            <stop offset="100%" stopColor="#556270" />
          </linearGradient>
        </defs>

        {/* Dashed Trajectory Arc connecting M to Radar Pin */}
        <path
          d="M 148 68 C 170 34, 255 32, 316 88"
          stroke="#0098EA"
          strokeWidth="2.6"
          strokeDasharray="5 4"
          fill="none"
        />

        {/* Letter J: Dynamic Slanted Italic with Top Serif and Hook */}
        <path
          d="M 54 42 L 108 42 L 104 55 L 86 55 L 75 94 C 71 106, 62 116, 44 116 C 36 116, 28 114, 25 110 C 27 106, 32 104, 38 104 C 47 104, 55 98, 59 88 L 68 55 L 50 55 Z"
          fill={`url(#jmf-blue-grad-${variant})`}
        />

        {/* Letter M: Dynamic Slanted Italic */}
        <path
          d="M 106 42 L 131 42 L 149 84 L 174 42 L 199 42 L 178 116 L 157 116 L 169 74 L 145 116 L 133 116 L 118 74 L 106 116 L 85 116 Z"
          fill={`url(#jmf-blue-grad-${variant})`}
        />

        {/* Letter F: Steel Gray Italic */}
        <path
          d="M 197 42 L 253 42 L 249 55 L 225 55 L 221 70 L 243 70 L 239 83 L 217 83 L 208 116 L 187 116 Z"
          fill={`url(#jmf-steel-grad-${variant})`}
        />

        {/* 3 Cyan Speed Streaks extending from the top bar of F */}
        <path d="M 258 42 L 286 42 L 282 48 L 256 48 Z" fill="#0098EA" />
        <path d="M 253 53 L 278 53 L 274 59 L 251 59 Z" fill="#0098EA" />
        <path d="M 248 64 L 270 64 L 266 70 L 246 70 Z" fill="#0098EA" />

        {/* Telematics Radar Target & Map Pin with Growth Metrics */}
        {/* Dashed Radar Circle */}
        <circle
          cx="342"
          cy="95"
          r="24"
          stroke="#0098EA"
          strokeWidth="2.2"
          strokeDasharray="4.5 3.5"
          fill="none"
        />

        {/* Telematics Waves above Pin */}
        <path d="M 334 68 C 339 64, 345 64, 350 68" stroke="#0098EA" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 328 62 C 337 56, 347 56, 356 62" stroke="#0098EA" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Map Location Pin */}
        <path
          d="M 342 74 C 352 74, 359 81, 359 90 C 359 101, 342 116, 342 116 C 342 116, 325 101, 325 90 C 325 81, 332 74, 342 74 Z"
          fill="#0050B3"
        />

        {/* Inside Map Pin: 3 Rising Metric Chart Bars */}
        <rect x="333" y="93" width="3.2" height="7" rx="0.8" fill="#FFFFFF" />
        <rect x="339" y="89" width="3.2" height="11" rx="0.8" fill="#FFFFFF" />
        <rect x="345" y="85" width="3.2" height="15" rx="0.8" fill="#FFFFFF" />

        {/* Baseline Under Vehicles */}
        <line x1="48" y1="126" x2="286" y2="126" stroke="#0098EA" strokeWidth="1.4" opacity="0.85" />

        {/* 4 Fleet Vehicles Silhouettes */}
        {/* Vehicle 1: Sedan (Cyan) */}
        <g transform="translate(68, 108)">
          <path d="M 4 14 Q 7 7 15 6 L 24 6 Q 30 9 35 14 L 38 18 L 0 18 Z" fill="#0098EA" />
          <circle cx="8" cy="18" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke="#0098EA" strokeWidth="1.2" />
          <circle cx="28" cy="18" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke="#0098EA" strokeWidth="1.2" />
        </g>

        {/* Vehicle 2: SUV (Royal Blue) */}
        <g transform="translate(116, 105)">
          <path d="M 3 17 L 7 6 L 27 6 L 33 12 L 36 17 L 37 21 L 0 21 Z" fill="#0050B3" />
          <circle cx="8" cy="21" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke="#0050B3" strokeWidth="1.2" />
          <circle cx="28" cy="21" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke="#0050B3" strokeWidth="1.2" />
        </g>

        {/* Vehicle 3: Delivery Cargo Van (Slate Charcoal) */}
        <g transform="translate(164, 102)">
          <path d="M 2 24 L 2 4 Q 2 2 4 2 L 23 2 Q 26 2 27 5 L 34 14 L 35 24 Z" fill={isDark ? '#94A3B8' : '#3A4654'} />
          <circle cx="8" cy="24" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke={isDark ? '#94A3B8' : '#3A4654'} strokeWidth="1.2" />
          <circle cx="27" cy="24" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke={isDark ? '#94A3B8' : '#3A4654'} strokeWidth="1.2" />
        </g>

        {/* Vehicle 4: Utility Minibus / Light Commercial (Cyan) */}
        <g transform="translate(210, 105)">
          <path d="M 2 21 L 2 5 Q 2 3 4 3 L 28 3 Q 30 3 31 6 L 33 14 L 34 21 Z" fill="#0098EA" />
          <circle cx="7" cy="21" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke="#0098EA" strokeWidth="1.2" />
          <circle cx="26" cy="21" r="3.2" fill={isDark ? '#0B1528' : '#FFFFFF'} stroke="#0098EA" strokeWidth="1.2" />
        </g>

        {/* Text: JMF MOBILITY */}
        <text
          x="184"
          y="155"
          textAnchor="middle"
          fill={primaryText}
          fontFamily="'Montserrat', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="23"
          letterSpacing="5"
        >
          JMF MOBILITY
        </text>

        {/* Text: — SERVICES — */}
        <text
          x="184"
          y="176"
          textAnchor="middle"
          fill={subText}
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="12.5"
          letterSpacing="6"
        >
          — SERVICES —
        </text>

        {/* Bottom Accent Underline Curve under SERVICES */}
        <path
          d="M 120 188 Q 184 195 248 188"
          stroke="#0098EA"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
