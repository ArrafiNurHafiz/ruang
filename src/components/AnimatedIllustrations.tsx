import React from "react";

interface IllustrationProps {
  className?: string;
  animate?: boolean;
}

// 1. World-Class Isometric 3D Cyber-Safe Hero Banner
export const HeroSafetyIllustration: React.FC<IllustrationProps> = ({
  className = "w-full h-full",
  animate = true,
}) => {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none overflow-visible`}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="heroSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338CA" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#312E81" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="isoPlatformTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3730A3" />
          <stop offset="50%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        <linearGradient id="isoPlatformLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="isoPlatformRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        <linearGradient id="shieldHoloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#818CF8" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="goldHoloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="cyberNeonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Glow Filters */}
        <filter
          id="neonShieldGlow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id="ambientSoftGlow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Atmospheric Aurora Glows */}
      <circle
        cx="160"
        cy="120"
        r="90"
        fill="#6366F1"
        opacity="0.25"
        filter="url(#ambientSoftGlow)"
        className={animate ? "animate-pulse" : ""}
      />
      <circle
        cx="440"
        cy="180"
        r="100"
        fill="#10B981"
        opacity="0.2"
        filter="url(#ambientSoftGlow)"
        className={animate ? "animate-pulse" : ""}
      />
      <circle
        cx="300"
        cy="140"
        r="120"
        fill="#38BDF8"
        opacity="0.15"
        filter="url(#ambientSoftGlow)"
      />

      {/* Futuristic Isometric Digital Hex Podium */}
      <g transform="translate(300, 290)">
        {/* Bottom Shadow */}
        <path
          d="M0 -30 L160 50 L0 130 L-160 50 Z"
          fill="#020617"
          opacity="0.6"
        />

        {/* Side Panels */}
        <path
          d="M-150 40 L0 115 V145 L-150 70 Z"
          fill="url(#isoPlatformLeft)"
          stroke="#312E81"
          strokeWidth="1"
        />
        <path
          d="M0 115 L150 40 V70 L0 145 Z"
          fill="url(#isoPlatformRight)"
          stroke="#4338CA"
          strokeWidth="1"
        />

        {/* Top Hex Platform Surface */}
        <path
          d="M0 -35 L150 40 L0 115 L-150 40 Z"
          fill="url(#isoPlatformTop)"
          stroke="#6366F1"
          strokeWidth="1.5"
        />

        {/* Cyber Neon Grid Lines on Platform */}
        <path
          d="M0 -15 L110 40 L0 95 L-110 40 Z"
          stroke="#818CF8"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.7"
        />
        <path
          d="M0 5 L70 40 L0 75 L-70 40 Z"
          stroke="#34D399"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Central Core Glowing Emitter */}
        <ellipse
          cx="0"
          cy="40"
          rx="30"
          ry="15"
          fill="#38BDF8"
          opacity="0.5"
          filter="url(#neonShieldGlow)"
        />
        <ellipse cx="0" cy="40" rx="14" ry="7" fill="#FFFFFF" />
      </g>

      {/* Floating Holographic Cryptographic Orbits */}
      <g
        className={animate ? "animate-spin" : ""}
        style={{ transformOrigin: "300px 170px", animationDuration: "24s" }}
      >
        <ellipse
          cx="300"
          cy="170"
          rx="180"
          ry="60"
          stroke="url(#cyberNeonGlow)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          fill="none"
          opacity="0.6"
        />
        <circle
          cx="480"
          cy="170"
          r="6"
          fill="#38BDF8"
          filter="url(#neonShieldGlow)"
        />
        <circle
          cx="120"
          cy="170"
          r="5"
          fill="#34D399"
          filter="url(#neonShieldGlow)"
        />
      </g>

      <g
        className={animate ? "animate-spin" : ""}
        style={{
          transformOrigin: "300px 170px",
          animationDuration: "18s",
          animationDirection: "reverse",
        }}
      >
        <ellipse
          cx="300"
          cy="170"
          rx="140"
          ry="45"
          stroke="#818CF8"
          strokeWidth="1"
          strokeDasharray="5 8"
          fill="none"
          opacity="0.4"
        />
        <circle
          cx="300"
          cy="125"
          r="4"
          fill="#FBBF24"
          filter="url(#neonShieldGlow)"
        />
        <circle
          cx="300"
          cy="215"
          r="4"
          fill="#A855F7"
          filter="url(#neonShieldGlow)"
        />
      </g>

      {/* Floating 3D Prismatic Crystal Shield (The Core Asset) */}
      <g
        className={animate ? "animate-bounce" : ""}
        style={{ animationDuration: "4s" }}
      >
        {/* Glow Behind Shield */}
        <path
          d="M300 45 L385 85 V185 C385 245 300 285 300 285 C300 285 215 245 215 185 V85 Z"
          fill="url(#shieldHoloGrad)"
          opacity="0.3"
          filter="url(#neonShieldGlow)"
        />

        {/* 3D Faceted Hologram Shield */}
        {/* Left Main Facet */}
        <path
          d="M300 55 L225 92 V180 C225 235 300 270 300 270 Z"
          fill="url(#isoPlatformLeft)"
          stroke="#6366F1"
          strokeWidth="2"
          opacity="0.9"
        />
        {/* Right Main Facet */}
        <path
          d="M300 55 L375 92 V180 C375 235 300 270 300 270 Z"
          fill="url(#isoPlatformTop)"
          stroke="#38BDF8"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Crystal Highlights / Glass Reflections */}
        <path
          d="M300 65 L245 98 V170 C245 205 300 245 300 245 Z"
          fill="#FFFFFF"
          opacity="0.08"
        />
        <path
          d="M300 65 L355 98 V170 C355 205 300 245 300 245 Z"
          fill="url(#cyberNeonGlow)"
          opacity="0.15"
        />

        {/* Center Neon Seam */}
        <line
          x1="300"
          y1="55"
          x2="300"
          y2="270"
          stroke="#34D399"
          strokeWidth="2.5"
          filter="url(#neonShieldGlow)"
        />

        {/* Floating 3D Cyber Lock Mechanism inside Shield */}
        <g transform="translate(300, 160)">
          {/* Shackle */}
          <path
            d="M-16 -12 V-24 C-16 -33 -9 -40 0 -40 C9 -40 16 -33 16 -24 V-12"
            stroke="url(#goldHoloGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lock Body */}
          <rect
            x="-24"
            y="-12"
            width="48"
            height="38"
            rx="10"
            fill="#0F172A"
            stroke="url(#goldHoloGrad)"
            strokeWidth="2.5"
          />
          {/* Glowing Keyhole */}
          <circle
            cx="0"
            cy="2"
            r="5"
            fill="#FBBF24"
            filter="url(#neonShieldGlow)"
          />
          <path d="M-2.5 5 L-4 16 H4 L2.5 5 Z" fill="#FBBF24" />
        </g>
      </g>

      {/* Left Holographic Node: ZKP 0-Trace Data Stream */}
      <g
        transform="translate(60, 140)"
        className={animate ? "animate-bounce" : ""}
        style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
      >
        {/* Glass Card */}
        <rect
          width="135"
          height="65"
          rx="16"
          fill="#0F172A"
          fillOpacity="0.85"
          stroke="#6366F1"
          strokeWidth="1.5"
        />
        <circle cx="25" cy="24" r="10" fill="#4F46E5" />
        <path
          d="M21 24 L24 27 L30 21"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="42"
          y="27"
          fill="#F8FAFC"
          fontSize="11"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          Zero-Trace ZKP
        </text>
        <rect x="15" y="42" width="70" height="6" rx="3" fill="#312E81" />
        <rect x="15" y="42" width="45" height="6" rx="3" fill="#10B981" />
        <text
          x="92"
          y="48"
          fill="#34D399"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          100% OK
        </text>
      </g>

      {/* Right Holographic Node: Rapid Response BK Satgas */}
      <g
        transform="translate(415, 120)"
        className={animate ? "animate-bounce" : ""}
        style={{ animationDuration: "3.8s", animationDelay: "1s" }}
      >
        <rect
          width="145"
          height="65"
          rx="16"
          fill="#0F172A"
          fillOpacity="0.85"
          stroke="#10B981"
          strokeWidth="1.5"
        />
        <circle cx="25" cy="24" r="10" fill="#059669" />
        {/* Lightning / Shield Icon */}
        <path
          d="M26 18 L22 25 H28 L24 31"
          stroke="#FDE047"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="42"
          y="27"
          fill="#F8FAFC"
          fontSize="11"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          Respon &lt; 24 Jam
        </text>
        <text x="15" y="48" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">
          Konseling BK Sigap
        </text>
        <circle
          cx="128"
          cy="45"
          r="4"
          fill="#34D399"
          className="animate-ping"
        />
      </g>

      {/* Floating Holographic Particles */}
      <circle
        cx="210"
        cy="90"
        r="3"
        fill="#38BDF8"
        className="animate-ping"
        style={{ animationDuration: "3s" }}
      />
      <circle
        cx="390"
        cy="80"
        r="2.5"
        fill="#34D399"
        className="animate-ping"
        style={{ animationDuration: "2.5s" }}
      />
      <circle
        cx="270"
        cy="330"
        r="3"
        fill="#818CF8"
        className="animate-ping"
        style={{ animationDuration: "4s" }}
      />
    </svg>
  );
};

// 2. High-End 3D Isometric Satgas PPKSP Vector Art
export const PPKSPVectorArt: React.FC<IllustrationProps> = ({
  className = "w-full h-full",
}) => {
  return (
    <svg
      viewBox="0 0 440 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        <linearGradient id="ppkspBgMesh" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="50%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="emeraldShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="440" height="260" fill="url(#ppkspBgMesh)" />

      {/* Blueprint Perspective Grid */}
      <path
        d="M40 220 L220 160 L400 220"
        stroke="#312E81"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.6"
      />
      <path
        d="M220 160 V40"
        stroke="#312E81"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.6"
      />
      <circle
        cx="220"
        cy="130"
        r="90"
        stroke="#4338CA"
        strokeWidth="1"
        strokeDasharray="6 8"
        opacity="0.4"
      />

      {/* Floating 3D Emblem of Satgas PPKSP */}
      <g transform="translate(220, 115)">
        {/* Glow */}
        <circle
          cx="0"
          cy="0"
          r="65"
          fill="#4F46E5"
          opacity="0.25"
          filter="blur(15px)"
        />

        {/* Hex Shield Backing */}
        <polygon
          points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30"
          fill="#1E1B4B"
          stroke="#6366F1"
          strokeWidth="3"
        />
        {/* Inner Shield */}
        <polygon
          points="0,-48 42,-24 42,24 0,48 -42,24 -42,-24"
          fill="url(#ppkspBgMesh)"
          stroke="url(#goldPlate)"
          strokeWidth="2"
        />

        {/* 3D Star Crest in Center */}
        <polygon
          points="0,-24 6,-8 22,-8 10,2 14,18 0,8 -14,18 -10,2 -22,-8 -6,-8"
          fill="url(#goldPlate)"
        />
      </g>

      {/* Official Permendikbud Ribbon Banner */}
      <g transform="translate(130, 195)">
        <rect
          width="180"
          height="34"
          rx="17"
          fill="#0F172A"
          stroke="url(#goldPlate)"
          strokeWidth="1.5"
        />
        <rect
          x="6"
          y="6"
          width="22"
          height="22"
          rx="11"
          fill="url(#emeraldShield)"
        />
        <path
          d="M12 17 L15 20 L21 14"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="36"
          y="22"
          fill="#F8FAFC"
          fontSize="11"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          Permendikbud No. 46
        </text>
      </g>

      {/* Floating Badges */}
      <g transform="translate(45, 65)">
        <rect
          width="105"
          height="32"
          rx="12"
          fill="#1E1B4B"
          stroke="#6366F1"
          strokeWidth="1.2"
        />
        <text
          x="52"
          y="20"
          fill="#C7D2FE"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          🛡️ TPPK Sekolah
        </text>
      </g>

      <g transform="translate(290, 75)">
        <rect
          width="115"
          height="32"
          rx="12"
          fill="#064E3B"
          stroke="#34D399"
          strokeWidth="1.2"
        />
        <text
          x="57"
          y="20"
          fill="#A7F3D0"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          ✨ Perlindungan Sah
        </text>
      </g>
    </svg>
  );
};

// 3. Isometric 3D Cyberbullying & Digital Privacy Vector Art
export const CyberSafetyVectorArt: React.FC<IllustrationProps> = ({
  className = "w-full h-full",
}) => {
  return (
    <svg
      viewBox="0 0 440 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        <linearGradient id="cyberBgMesh" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#030712" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      <rect width="440" height="260" fill="url(#cyberBgMesh)" />

      {/* Cyber Grid Lines */}
      <g stroke="#1E293B" strokeWidth="1">
        <path d="M0 70 H440 M0 130 H440 M0 190 H440" />
        <path d="M80 0 V260 M160 0 V260 M280 0 V260 M360 0 V260" />
      </g>

      {/* Floating Isometric 3D Smartphone Device */}
      <g transform="translate(170, 30)">
        {/* Device Drop Shadow */}
        <rect
          x="15"
          y="15"
          width="100"
          height="175"
          rx="20"
          fill="#000000"
          opacity="0.6"
          filter="blur(8px)"
        />

        {/* Phone Body */}
        <rect
          width="100"
          height="175"
          rx="20"
          fill="url(#phoneGrad)"
          stroke="#38BDF8"
          strokeWidth="2.5"
        />
        {/* Screen */}
        <rect x="6" y="8" width="88" height="159" rx="14" fill="#020617" />

        {/* Encrypted Chat Stream Elements */}
        <rect
          x="14"
          y="24"
          width="55"
          height="18"
          rx="6"
          fill="#334155"
          opacity="0.8"
        />
        <rect x="30" y="48" width="55" height="18" rx="6" fill="#0284C7" />
        <rect
          x="14"
          y="72"
          width="50"
          height="18"
          rx="6"
          fill="#334155"
          opacity="0.8"
        />

        {/* Big Holographic Firewall Shield On Phone */}
        <g transform="translate(50, 120)">
          <path
            d="M0 -25 L24 -12 V10 C24 24 0 35 0 35 C0 35 -24 24 -24 10 V-12 Z"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth="2"
          />
          <circle cx="0" cy="4" r="5" fill="#38BDF8" />
          <path
            d="M-4 12 L4 12"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Blocked Toxic Cyber Bubble (Left) */}
      <g transform="translate(30, 85)">
        <rect
          width="110"
          height="55"
          rx="14"
          fill="#450A0A"
          stroke="#EF4444"
          strokeWidth="1.5"
        />
        <circle cx="24" cy="22" r="8" fill="#DC2626" />
        <path
          d="M20 22 L28 22"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="38"
          y="25"
          fill="#FCA5A5"
          fontSize="10"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          Pesan Kasar
        </text>
        <text
          x="14"
          y="44"
          fill="#F87171"
          fontSize="9"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          🚫 Terblokir Otomatis
        </text>
      </g>

      {/* Safe Bubble (Right) */}
      <g transform="translate(295, 95)">
        <rect
          width="115"
          height="55"
          rx="14"
          fill="#064E3B"
          stroke="#10B981"
          strokeWidth="1.5"
        />
        <circle cx="24" cy="22" r="8" fill="#10B981" />
        <path
          d="M20 22 L23 25 L28 19"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="38"
          y="25"
          fill="#A7F3D0"
          fontSize="10"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          Ruang Aman
        </text>
        <text
          x="14"
          y="44"
          fill="#6EE7B7"
          fontSize="9"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          🔒 Metadata Terhapus
        </text>
      </g>
    </svg>
  );
};

// 4. Isometric Upstander & Courageous Solidarity Vector Art
export const UpstanderVectorArt: React.FC<IllustrationProps> = ({
  className = "w-full h-full",
}) => {
  return (
    <svg
      viewBox="0 0 440 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        <linearGradient
          id="upstanderBgMesh"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="beaconBeam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="440" height="260" fill="url(#upstanderBgMesh)" />

      {/* Beacon of Hope Light Beam */}
      <polygon
        points="220,10 290,240 150,240"
        fill="url(#beaconBeam)"
        opacity="0.35"
      />

      {/* 3D Geometric Isometric Solidarity Pillars */}
      <g transform="translate(220, 160)">
        {/* Center Hero Pillar */}
        <path
          d="M0 -30 L40 -10 L0 10 L-40 -10 Z"
          fill="#6366F1"
          stroke="#818CF8"
          strokeWidth="1.5"
        />
        <path d="M-40 -10 L0 10 V60 L-40 40 Z" fill="#312E81" />
        <path d="M0 10 L40 -10 V40 L0 60 Z" fill="#4338CA" />

        {/* Left Friend Pillar */}
        <g transform="translate(-75, 20)">
          <path
            d="M0 -20 L30 -5 L0 10 L-30 -5 Z"
            fill="#38BDF8"
            stroke="#7DD3FC"
            strokeWidth="1.5"
          />
          <path d="M-30 -5 L0 10 V45 L-30 30 Z" fill="#0369A1" />
          <path d="M0 10 L30 -5 V30 L0 45 Z" fill="#0284C7" />
        </g>

        {/* Right Friend Pillar */}
        <g transform="translate(75, 20)">
          <path
            d="M0 -20 L30 -5 L0 10 L-30 -5 Z"
            fill="#34D399"
            stroke="#6EE7B7"
            strokeWidth="1.5"
          />
          <path d="M-30 -5 L0 10 V45 L-30 30 Z" fill="#047857" />
          <path d="M0 10 L30 -5 V30 L0 45 Z" fill="#059669" />
        </g>

        {/* Interconnecting Neon Harmony Rings */}
        <ellipse
          cx="0"
          cy="-10"
          rx="100"
          ry="25"
          stroke="#FDE047"
          strokeWidth="2"
          strokeDasharray="6 6"
          fill="none"
        />
      </g>

      {/* Floating Hero Badge */}
      <g transform="translate(145, 35)">
        <rect
          width="150"
          height="38"
          rx="19"
          fill="#1E1B4B"
          stroke="#FBBF24"
          strokeWidth="2"
        />
        <text
          x="75"
          y="24"
          fill="#FEF08A"
          fontSize="11"
          fontWeight="extrabold"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          🌟 Upstander Solidaritas
        </text>
      </g>
    </svg>
  );
};

// 5. Isometric Serene Mental Health & Safe Counseling Vector Art
export const MentalHealthVectorArt: React.FC<IllustrationProps> = ({
  className = "w-full h-full",
}) => {
  return (
    <svg
      viewBox="0 0 440 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        <linearGradient id="mentalBgMesh" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#042F2E" />
          <stop offset="50%" stopColor="#115E59" />
          <stop offset="100%" stopColor="#042F2E" />
        </linearGradient>
        <linearGradient id="auroraHeart" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      <rect width="440" height="260" fill="url(#mentalBgMesh)" />

      {/* Calming Ripple Circles */}
      <circle
        cx="220"
        cy="130"
        r="95"
        stroke="#2DD4BF"
        strokeWidth="1.5"
        strokeDasharray="8 8"
        opacity="0.3"
      />
      <circle
        cx="220"
        cy="130"
        r="70"
        fill="#14B8A6"
        opacity="0.2"
        filter="blur(15px)"
      />

      {/* Floating 3D Prismatic Heart Capsule */}
      <g transform="translate(220, 110)">
        {/* Soft Aura */}
        <circle
          cx="0"
          cy="0"
          r="50"
          fill="#FB7185"
          opacity="0.3"
          filter="blur(12px)"
        />

        {/* 3D Heart */}
        <path
          d="M0 32 C-26 12 -42 -4 -42 -22 C-42 -38 -28 -48 -14 -48 C-5 -48 0 -42 0 -42 C0 -42 5 -48 14 -48 C28 -48 42 -38 42 -22 C42 -4 26 12 0 32 Z"
          fill="url(#auroraHeart)"
          stroke="#FFE4E6"
          strokeWidth="2.5"
        />

        {/* Stethoscope / Hugging Protective Wings */}
        <path
          d="M-36 -10 C-50 20 -20 50 0 52 C20 50 50 20 36 -10"
          stroke="#99F6E4"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Comfort Dialogue Pill */}
      <g transform="translate(135, 195)">
        <rect
          width="170"
          height="36"
          rx="18"
          fill="#134E4A"
          stroke="#5EEAD4"
          strokeWidth="1.5"
        />
        <text
          x="85"
          y="23"
          fill="#CCFBF1"
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          💚 Ruang Konseling Nyaman
        </text>
      </g>
    </svg>
  );
};

// 6. High-Tech Zero-Knowledge Proof (Semaphore) Cryptography Art
export const ZKPVectorArt: React.FC<IllustrationProps> = ({
  className = "w-full h-full",
}) => {
  return (
    <svg
      viewBox="0 0 440 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        <linearGradient id="zkpVaultBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#09090B" />
          <stop offset="50%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
        <linearGradient id="neonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="440" height="260" fill="url(#zkpVaultBg)" />

      {/* Cryptographic Circuit Lines */}
      <path
        d="M30 60 H140 L180 100 H260 L300 60 H410"
        stroke="#27272A"
        strokeWidth="2"
      />
      <path
        d="M30 200 H140 L180 160 H260 L300 200 H410"
        stroke="#27272A"
        strokeWidth="2"
      />
      <circle cx="180" cy="100" r="4" fill="#34D399" />
      <circle cx="260" cy="100" r="4" fill="#38BDF8" />
      <circle cx="180" cy="160" r="4" fill="#6366F1" />
      <circle cx="260" cy="160" r="4" fill="#34D399" />

      {/* Floating 3D Cryptographic Merkle Cube Vault */}
      <g transform="translate(220, 125)">
        {/* Cube Top Face */}
        <polygon
          points="0,-45 45,-20 0,5 -45,-20"
          fill="#27272A"
          stroke="#34D399"
          strokeWidth="2"
        />
        {/* Cube Left Face */}
        <polygon
          points="-45,-20 0,5 0,55 -45,30"
          fill="#18181B"
          stroke="#34D399"
          strokeWidth="2"
        />
        {/* Cube Right Face */}
        <polygon
          points="0,5 45,-20 45,30 0,55"
          fill="#09090B"
          stroke="#34D399"
          strokeWidth="2"
        />

        {/* Glowing Center Lock */}
        <circle
          cx="0"
          cy="5"
          r="14"
          fill="#047857"
          stroke="#6EE7B7"
          strokeWidth="1.5"
        />
        <path
          d="M-4 3 C-4 -1 0 -4 4 -1 C4 3 0 6 0 9"
          stroke="#ECFDF5"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="0" cy="12" r="1.5" fill="#ECFDF5" />
      </g>

      {/* Badge Bottom */}
      <g transform="translate(125, 205)">
        <rect
          width="190"
          height="34"
          rx="17"
          fill="#064E3B"
          stroke="#34D399"
          strokeWidth="1.5"
        />
        <text
          x="95"
          y="22"
          fill="#D1FAE5"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="monospace"
        >
          SEMAPHORE ZKP (0-LOG)
        </text>
      </g>
    </svg>
  );
};

// 7. Sleek Modern Stylized Counselor Vector Avatar
export const CounselorVectorAvatar: React.FC<{ className?: string }> = ({
  className = "w-14 h-14",
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} rounded-2xl select-none shadow-md overflow-hidden`}
    >
      <defs>
        <linearGradient id="cslBg3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="hijabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#cslBg3D)" />
      {/* Rim Light */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="#818CF8"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Shoulders & Official Blazer */}
      <path d="M18 95 C18 72 32 64 50 64 C68 64 82 72 82 95 Z" fill="#0F172A" />
      <path d="M40 64 L50 78 L60 64" fill="#0D9488" />
      <path d="M46 72 L50 86 L54 72" fill="#FFFFFF" />

      {/* Headcover / Stylized Hair */}
      <circle cx="50" cy="42" r="23" fill="url(#hijabGrad)" />
      <path
        d="M27 44 C27 28 37 20 50 20 C63 20 73 28 73 44 C73 58 65 67 50 67 C35 67 27 58 27 44 Z"
        fill="url(#hijabGrad)"
      />

      {/* Face */}
      <ellipse cx="50" cy="44" rx="15" ry="16" fill="#FED7AA" />

      {/* Stylish Modern Glasses */}
      <circle
        cx="43"
        cy="42"
        r="6"
        stroke="#0F172A"
        strokeWidth="1.8"
        fill="#FFFFFF"
        fillOpacity="0.4"
      />
      <circle
        cx="57"
        cy="42"
        r="6"
        stroke="#0F172A"
        strokeWidth="1.8"
        fill="#FFFFFF"
        fillOpacity="0.4"
      />
      <line
        x1="49"
        y1="42"
        x2="51"
        y2="42"
        stroke="#0F172A"
        strokeWidth="1.8"
      />
      <circle cx="43" cy="42" r="2" fill="#0F172A" />
      <circle cx="57" cy="42" r="2" fill="#0F172A" />

      {/* Friendly Smile */}
      <path
        d="M46 51 Q50 55 54 51"
        stroke="#EA580C"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="39" cy="48" r="2" fill="#FB7185" opacity="0.6" />
      <circle cx="61" cy="48" r="2" fill="#FB7185" opacity="0.6" />

      {/* Verified Seal */}
      <circle
        cx="80"
        cy="80"
        r="10"
        fill="#10B981"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <path
        d="M76 80 L79 83 L85 77"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
