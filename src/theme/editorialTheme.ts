import type { Components, PaletteMode, PaletteOptions, Theme } from '@mui/material'
import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { brand, neutral, radii, softShadows } from './tokens'

/* ---------------------------------------------------------------- palette -- */

export const getEditorialPalette = (mode: PaletteMode): PaletteOptions =>
  mode === 'light'
    ? {
        mode,
        primary: { main: brand.iris[500], light: brand.iris[400], dark: brand.iris[700], contrastText: '#FFFFFF' },
        secondary: { main: brand.coral[500], light: brand.coral[400], dark: brand.coral[700], contrastText: '#FFFFFF' },
        success: { main: brand.sage, contrastText: '#FFFFFF' },
        warning: { main: brand.amber, contrastText: '#3A2A08' },
        info: { main: brand.sky, contrastText: '#FFFFFF' },
        error: { main: brand.danger, contrastText: '#FFFFFF' },
        background: { default: neutral[50], paper: neutral[0] },
        text: { primary: neutral[900], secondary: neutral[600], disabled: neutral[400] },
        divider: 'rgba(27, 23, 18, 0.10)',
        grey: {
          50: neutral[50], 100: neutral[100], 200: neutral[200], 300: neutral[300], 400: neutral[400],
          500: neutral[500], 600: neutral[600], 700: neutral[700], 800: neutral[800], 900: neutral[900],
        },
      }
    : {
        mode,
        primary: { main: brand.iris[400], light: brand.iris[300], dark: brand.iris[600], contrastText: '#12100C' },
        secondary: { main: brand.coral[400], light: brand.coral[300], dark: brand.coral[600], contrastText: '#12100C' },
        success: { main: '#3FB98C', contrastText: '#08130E' },
        warning: { main: brand.amber, contrastText: '#3A2A08' },
        info: { main: '#5AA6F0', contrastText: '#07131F' },
        error: { main: '#F0656A', contrastText: '#1F0708' },
        background: { default: '#141119', paper: '#1E1A28' },
        text: { primary: '#F4F0EA', secondary: '#A9A2B6', disabled: '#6B6479' },
        divider: 'rgba(255, 255, 255, 0.10)',
      }

/* ------------------------------------------------------------ typography -- */

const sans = '"Manrope Variable", "Manrope", system-ui, -apple-system, Segoe UI, sans-serif'
const display = '"Fraunces Variable", "Fraunces", Georgia, "Times New Roman", serif'

export const editorialTypography: TypographyOptions = {
  fontFamily: sans,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: { fontFamily: display, fontWeight: 600, fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', lineHeight: 1.02, letterSpacing: '-0.02em' },
  h2: { fontFamily: display, fontWeight: 600, fontSize: 'clamp(2rem, 3.6vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.018em' },
  h3: { fontFamily: display, fontWeight: 600, fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)', lineHeight: 1.14, letterSpacing: '-0.014em' },
  h4: { fontFamily: sans, fontWeight: 700, fontSize: '1.4rem', lineHeight: 1.2, letterSpacing: '-0.01em' },
  h5: { fontFamily: sans, fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.25, letterSpacing: '-0.006em' },
  h6: { fontFamily: sans, fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 },
  subtitle1: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
  subtitle2: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.5 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.9rem', lineHeight: 1.55 },
  button: { fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.01em', textTransform: 'none' },
  caption: { fontSize: '0.78rem', lineHeight: 1.4, letterSpacing: '0.01em' },
  overline: { fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', lineHeight: 1.4 },
}

/* ------------------------------------------------------------- components -- */

export const getEditorialComponents = (): Components<Omit<Theme, 'components'>> => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*, *::before, *::after': { boxSizing: 'border-box' },
      html: { WebkitFontSmoothing: 'antialiased', scrollBehavior: 'smooth' },
      body: { overflowX: 'hidden' },
      '::selection': { background: 'rgba(102, 80, 230, 0.22)' },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: radii.pill,
        paddingInline: 20,
        paddingBlock: 9,
        transition: 'transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, background-color .18s',
        '&:active': { transform: 'translateY(1px) scale(0.99)' },
      },
      sizeLarge: { paddingInline: 28, paddingBlock: 13, fontSize: '1rem' },
      containedPrimary: {
        boxShadow: '0 8px 22px rgba(102, 80, 230, 0.28)',
        '&:hover': { boxShadow: '0 12px 30px rgba(102, 80, 230, 0.36)', transform: 'translateY(-1px)' },
      },
      containedSecondary: {
        boxShadow: '0 8px 22px rgba(255, 107, 87, 0.28)',
        '&:hover': { boxShadow: '0 12px 30px rgba(255, 107, 87, 0.36)', transform: 'translateY(-1px)' },
      },
      outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
    },
  },
  MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' }, rounded: { borderRadius: radii.lg } } },
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radii.lg,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: softShadows.sm,
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: radii.pill, fontWeight: 600 },
      // The `filled` slot applies to *every* filled chip, so we must handle both
      // cases explicitly. Neutral (color="default") chips get a soft grey wash.
      // Coloured chips (primary/secondary/…) must be given their solid palette
      // background here *positively* — MUI's own filled-colour background does
      // not survive for clickable chips once this slot is overridden, which left
      // selected filter/category chips as white-on-transparent (invisible).
      filled: ({ theme, ownerState }) => {
        if (!ownerState.color || ownerState.color === 'default') {
          return {
            backgroundColor:
              theme.palette.mode === 'light' ? theme.palette.grey[100] : 'rgba(255,255,255,0.06)',
          }
        }
        const pal = theme.palette[ownerState.color as 'primary']
        // getContrastText picks white *or* dark ink per the actual background —
        // e.g. white on iris, but dark on the lighter coral secondary — so the
        // label always meets contrast. Hover darkens via brightness (not a
        // darker bg colour) to keep that text/background relationship intact.
        return {
          backgroundColor: pal.main,
          color: theme.palette.getContrastText(pal.main),
          '&:hover': { backgroundColor: pal.main, filter: 'brightness(0.93)' },
          '&.Mui-focusVisible': { backgroundColor: pal.main, filter: 'brightness(0.9)' },
        }
      },
      outlined: { borderWidth: 1.5 },
    },
  },
  MuiTextField: { defaultProps: { variant: 'outlined' } },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radii.md,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : 'rgba(255,255,255,0.03)',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
        '&.Mui-focused': { backgroundColor: theme.palette.background.paper },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: 1.5 },
      }),
    },
  },
  MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3 }, root: { minHeight: 44 } } },
  MuiTab: { styleOverrides: { root: { minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: '0.92rem' } } },
})
