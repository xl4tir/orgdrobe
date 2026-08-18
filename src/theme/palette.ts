import type { PaletteMode, PaletteOptions } from '@mui/material'
import { brand, neutral } from './tokens'

export const getPalette = (mode: PaletteMode): PaletteOptions =>
  mode === 'light'
    ? {
        mode,
        primary: {
          main: brand.iris[500],
          light: brand.iris[400],
          dark: brand.iris[700],
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: brand.coral[500],
          light: brand.coral[400],
          dark: brand.coral[700],
          contrastText: '#FFFFFF',
        },
        success: { main: brand.sage, contrastText: '#FFFFFF' },
        warning: { main: brand.amber, contrastText: '#3A2A08' },
        info: { main: brand.sky, contrastText: '#FFFFFF' },
        error: { main: brand.danger, contrastText: '#FFFFFF' },
        background: {
          default: neutral[50],
          paper: neutral[0],
        },
        text: {
          primary: neutral[900],
          secondary: neutral[600],
          disabled: neutral[400],
        },
        divider: 'rgba(27, 23, 18, 0.10)',
        grey: {
          50: neutral[50],
          100: neutral[100],
          200: neutral[200],
          300: neutral[300],
          400: neutral[400],
          500: neutral[500],
          600: neutral[600],
          700: neutral[700],
          800: neutral[800],
          900: neutral[900],
        },
      }
    : {
        mode,
        primary: {
          main: brand.iris[400],
          light: brand.iris[300],
          dark: brand.iris[600],
          contrastText: '#12100C',
        },
        secondary: {
          main: brand.coral[400],
          light: brand.coral[300],
          dark: brand.coral[600],
          contrastText: '#12100C',
        },
        success: { main: '#3FB98C', contrastText: '#08130E' },
        warning: { main: brand.amber, contrastText: '#3A2A08' },
        info: { main: '#5AA6F0', contrastText: '#07131F' },
        error: { main: '#F0656A', contrastText: '#1F0708' },
        background: {
          default: '#141119',
          paper: '#1E1A28',
        },
        text: {
          primary: '#F4F0EA',
          secondary: '#A9A2B6',
          disabled: '#6B6479',
        },
        divider: 'rgba(255, 255, 255, 0.10)',
      }
