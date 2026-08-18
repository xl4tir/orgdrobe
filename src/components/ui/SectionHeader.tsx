import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  overline?: string
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}

export function SectionHeader({ overline, title, subtitle, action }: SectionHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
      justifyContent="space-between"
      sx={{ mb: 3 }}
    >
      <Box>
        {overline && (
          <Typography variant="overline" color="primary" sx={{ display: 'block', mb: 0.5 }}>
            {overline}
          </Typography>
        )}
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  )
}
