import { alpha, Box, Stack, Typography, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface InfoBannerProps {
  icon?: ReactNode
  children: ReactNode
  sx?: SxProps<Theme>
}

/** Soft, tinted info strip — the friendly "heads up" from the wireframes. */
export function InfoBanner({ icon, children, sx }: InfoBannerProps) {
  return (
    <Stack
      component={motion.div}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 3,
        border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
        bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'light' ? 0.06 : 0.12),
        color: 'text.secondary',
        ...sx,
      }}
    >
      {icon && (
        <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}>{icon}</Box>
      )}
      <Typography variant="body2">{children}</Typography>
    </Stack>
  )
}
