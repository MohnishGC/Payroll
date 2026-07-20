import React from 'react';

export interface AuthIllustrationProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const AuthIllustration: React.FC<AuthIllustrationProps> = ({
  className = '',
  width = '100%',
  height = 'auto',
}) => {
  return (
    <div className={`auth-illustration ${className}`}>
      <svg
        viewBox="0 0 440 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width, height, maxWidth: '380px' }}
      >
        <defs>
          {/* Subtle Outer Glow */}
          <filter id="clockShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#2A2B70" floodOpacity="0.25" />
          </filter>

          {/* Leaf Gradients */}
          <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="leafGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.5" />
          </linearGradient>

          {/* Character Outfit Gradients */}
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#3730A3" />
          </linearGradient>
          <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>

        {/* Decorative Background Botanical Sprigs (Left & Right) */}
        <g className="auth-illustration__leaves">
          {/* Left Botanical Sprig */}
          <path
            d="M 100 240 Q 60 180 50 110"
            stroke="url(#leafGradLeft)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 50 110 Q 35 125 42 140 Q 60 135 50 110 Z" fill="url(#leafGradLeft)" />
          <path d="M 62 145 Q 40 160 52 178 Q 72 170 62 145 Z" fill="url(#leafGradLeft)" />
          <path d="M 75 180 Q 55 195 68 212 Q 88 200 75 180 Z" fill="url(#leafGradLeft)" />
          <circle cx="45" cy="105" r="4" fill="#C7D2FE" />
          <circle cx="38" cy="142" r="3" fill="#E0E7FF" />

          {/* Right Botanical Sprig */}
          <path
            d="M 340 240 Q 380 180 390 110"
            stroke="url(#leafGradRight)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 390 110 Q 405 125 398 140 Q 380 135 390 110 Z" fill="url(#leafGradRight)" />
          <path d="M 378 145 Q 400 160 388 178 Q 368 170 378 145 Z" fill="url(#leafGradRight)" />
          <path d="M 365 180 Q 385 195 372 212 Q 352 200 365 180 Z" fill="url(#leafGradRight)" />
          <circle cx="395" cy="105" r="4" fill="#E0E7FF" />
          <circle cx="402" cy="142" r="3" fill="#C7D2FE" />
        </g>

        {/* Large White Circular Clock Face */}
        <g filter="url(#clockShadow)">
          {/* Main Outer Rim */}
          <circle cx="220" cy="200" r="125" fill="#FFFFFF" />
          {/* Subtle Inner Ring */}
          <circle cx="220" cy="200" r="116" stroke="#F1F5F9" strokeWidth="2" fill="none" />
        </g>

        {/* Clock Ticks (12, 3, 6, 9 and sub-ticks) */}
        <g fill="#94A3B8">
          {/* 12 o'clock */}
          <rect x="218" y="92" width="4" height="12" rx="2" />
          {/* 3 o'clock */}
          <rect x="326" y="198" width="12" height="4" rx="2" />
          {/* 6 o'clock */}
          <rect x="218" y="296" width="4" height="12" rx="2" />
          {/* 9 o'clock */}
          <rect x="102" y="198" width="12" height="4" rx="2" />

          {/* Sub-ticks */}
          <circle cx="275" cy="110" r="2.5" />
          <circle cx="310" cy="145" r="2.5" />
          <circle cx="310" cy="255" r="2.5" />
          <circle cx="275" cy="290" r="2.5" />
          <circle cx="165" cy="290" r="2.5" />
          <circle cx="130" cy="255" r="2.5" />
          <circle cx="130" cy="145" r="2.5" />
          <circle cx="165" cy="110" r="2.5" />
        </g>

        {/* Clock Center Pin & Hands */}
        <g>
          {/* Hour Hand (Pointing around 10:10 angle) */}
          <path
            d="M 220 200 L 165 145"
            stroke="#475569"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Minute Hand (Pointing horizontally right ~ 3 o'clock where character sits) */}
          <path
            d="M 220 200 L 305 198"
            stroke="#334155"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Center Cap */}
          <circle cx="220" cy="200" r="8" fill="#1E293B" />
          <circle cx="220" cy="200" r="3" fill="#FFFFFF" />
        </g>

        {/* Flat Illustration Character Sitting on Minute Hand */}
        <g className="auth-illustration__character">
          {/* Legs dangling over minute hand */}
          {/* Left Leg */}
          <path
            d="M 268 185 Q 272 215 268 235 L 260 235 Q 262 210 260 185 Z"
            fill="url(#pantsGrad)"
          />
          {/* Shoe Left */}
          <ellipse cx="264" cy="237" rx="7" ry="4" fill="#1E1B4B" />

          {/* Right Leg (Crossed slightly) */}
          <path
            d="M 278 185 Q 285 210 290 230 L 282 232 Q 275 210 270 185 Z"
            fill="url(#pantsGrad)"
          />
          {/* Shoe Right */}
          <ellipse cx="288" cy="232" rx="7" ry="4" fill="#1E1B4B" />

          {/* Torso & Shirt */}
          <path
            d="M 252 145 C 252 140 285 140 285 145 L 282 188 C 282 188 255 188 255 188 Z"
            fill="url(#shirtGrad)"
          />

          {/* Arms resting on legs/hand */}
          <path
            d="M 255 150 Q 242 165 255 180"
            stroke="#818CF8"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 280 150 Q 292 165 285 178"
            stroke="#818CF8"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Character Head & Hair */}
          {/* Neck */}
          <rect x="264" y="136" width="8" height="10" fill="#FCA5A5" rx="2" />
          {/* Head */}
          <circle cx="268" cy="125" r="15" fill="#FCA5A5" />
          {/* Hair */}
          <path
            d="M 253 125 C 253 108 283 108 283 125 C 283 115 275 110 268 110 C 260 110 253 116 253 125 Z"
            fill="#312E81"
          />

          {/* Small Laptop on Lap */}
          <rect x="256" y="170" width="22" height="3" fill="#E2E8F0" rx="1.5" />
          <path d="M 260 162 L 274 162 L 276 170 L 258 170 Z" fill="#CBD5E1" />
        </g>
      </svg>
    </div>
  );
};
