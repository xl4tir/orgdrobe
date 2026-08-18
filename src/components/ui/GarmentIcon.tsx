import { useId } from 'react'
import type { GarmentCategory } from '@/types/domain'
import { darken, lighten } from '@/lib/colorUtils'

/** Simple, recognizable garment silhouettes, one per category (viewBox 0 0 100 100). */
const PATHS: Record<GarmentCategory, string> = {
  tops:
    'M36 20 L46 15 C48.5 19 51.5 19 54 15 L64 20 L83 31 L75 46 L67 41 L67 85 C67 86.7 65.7 88 64 88 L36 88 C34.3 88 33 86.7 33 85 L33 41 L25 46 L17 31 Z',
  bottoms:
    'M33 15 L67 15 L67 30 L62 88 C62 89.1 61.1 90 60 90 L54 90 C52.9 90 52 89.1 52 88 L50 48 L48 88 C48 89.1 47.1 90 46 90 L40 90 C38.9 90 38 89.1 38 88 L33 30 Z',
  outerwear:
    'M35 19 L45 15 L50 24 L55 15 L65 19 L82 32 L74 47 L68 42 L68 88 C68 88.6 67.6 89 67 89 L33 89 C32.4 89 32 88.6 32 88 L32 42 L26 47 L18 32 Z',
  dresses:
    'M39 18 L46 14 C48.5 17.5 51.5 17.5 54 14 L61 18 L57 38 L71 86 C71.4 87.4 70.4 88.8 69 88.8 L31 88.8 C29.6 88.8 28.6 87.4 29 86 L43 38 Z',
  footwear:
    'M15 64 C17 54 21 49 30 49 C34.5 49 37.5 51.5 40 56 L59 60 C71 60 83 64 87 72 C87.8 73.6 87 75.5 85.2 75.5 L17 75.5 C15.9 75.5 15 74.6 15 73.5 Z',
  accessories:
    'M30 42 L70 42 L74.5 85.5 C74.6 87 73.4 88.2 71.9 88.2 L28.1 88.2 C26.6 88.2 25.4 87 25.5 85.5 Z',
}

/** Extra stroked accents (handles / plackets) drawn on top of the fill. */
function Accent({ category, stroke }: { category: GarmentCategory; stroke: string }) {
  if (category === 'accessories')
    return (
      <path
        d="M38 44 C38 31 42 26 50 26 C58 26 62 31 62 44"
        fill="none"
        stroke={stroke}
        strokeWidth={3.4}
        strokeLinecap="round"
      />
    )
  if (category === 'outerwear')
    return <path d="M50 24 L50 88" fill="none" stroke={stroke} strokeWidth={1.6} strokeOpacity={0.5} />
  if (category === 'footwear')
    return (
      <path
        d="M40 56 L45 62 M49 57 L53 63 M58 60 L61 66"
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeOpacity={0.5}
      />
    )
  return null
}

interface GarmentIconProps {
  category: GarmentCategory
  primary: string
  secondary?: string
  size?: number | string
}

/** A garment shape filled with the item's own colours — the heart of the new look. */
export function GarmentIcon({ category, primary, secondary, size = '58%' }: GarmentIconProps) {
  const gid = useId().replace(/:/g, '')
  const top = lighten(primary, 0.16)
  const bottom = secondary ? darken(secondary, 0.04) : darken(primary, 0.16)
  const stroke = darken(primary, 0.28)

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ overflow: 'visible', filter: 'drop-shadow(0 8px 14px rgba(20,17,14,0.18))' }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`grad-${gid}`} x1="30" y1="10" x2="70" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={`sheen-${gid}`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.28" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.72" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${gid}`}>
          <path d={PATHS[category]} />
        </clipPath>
      </defs>

      <path d={PATHS[category]} fill={`url(#grad-${gid})`} stroke={stroke} strokeWidth={1.5} strokeOpacity={0.35} />
      <rect x="0" y="0" width="100" height="100" fill={`url(#sheen-${gid})`} clipPath={`url(#clip-${gid})`} />
      <Accent category={category} stroke={stroke} />
    </svg>
  )
}
