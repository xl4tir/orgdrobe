import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Grid2 as Grid, Stack, Typography } from '@mui/material'
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import CloudRoundedIcon from '@mui/icons-material/CloudRounded'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import { motion } from 'framer-motion'
import { Logo } from '@/components/ui/Logo'
import { GradientText } from '@/components/ui/GradientText'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { EmojiTile } from '@/components/ui/EmojiTile'
import { useAuthStore } from '@/features/auth/store'
import { staggerContainer, riseItem } from '@/theme/motion'

const FEATURES = [
  {
    icon: <CheckroomRoundedIcon />,
    title: 'Catalogue everything',
    text: 'Snap and tag every garment. Search, filter by colour, season or how often you actually wear it.',
    color: '#6650E6',
  },
  {
    icon: <AutoAwesomeRoundedIcon />,
    title: 'Craft outfits',
    text: 'Combine pieces on a canvas, save your favourite looks and remix them in a tap.',
    color: '#FF6B57',
  },
  {
    icon: <CloudRoundedIcon />,
    title: 'Weather-aware',
    text: 'Get outfit suggestions that match today’s forecast — no more dressing wrong for the day.',
    color: '#3B93E8',
  },
  {
    icon: <InsightsRoundedIcon />,
    title: 'Real insights',
    text: 'See your colour palette, most-worn heroes and the pieces gathering dust.',
    color: '#2FA37A',
  },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Box>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Casually tossed, tilted cards with only light corner overlap — a playful scatter.
  // `et` tilts just the emoji so a few icons sit askew.
  const heroTiles = [
    { category: 'tops' as const, colors: ['sky', 'denim'], pos: { top: '2%', left: '3%' }, w: '37%', r: -12, z: 2, d: 0, et: -14 },
    { category: 'dresses' as const, colors: ['burgundy', 'plum'], pos: { top: '0%', right: '4%' }, w: '37%', r: 10, z: 3, d: 0.08, et: 0 },
    { category: 'outerwear' as const, colors: ['camel', 'sand'], pos: { top: '34%', left: '31%' }, w: '38%', r: -4, z: 5, d: 0.16, et: 12 },
    { category: 'footwear' as const, colors: ['white', 'stone'], pos: { bottom: '1%', left: '2%' }, w: '36%', r: 13, z: 4, d: 0.24, et: 0 },
    { category: 'accessories' as const, colors: ['forest', 'sage'], pos: { bottom: '0%', right: '3%' }, w: '37%', r: -11, z: 1, d: 0.32, et: -10 },
  ]

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Nav */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'saturate(180%) blur(14px)',
          backgroundColor: (t) => (t.palette.mode === 'light' ? 'rgba(250,248,244,0.7)' : 'rgba(20,17,25,0.7)'),
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
            <Logo />
            <Stack direction="row" spacing={1} alignItems="center">
              <ThemeToggle />
              <Button color="inherit" onClick={() => navigate('/login')} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                Log in
              </Button>
              <Button variant="contained" onClick={() => navigate(isAuthenticated ? '/app' : '/register')}>
                {isAuthenticated ? 'Open app' : 'Get started'}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 12 }, pb: { xs: 8, md: 14 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component={motion.div}
              variants={staggerContainer(0.12)}
              initial="initial"
              animate="animate"
            >
              <Box component={motion.div} variants={riseItem}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    display: 'inline-flex',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 999,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    mb: 3,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Your digital wardrobe · v0.1
                  </Typography>
                </Stack>
              </Box>
              <Typography component={motion.h1} variants={riseItem} variant="h1" sx={{ mb: 3 }}>
                Wear <GradientText>everything</GradientText> you own.
              </Typography>
              <Typography component={motion.p} variants={riseItem} variant="h6" sx={{ fontWeight: 400, color: 'text.secondary', mb: 4, maxWidth: 480 }}>
                OrgDrobe catalogues your clothes, helps you craft outfits you’ll actually wear, and surfaces the pieces you forgot you had.
              </Typography>
              <Stack component={motion.div} variants={riseItem} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" size="large" endIcon={<EastRoundedIcon />} onClick={() => navigate(isAuthenticated ? '/app' : '/register')}>
                  {isAuthenticated ? 'Open your wardrobe' : 'Start for free'}
                </Button>
                <Button variant="outlined" color="inherit" size="large" onClick={() => navigate('/login')}>
                  Try the demo
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative', height: { xs: 360, md: 480 } }}>
              {heroTiles.map((tile, i) => (
                <Box
                  key={tile.category}
                  component={motion.div}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.25 + tile.d, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  sx={{ position: 'absolute', ...tile.pos, width: tile.w, zIndex: tile.z }}
                >
                  <Box
                    component={motion.div}
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 5.5 + i, repeat: Infinity, ease: 'easeInOut' }}
                    sx={{
                      transform: `rotate(${tile.r}deg)`,
                      filter: 'drop-shadow(0 24px 48px rgba(27,23,18,0.18))',
                    }}
                  >
                    <EmojiTile category={tile.category} colors={tile.colors} emojiTilt={tile.et} ratio="3 / 4" radius={22} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features */}
      <Box sx={{ bgcolor: (t) => (t.palette.mode === 'light' ? 'background.paper' : 'rgba(255,255,255,0.02)'), py: { xs: 8, md: 12 }, borderBlock: (t) => `1px solid ${t.palette.divider}` }}>
        <Container maxWidth="lg">
          <Reveal>
            <Typography variant="overline" color="primary" align="center" sx={{ display: 'block' }}>
              Everything in one place
            </Typography>
            <Typography variant="h2" align="center" sx={{ mb: { xs: 5, md: 8 }, mt: 1 }}>
              Built for people who love their clothes
            </Typography>
          </Reveal>
          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Reveal delay={i * 0.08}>
                  <Box
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 4,
                      border: (t) => `1px solid ${t.palette.divider}`,
                      bgcolor: 'background.default',
                      transition: 'transform .3s, box-shadow .3s',
                      '&:hover': { transform: 'translateY(-6px)', boxShadow: (t) => t.custom.softShadows.md },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        color: '#fff',
                        background: `linear-gradient(135deg, ${f.color}, ${f.color}bb)`,
                        mb: 2,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {f.text}
                    </Typography>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
        <Reveal>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 6,
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              color: '#fff',
              background: (t) => t.custom.gradients.brandVivid,
            }}
          >
            <Typography variant="h2" sx={{ mb: 2 }}>
              Ready to meet your wardrobe?
            </Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 520, mx: 'auto', mb: 4, fontSize: '1.1rem' }}>
              It’s free to start. Add a few pieces and watch OrgDrobe do the rest.
            </Typography>
            <Button
              size="large"
              onClick={() => navigate(isAuthenticated ? '/app' : '/register')}
              sx={{ bgcolor: '#fff', color: 'primary.main', px: 4, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
              endIcon={<EastRoundedIcon />}
            >
              {isAuthenticated ? 'Open your wardrobe' : 'Get started free'}
            </Button>
          </Box>
        </Reveal>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ borderTop: (t) => `1px solid ${t.palette.divider}`, py: 4 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
            <Logo size={28} />
            <Typography variant="body2" color="text.secondary">
              © 2026 OrgDrobe · Made for people who love their clothes.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
