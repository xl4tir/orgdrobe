import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Card, CardActionArea, Grid2 as Grid, Stack, Typography } from '@mui/material'
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import LoopRoundedIcon from '@mui/icons-material/LoopRounded'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { StatTile } from '@/components/ui/StatTile'
import { ScrollRow } from '@/components/ui/ScrollRow'
import { GradientText } from '@/components/ui/GradientText'
import { GarmentCard } from '@/features/garments/components/GarmentCard'
import { OutfitCard } from '@/features/outfits/components/OutfitCard'
import { useGarmentStore } from '@/features/garments/store'
import { useOutfitStore } from '@/features/outfits/store'
import { useAuthStore } from '@/features/auth/store'
import { staggerContainer } from '@/theme/motion'
import { WeatherWidget } from '../components/WeatherWidget'
import { ColorBreakdown } from '../components/ColorBreakdown'
import { useWeatherStore } from '../weatherStore'
import { codeToCondition } from '../wmo'

export function DashboardPage() {
  const navigate = useNavigate()
  const garments = useGarmentStore((s) => s.garments)
  const outfits = useOutfitStore((s) => s.outfits)
  const user = useAuthStore((s) => s.user)
  const weather = useWeatherStore((s) => s.current)

  const stats = useMemo(() => {
    const wornTotal = garments.reduce((acc, g) => acc + g.timesWorn, 0)
    const favorites = garments.filter((g) => g.favorite).length + outfits.filter((o) => o.favorite).length
    return { garments: garments.length, outfits: outfits.length, wornTotal, favorites }
  }, [garments, outfits])

  const suggestedOutfits = useMemo(() => [...outfits].sort((a, b) => b.timesWorn - a.timesWorn).slice(0, 6), [outfits])
  const leastUsed = useMemo(() => [...garments].sort((a, b) => a.timesWorn - b.timesWorn).slice(0, 6), [garments])

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const hour = new Date().getHours()
  const partOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

  return (
    <PageContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1">
          Good {partOfDay}, <GradientText>{firstName}</GradientText>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {weather
            ? `It’s ${Math.round(weather.temperature)}° and ${codeToCondition(weather.code)} — here’s what’s worth wearing today.`
            : 'Here’s what’s worth wearing today.'}
        </Typography>
      </Box>

      {/* stats + weather */}
      <Grid
        container
        spacing={2.5}
        component={motion.div}
        variants={staggerContainer(0.06)}
        initial="initial"
        animate="animate"
        sx={{ mb: 5 }}
      >
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex' }}>
          <WeatherWidget />
        </Grid>
        <Grid size={{ xs: 6, md: 3.5 }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <StatTile label="Garments" value={stats.garments} icon={<CheckroomRoundedIcon fontSize="small" />} />
            <StatTile label="Outfits" value={stats.outfits} icon={<AutoAwesomeRoundedIcon fontSize="small" />} accent="secondary.main" />
          </Stack>
        </Grid>
        <Grid size={{ xs: 6, md: 3.5 }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <StatTile label="Times worn" value={stats.wornTotal} hint="all-time" icon={<LoopRoundedIcon fontSize="small" />} accent="success.main" />
            <StatTile label="Favourites" value={stats.favorites} icon={<FavoriteRoundedIcon fontSize="small" />} accent="secondary.main" />
          </Stack>
        </Grid>
      </Grid>

      {/* fast nav */}
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FastNavCard
            title="Browse garments"
            subtitle={`${stats.garments} pieces in your wardrobe`}
            icon={<CheckroomRoundedIcon />}
            onClick={() => navigate('/app/garments')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FastNavCard
            title="Craft an outfit"
            subtitle={`${stats.outfits} outfits ready to remix`}
            icon={<AutoAwesomeRoundedIcon />}
            accent
            onClick={() => navigate('/app/outfits')}
          />
        </Grid>
      </Grid>

      {/* suggestions: outfits */}
      <SectionRow
        title="Wear today"
        subtitle="Picked for the weather and your recent habits."
        onSeeAll={() => navigate('/app/outfits')}
      >
        <ScrollRow itemWidth={230}>
          {suggestedOutfits.map((o) => (
            <OutfitCard key={o.id} outfit={o} />
          ))}
        </ScrollRow>
      </SectionRow>

      {/* least used */}
      <SectionRow
        title="Give these another spin"
        subtitle="Your least-worn pieces — maybe today’s the day."
        onSeeAll={() => navigate('/app/garments')}
      >
        <ScrollRow itemWidth={200}>
          {leastUsed.map((g) => (
            <GarmentCard key={g.id} garment={g} />
          ))}
        </ScrollRow>
      </SectionRow>

      {/* palette */}
      <Grid container spacing={2.5} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ColorBreakdown garments={garments} />
        </Grid>
      </Grid>
    </PageContainer>
  )
}

function FastNavCard({
  title,
  subtitle,
  icon,
  accent,
  onClick,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  accent?: boolean
  onClick: () => void
}) {
  return (
    <Card
      component={motion.div}
      whileHover={{ y: -4 }}
      sx={{
        height: '100%',
        boxShadow: (t) => (t.custom.design === 'editorial' ? t.custom.softShadows.md : undefined),
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={(t) => ({
          p: 3,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          ...(t.custom.design === 'editorial'
            ? {
                color: '#fff',
                background: accent
                  ? t.custom.gradients.brand
                  : 'linear-gradient(135deg, #2A2740 0%, #1C1A2B 100%)',
              }
            : {
                bgcolor: accent ? 'secondary.main' : 'primary.main',
                color: accent ? 'secondary.contrastText' : 'primary.contrastText',
              }),
        })}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'rgba(255,255,255,0.16)',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {subtitle}
          </Typography>
        </Box>
        <EastRoundedIcon />
      </CardActionArea>
    </Card>
  )
}

function SectionRow({
  title,
  subtitle,
  onSeeAll,
  children,
}: {
  title: string
  subtitle?: string
  onSeeAll?: () => void
  children: React.ReactNode
}) {
  return (
    <Box sx={{ mb: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {onSeeAll && (
          <Button endIcon={<EastRoundedIcon />} onClick={onSeeAll} sx={{ flexShrink: 0 }}>
            See all
          </Button>
        )}
      </Stack>
      {children}
    </Box>
  )
}
