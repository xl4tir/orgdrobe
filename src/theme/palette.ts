import type { PaletteMode, PaletteOptions } from '@mui/material'

/**
 * Material Design 3 baseline palette (purple primary). Kept close to the
 * reference tokens so the app reads as stock Material, light and dark.
 */
export const getPalette = (mode: PaletteMode): PaletteOptions =>
  mode === 'light'
    ? {
        mode,
        primary: { main: '#6750A4', light: '#8069C7', dark: '#4F378B', contrastText: '#FFFFFF' },
        secondary: { main: '#625B71', light: '#7E7690', dark: '#4A4458', contrastText: '#FFFFFF' },
        error: { main: '#BA1A1A', contrastText: '#FFFFFF' },
        warning: { main: '#F9A825', contrastText: '#1D1B20' },
        info: { main: '#0061A4', contrastText: '#FFFFFF' },
        success: { main: '#146C2E', contrastText: '#FFFFFF' },
        background: { default: '#F7F2FA', paper: '#FFFFFF' },
        text: {
          primary: '#1D1B20',
          secondary: '#49454F',
          disabled: 'rgba(29,27,32,0.38)',
        },
        divider: 'rgba(29,27,32,0.12)',
      }
    : {
        mode,
        primary: { main: '#D0BCFF', light: '#E8DEF8', dark: '#B69DF8', contrastText: '#381E72' },
        secondary: { main: '#CCC2DC', light: '#E8DEF8', dark: '#B0A7C0', contrastText: '#332D41' },
        error: { main: '#FFB4AB', contrastText: '#690005' },
        warning: { main: '#F9A825', contrastText: '#1D1B20' },
        info: { main: '#9ECAFF', contrastText: '#003258' },
        success: { main: '#7CDB8A', contrastText: '#00390F' },
        background: { default: '#141218', paper: '#211F26' },
        text: {
          primary: '#E6E0E9',
          secondary: '#CAC4D0',
          disabled: 'rgba(230,224,233,0.38)',
        },
        divider: 'rgba(230,224,233,0.14)',
      }
