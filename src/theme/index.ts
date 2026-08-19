import { createTheme, responsiveFontSizes, type PaletteMode, type Theme } from '@mui/material'
import { getPalette } from './palette'
import { typography } from './typography'
import { getComponents } from './components'
import { gradients, radii, softShadows } from './tokens'

/**
 * Extra design tokens surfaced on the theme object so components can read brand
 * gradients / radii straight from `useTheme()` without importing token files.
 */
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: typeof gradients
      radii: typeof radii
      softShadows: typeof softShadows
    }
  }
  interface ThemeOptions {
    custom?: {
      gradients?: typeof gradients
      radii?: typeof radii
      softShadows?: typeof softShadows
    }
  }
}

export const createAppTheme = (mode: PaletteMode): Theme => {
  const theme = createTheme({
    palette: getPalette(mode),
    typography,
    shape: { borderRadius: 4 },
    spacing: 8,
    components: getComponents(),
    custom: { gradients, radii, softShadows },
  })
  return responsiveFontSizes(theme, { factor: 2.2 })
}

export { gradients, radii, softShadows } from './tokens'
