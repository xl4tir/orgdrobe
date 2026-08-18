import { useMemo } from 'react'
import { Box, Card, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import type { Garment } from '@/types/domain'
import { getColor, GROUP_LABELS, type ColorGroup } from '@/lib/colors'
import { riseItem } from '@/theme/motion'

/** Representative swatch colour per group, for the bar fills. */
const GROUP_SWATCH: Record<ColorGroup, string> = {
  green: '#6B7A4F',
  gray: '#7C7E86',
  white: '#E7E0D2',
  dark: '#2A2A2E',
  warm: '#C77F52',
  cool: '#4E6F9E',
}

export function ColorBreakdown({ garments }: { garments: Garment[] }) {
  const breakdown = useMemo(() => {
    const counts = new Map<ColorGroup, number>()
    for (const g of garments) {
      const group = getColor(g.colors[0]).group
      counts.set(group, (counts.get(group) ?? 0) + 1)
    }
    const total = garments.length || 1
    return [...counts.entries()]
      .map(([group, count]) => ({ group, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
  }, [garments])

  return (
    <Card component={motion.div} variants={riseItem} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Your palette
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        The colours you reach for most.
      </Typography>

      {/* single stacked bar */}
      <Box sx={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', mb: 3 }}>
        {breakdown.map((b) => (
          <Box
            key={b.group}
            component={motion.div}
            initial={{ width: 0 }}
            animate={{ width: `${b.pct}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            sx={{ bgcolor: GROUP_SWATCH[b.group], height: '100%' }}
          />
        ))}
      </Box>

      <Stack spacing={1.75}>
        {breakdown.map((b) => (
          <Stack key={b.group} direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: GROUP_SWATCH[b.group],
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
              {GROUP_LABELS[b.group]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {b.pct}%
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}
