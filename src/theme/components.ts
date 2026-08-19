import type { Components, Theme } from '@mui/material/styles'

/**
 * Minimal overrides — we lean on MUI's stock Material Design component styles
 * (elevated cards, uppercase contained buttons, standard inputs, ripples).
 */
export const getComponents = (): Components<Omit<Theme, 'components'>> => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*, *::before, *::after': { boxSizing: 'border-box' },
      html: { WebkitFontSmoothing: 'antialiased' },
      body: { overflowX: 'hidden' },
      '*::-webkit-scrollbar': { width: 10, height: 10 },
      '*::-webkit-scrollbar-thumb': {
        background: 'rgba(120,120,120,0.4)',
        borderRadius: 999,
        border: '2px solid transparent',
        backgroundClip: 'content-box',
      },
    },
  },
  MuiAppBar: {
    defaultProps: { color: 'primary' },
  },
  MuiButton: {
    defaultProps: { disableElevation: false },
  },
  MuiCard: {
    defaultProps: { elevation: 1 },
  },
})
