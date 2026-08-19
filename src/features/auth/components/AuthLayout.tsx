import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { Logo } from '@/components/ui/Logo'
import { EmojiTile } from '@/components/ui/EmojiTile'
import { MOCK_GARMENTS } from '@/lib/mockData'

const FLOATERS = [
  { g: MOCK_GARMENTS[0], top: '14%', left: '12%', rotate: -10, delay: 0 },
  { g: MOCK_GARMENTS[6], top: '30%', left: '52%', rotate: 8, delay: 0.15 },
  { g: MOCK_GARMENTS[8], top: '54%', left: '20%', rotate: -6, delay: 0.3 },
  { g: MOCK_GARMENTS[10], top: '62%', left: '58%', rotate: 12, delay: 0.45 },
]

/** Split-screen auth frame: a branded, animated panel beside the form. */
export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      {/* Brand panel — desktop only */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          width: '46%',
          overflow: 'hidden',
          bgcolor: 'primary.main',
        }}
      >
        {FLOATERS.map((f, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 + f.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            sx={{ position: 'absolute', top: f.top, left: f.left, width: '30%', zIndex: 1 }}
          >
            <Box
              component={motion.div}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
              sx={{ transform: `rotate(${f.rotate}deg)`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.28))' }}
            >
              <EmojiTile category={f.g.category} colors={f.g.colors} ratio="3 / 4" radius={18} />
            </Box>
          </Box>
        ))}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Logo onDark />
          <Box>
            <Typography variant="h2" sx={{ color: '#fff', maxWidth: 460, mb: 2 }}>
              Your whole wardrobe, finally organized.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 420, fontSize: '1.05rem' }}>
              Catalogue what you own, craft outfits you love, and rediscover the pieces hiding in the back of the closet.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form panel */}
      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: { xs: 3, sm: 5 } }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          sx={{ width: '100%', maxWidth: 400 }}
        >
          <Stack sx={{ display: { xs: 'flex', md: 'none' }, mb: 4, alignItems: 'center' }}>
            <Logo />
          </Stack>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {subtitle}
          </Typography>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
