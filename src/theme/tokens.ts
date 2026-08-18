/**
 * Design tokens — the single source of truth for the OrgDrobe visual language.
 * Everything downstream (MUI theme, gradients, motion) derives from these values,
 * so re-skinning the whole product is a matter of editing this one file.
 */

export const brand = {
  iris: {
    50: '#F1EEFF',
    100: '#E2DBFF',
    200: '#C6BAFF',
    300: '#A491FF',
    400: '#8E7BFF',
    500: '#6650E6',
    600: '#5540CC',
    700: '#4634A6',
    800: '#372A82',
    900: '#241B57',
  },
  coral: {
    50: '#FFF0ED',
    100: '#FFDCD4',
    200: '#FFBEB0',
    300: '#FF9C88',
    400: '#FF8069',
    500: '#FF6B57',
    600: '#E24B38',
    700: '#B93727',
    800: '#8F2A1E',
    900: '#5E1B14',
  },
  sage: '#2FA37A',
  amber: '#F0A83C',
  sky: '#3B93E8',
  danger: '#E5484D',
} as const

/** Warm neutral ramp — a hint of clay keeps the UI feeling editorial, not sterile. */
export const neutral = {
  0: '#FFFFFF',
  50: '#FAF8F4',
  100: '#F3F0E9',
  200: '#E7E2D8',
  300: '#D5CEC1',
  400: '#B4AB9C',
  500: '#8B8375',
  600: '#6C665C',
  700: '#4E4941',
  800: '#33302A',
  900: '#1B1712',
  950: '#12100C',
} as const

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const

export const gradients = {
  brand: `linear-gradient(135deg, ${brand.iris[500]} 0%, ${brand.coral[500]} 100%)`,
  brandVivid: `linear-gradient(135deg, ${brand.iris[400]} 0%, ${brand.iris[600]} 45%, ${brand.coral[500]} 100%)`,
  irisGlow: `radial-gradient(120% 120% at 0% 0%, ${brand.iris[400]} 0%, ${brand.iris[600]} 60%, ${brand.iris[800]} 100%)`,
  duskLight: `linear-gradient(180deg, #FBF9F5 0%, #F3EFE7 100%)`,
  duskDark: `linear-gradient(180deg, #1B1826 0%, #131019 100%)`,
} as const

/** Layered, soft shadows — no harsh drop shadows anywhere in the product. */
export const softShadows = {
  xs: '0 1px 2px rgba(27, 23, 18, 0.06), 0 1px 1px rgba(27, 23, 18, 0.04)',
  sm: '0 2px 6px rgba(27, 23, 18, 0.06), 0 4px 12px rgba(27, 23, 18, 0.05)',
  md: '0 6px 18px rgba(27, 23, 18, 0.08), 0 12px 34px rgba(27, 23, 18, 0.06)',
  lg: '0 12px 30px rgba(27, 23, 18, 0.10), 0 28px 70px rgba(27, 23, 18, 0.10)',
  glow: `0 10px 40px ${brand.iris[500]}40`,
} as const

export const durations = {
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
} as const

/** Springy but grown-up easing. Used across MUI transitions and framer-motion. */
export const easing = {
  standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
  entrance: [0.16, 1, 0.3, 1] as [number, number, number, number],
}
