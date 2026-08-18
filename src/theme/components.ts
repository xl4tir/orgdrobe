import type { Components, Theme } from '@mui/material/styles'
import { radii, softShadows } from './tokens'

/**
 * Global MUI component overrides. This is where the "prototype" turns into a
 * product: pill buttons, soft cards, glassy surfaces and calm focus rings.
 */
export const getComponents = (): Components<Omit<Theme, 'components'>> => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*, *::before, *::after': { boxSizing: 'border-box' },
      html: { WebkitFontSmoothing: 'antialiased', scrollBehavior: 'smooth' },
      body: { overflowX: 'hidden' },
      '::selection': { background: 'rgba(102, 80, 230, 0.22)' },
      '*::-webkit-scrollbar': { width: 10, height: 10 },
      '*::-webkit-scrollbar-thumb': {
        background: 'rgba(140, 131, 117, 0.4)',
        borderRadius: 999,
        border: '2px solid transparent',
        backgroundClip: 'content-box',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(140, 131, 117, 0.65)',
        backgroundClip: 'content-box',
      },
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
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'transform .18s cubic-bezier(.22,1,.36,1), background-color .18s',
        '&:hover': { transform: 'translateY(-1px)' },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: 'none' },
      rounded: { borderRadius: radii.lg },
    },
  },
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
      filled: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'light' ? theme.palette.grey[100] : 'rgba(255,255,255,0.06)',
      }),
      outlined: { borderWidth: 1.5 },
    },
  },
  MuiTextField: { defaultProps: { variant: 'outlined' } },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radii.md,
        backgroundColor:
          theme.palette.mode === 'light' ? theme.palette.grey[50] : 'rgba(255,255,255,0.03)',
        transition: 'box-shadow .2s, background-color .2s',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : 'rgba(255,255,255,0.2)',
        },
        '&.Mui-focused': {
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 0 0 4px ${theme.palette.primary.main}22`,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 1.5,
        },
      }),
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        borderRadius: radii.sm,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],
        color: theme.palette.mode === 'light' ? '#fff' : theme.palette.grey[900],
        fontSize: '0.75rem',
        fontWeight: 600,
        paddingInline: 10,
        paddingBlock: 6,
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: { height: 3, borderRadius: 3 },
      root: { minHeight: 44 },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: { minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: '0.92rem' },
    },
  },
  MuiDivider: {
    styleOverrides: { root: ({ theme }) => ({ borderColor: theme.palette.divider }) },
  },
  MuiListItemButton: {
    styleOverrides: { root: { borderRadius: radii.md } },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: radii.md,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: softShadows.md,
        marginTop: 6,
      }),
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: { padding: 8 },
      track: { borderRadius: 999, opacity: 1, backgroundColor: 'rgba(140,131,117,0.35)' },
      thumb: { boxShadow: softShadows.xs },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 999, height: 8 },
      bar: { borderRadius: 999 },
    },
  },
})
