import { createTheme, responsiveFontSizes, type PaletteMode, type Theme } from '@mui/material'
import { getPalette } from './palette'
import { typography } from './typography'
import { getComponents } from './components'
import { getEditorialPalette, editorialTypography, getEditorialComponents } from './editorialTheme'
import { gradients, radii, softShadows } from './tokens'

/** The two design languages the app can render in. */
export type Design = 'material' | 'editorial'

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

export const createAppTheme = (mode: PaletteMode, design: Design = 'material'): Theme => {
  const editorial = design === 'editorial'
  const theme = createTheme({
    palette: editorial ? getEditorialPalette(mode) : getPalette(mode),
    typography: editorial ? editorialTypography : typography,
    shape: { borderRadius: editorial ? radii.md : 4 },
    spacing: 8,
    components: editorial ? getEditorialComponents() : getComponents(),
    custom: { gradients, radii, softShadows },
  })
  return responsiveFontSizes(theme, { factor: 2.2 })
}

export { gradients, radii, softShadows } from './tokens'
