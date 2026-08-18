import { Box, Button, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { scaleIn } from '@/theme/motion'

interface EmptyStateProps {
  emoji?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export function EmptyState({
  emoji = '🧺',
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      component={motion.div}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      sx={{
        textAlign: 'center',
        py: { xs: 6, md: 9 },
        px: 3,
        border: (t) => `1.5px dashed ${t.palette.divider}`,
        borderRadius: 4,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: '2.2rem',
            bgcolor: (t) => (t.palette.mode === 'light' ? 'grey.100' : 'rgba(255,255,255,0.05)'),
          }}
        >
          {icon ?? emoji}
        </Box>
        <Typography variant="h5">{title}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
            {description}
          </Typography>
        )}
        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  )
}
