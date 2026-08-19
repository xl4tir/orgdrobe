import type { TypographyOptions } from '@mui/material/styles/createTypography'

const roboto = '"Roboto", "Helvetica", "Arial", sans-serif'

/** Material Design type scale, Roboto throughout. */
export const typography: TypographyOptions = {
  fontFamily: roboto,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: { fontWeight: 300, fontSize: '3.5rem', lineHeight: 1.15, letterSpacing: '-0.015em' },
  h2: { fontWeight: 300, fontSize: '2.75rem', lineHeight: 1.2, letterSpacing: '-0.008em' },
  h3: { fontWeight: 400, fontSize: '2.125rem', lineHeight: 1.22 },
  h4: { fontWeight: 400, fontSize: '1.75rem', lineHeight: 1.25 },
  h5: { fontWeight: 500, fontSize: '1.375rem', lineHeight: 1.3 },
  h6: { fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.35 },
  subtitle1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.009em' },
  subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5, letterSpacing: '0.007em' },
  body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.03em' },
  body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.43, letterSpacing: '0.017em' },
  button: { fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.06em' },
  caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.4, letterSpacing: '0.03em' },
  overline: {
    fontWeight: 500,
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    lineHeight: 2,
  },
}
