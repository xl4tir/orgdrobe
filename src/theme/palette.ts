import type { PaletteMode, PaletteOptions } from '@mui/material'

/**
 * Stock Material Design palette — the classic blue primary + pink secondary.
 * Everything else (backgrounds, text, greys, error/warning/info/success) is left
 * to MUI's defaults so the app reads as baseline Material, light and dark.
 */
export const getPalette = (mode: PaletteMode): PaletteOptions =>
  mode === 'light'
    ? {
        mode,
        primary: { main: '#1976d2' },
        secondary: { main: '#e91e63' },
      }
    : {
        mode,
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
      }
