import type { TypographyOptions } from '@mui/material/styles/createTypography'

const sans = '"Manrope Variable", "Manrope", system-ui, -apple-system, Segoe UI, sans-serif'
const display = '"Fraunces Variable", "Fraunces", Georgia, "Times New Roman", serif'

/**
 * Editorial pairing: a high-contrast display serif (Fraunces) for the big
 * moments, a warm geometric sans (Manrope) for everything you actually read.
 */
export const typography: TypographyOptions = {
  fontFamily: sans,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontFamily: display,
    fontWeight: 600,
    fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
    lineHeight: 1.02,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: display,
    fontWeight: 600,
    fontSize: 'clamp(2rem, 3.6vw, 3rem)',
    lineHeight: 1.08,
    letterSpacing: '-0.018em',
  },
  h3: {
    fontFamily: display,
    fontWeight: 600,
    fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)',
    lineHeight: 1.14,
    letterSpacing: '-0.014em',
  },
  h4: {
    fontFamily: sans,
    fontWeight: 700,
    fontSize: '1.4rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontFamily: sans,
    fontWeight: 700,
    fontSize: '1.15rem',
    lineHeight: 1.25,
    letterSpacing: '-0.006em',
  },
  h6: {
    fontFamily: sans,
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: 1.3,
    letterSpacing: '0',
  },
  subtitle1: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
  subtitle2: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.5 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.9rem', lineHeight: 1.55 },
  button: {
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.78rem',
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  overline: {
    fontWeight: 700,
    fontSize: '0.72rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },
}
