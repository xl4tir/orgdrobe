import { alpha, Box, Card, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { riseItem } from '@/theme/motion'

interface StatTileProps {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  accent?: string
}

export function StatTile({ label, value, hint, icon, accent = 'primary.main' }: StatTileProps) {
  return (
    <Card
      component={motion.div}
      variants={riseItem}
      whileHover={{ y: -4 }}
      sx={{ p: 2.5, height: '100%' }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        {icon && (
          <Box
            sx={{
              color: accent,
              display: 'grid',
              placeItems: 'center',
              width: 34,
              height: 34,
              borderRadius: 2,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
            }}
          >
            {icon}
          </Box>
        )}
      </Stack>
      <Typography variant="h4" sx={{ mt: 1 }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Card>
  )
}
