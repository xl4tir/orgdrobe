import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CssBaseline, ThemeProvider, type PaletteMode } from '@mui/material'
import { createAppTheme, type Design } from './index'

interface ColorModeContextValue {
  mode: PaletteMode
  toggle: () => void
  setMode: (mode: PaletteMode) => void
  design: Design
  setDesign: (design: Design) => void
  toggleDesign: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined)
const STORAGE_KEY = 'orgdrobe.color-mode'
const DESIGN_KEY = 'orgdrobe.design'

const getInitialMode = (): PaletteMode => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getInitialDesign = (): Design => {
  if (typeof window === 'undefined') return 'material'
  return window.localStorage.getItem(DESIGN_KEY) === 'editorial' ? 'editorial' : 'material'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PaletteMode>(getInitialMode)
  const [design, setDesignState] = useState<Design>(getInitialDesign)

  const setMode = useCallback((next: PaletteMode) => {
    setModeState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggle = useCallback(() => setMode(mode === 'light' ? 'dark' : 'light'), [mode, setMode])

  const setDesign = useCallback((next: Design) => {
    setDesignState(next)
    window.localStorage.setItem(DESIGN_KEY, next)
  }, [])

  const toggleDesign = useCallback(
    () => setDesign(design === 'material' ? 'editorial' : 'material'),
    [design, setDesign],
  )

  useEffect(() => {
    document.documentElement.style.colorScheme = mode
  }, [mode])

  const theme = useMemo(() => createAppTheme(mode, design), [mode, design])
  const value = useMemo(
    () => ({ mode, toggle, setMode, design, setDesign, toggleDesign }),
    [mode, toggle, setMode, design, setDesign, toggleDesign],
  )

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
  const ctx = useContext(ColorModeContext)
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider')
  return ctx
}
