import { memo } from 'react'

/**
 * Static illustration of the NorthVault assistant bot (same character as the WebGL scene).
 * Server-rendered, and the visual used on mobile, with reduced motion, without WebGL and when
 * the 3D flag is off. Fixed coordinates only, so server and client output are identical.
 *
 * variant: 'hero' ("NV" on the screen) | 'services' ("</>" on the screen) | 'door' (waving)
 * (The prop and class names keep their old "vault" / "door" spelling so existing layout CSS still applies.)
 */
function VaultPoster({ variant = 'hero', className = '', label }) {
  const waving = variant === 'door'
  const word = label ?? (variant === 'services' ? '</>' : 'NV')
  return (
    <svg
      className={`at-poster at-poster--${variant} ${className}`}
      viewBox="0 0 260 240"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="nvShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nvThrust" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="#FF6A13" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF6A13" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor shadow + thruster glow */}
      <ellipse cx="130" cy="226" rx="70" ry="9" fill="url(#nvShadow)" />
      <path d="M108 196 L152 196 L140 224 L120 224 Z" fill="url(#nvThrust)" />
      <ellipse cx="130" cy="196" rx="24" ry="5" fill="#2A2C35" />

      {/* arms */}
      <g fill="#E2DDD1" stroke="#000" strokeOpacity="0.12">
        <rect x="60" y="150" width="16" height="42" rx="8" />
        {waving ? (
          <rect x="184" y="108" width="16" height="42" rx="8" transform="rotate(-28 192 150)" />
        ) : (
          <rect x="184" y="150" width="16" height="42" rx="8" />
        )}
      </g>
      <circle cx="68" cy="193" r="7" fill="#17181F" />
      {waving ? <circle cx="168" cy="106" r="7" fill="#17181F" /> : <circle cx="192" cy="193" r="7" fill="#17181F" />}

      {/* torso */}
      <rect x="82" y="146" width="96" height="50" rx="16" fill="#DAD5C8" stroke="#000" strokeOpacity="0.12" />
      <rect x="112" y="160" width="36" height="7" rx="3" fill="#FF6A13" />
      <rect x="120" y="176" width="20" height="4" rx="2" fill="#17181F" />
      <rect x="120" y="138" width="20" height="12" rx="3" fill="#2A2C35" />

      {/* head: ear pods, shell, bezel, screen */}
      <rect x="40" y="70" width="14" height="38" rx="6" fill="#2A2C35" />
      <rect x="206" y="70" width="14" height="38" rx="6" fill="#2A2C35" />
      <rect x="43" y="82" width="8" height="14" rx="3" fill="#FF6A13" />
      <rect x="209" y="82" width="8" height="14" rx="3" fill="#FF6A13" />
      <rect x="50" y="36" width="160" height="108" rx="26" fill="#ECE8DF" stroke="#000" strokeOpacity="0.12" />
      <rect x="64" y="48" width="132" height="84" rx="14" fill="#17181F" />
      <rect x="69" y="53" width="122" height="74" rx="10" fill="#0D0E13" />

      {/* face on the screen */}
      <rect x="86" y="62" width="26" height="28" rx="8" fill="#FF6A13" />
      <rect x="148" y="62" width="26" height="28" rx="8" fill="#FF6A13" />
      <text
        x="92"
        y="116"
        fill="#FF6A13"
        fontFamily="'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif"
        fontSize="17"
        fontWeight="600"
      >
        {word}
      </text>
      <rect x="130" y="104" width="6" height="14" fill="#FF6A13" className="at-poster__cursor" />

      {/* antenna */}
      <rect x="128" y="18" width="4" height="20" rx="2" fill="#2A2C35" />
      <circle cx="130" cy="14" r="6" fill="#FF6A13" />
    </svg>
  )
}

export default memo(VaultPoster)
