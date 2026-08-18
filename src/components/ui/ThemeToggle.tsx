import { IconButton, Tooltip } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useColorMode } from '@/theme/ColorModeContext'

export function ThemeToggle() {
  const { mode, toggle } = useColorMode()
  const isDark = mode === 'dark'
  return (
    <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
      <IconButton onClick={toggle} color="inherit" aria-label="Toggle colour mode">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            initial={{ y: -12, opacity: 0, rotate: -30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 12, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'inline-flex' }}
          >
            {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </motion.span>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  )
}
