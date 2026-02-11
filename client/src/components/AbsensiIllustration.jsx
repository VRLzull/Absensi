import React from 'react'
import { Box } from '@mui/material'

const AbsensiIllustration = ({ height = 380 }) => {
  return (
    <Box
      component="svg"
      width="100%"
      height={height}
      viewBox="0 0 620 380"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="gradBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eaf6f4" />
          <stop offset="100%" stopColor="#f6fbf9" />
        </linearGradient>
        <linearGradient id="deviceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#078085" />
          <stop offset="100%" stopColor="#066d71" />
        </linearGradient>
      </defs>
      <ellipse cx="310" cy="190" rx="280" ry="160" fill="url(#gradBg)" />

      <rect x="455" y="90" width="40" height="40" rx="20" fill="#cfe9e4" stroke="#078085" strokeWidth="2" />
      <path d="M475 100 L475 95 M475 120 L490 120" stroke="#0f766e" strokeWidth="3" />

      <rect x="445" y="180" width="120" height="120" rx="12" fill="#e6faf5" stroke="#078085" strokeWidth="2" />
      <rect x="458" y="195" width="94" height="14" rx="7" fill="#9fe0d7" />
      <rect x="458" y="215" width="94" height="14" rx="7" fill="#9fe0d7" opacity="0.6" />
      <rect x="458" y="235" width="94" height="14" rx="7" fill="#9fe0d7" opacity="0.4" />
      <rect x="476" y="255" width="40" height="34" rx="8" fill="#d8f3ec" />
      <circle cx="496" cy="272" r="8" fill="#39b6a1" />

      <g transform="translate(360,170)">
        <circle cx="0" cy="0" r="14" fill="#078085" />
        <rect x="-12" y="14" width="24" height="36" rx="8" fill="#38b2a6" />
        <rect x="-18" y="48" width="14" height="28" rx="7" fill="#38b2a6" />
        <rect x="4" y="48" width="14" height="28" rx="7" fill="#38b2a6" />
        <rect x="-24" y="24" width="20" height="12" rx="6" fill="#078085" transform="rotate(-12)" />
        <rect x="-42" y="20" width="20" height="14" rx="4" fill="#e6faf5" stroke="#078085" />
        <circle cx="-32" cy="27" r="3" fill="#078085" />
      </g>

      <rect x="120" y="300" width="380" height="16" rx="8" fill="#d8f3ec" />
    </Box>
  )
}

export default AbsensiIllustration
