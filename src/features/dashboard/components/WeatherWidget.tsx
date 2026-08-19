import { Box, Card, Stack, Typography } from '@mui/material'
import AirRoundedIcon from '@mui/icons-material/AirRounded'
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import WbTwilightRoundedIcon from '@mui/icons-material/WbTwilightRounded'
import { motion } from 'framer-motion'
import type { Weather, WeatherCondition } from '@/types/domain'
import { riseItem } from '@/theme/motion'

const CONDITION: Record<WeatherCondition, { emoji: string; label: string; color: string }> = {
  sunny: { emoji: '☀️', label: 'Sunny', color: '#EF7A3D' },
  cloudy: { emoji: '⛅', label: 'Cloudy', color: '#5C7CB3' },
  rain: { emoji: '🌧️', label: 'Rainy', color: '#3E5C82' },
  snow: { emoji: '❄️', label: 'Snowy', color: '#6E8BB5' },
  fog: { emoji: '🌫️', label: 'Foggy', color: '#71718A' },
  storm: { emoji: '⛈️', label: 'Storm', color: '#2C2E43' },
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ display: 'flex', opacity: 0.9 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}

export function WeatherWidget({ weather }: { weather: Weather }) {
  const c = CONDITION[weather.condition]
  return (
    <Card
      component={motion.div}
      variants={riseItem}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        border: 'none',
        bgcolor: c.color,
        p: 3,
        minHeight: 200,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -30,
          right: -20,
          fontSize: 150,
          opacity: 0.22,
          transform: 'rotate(-8deg)',
          userSelect: 'none',
        }}
      >
        {c.emoji}
      </Box>

      <Stack sx={{ position: 'relative' }} spacing={2}>
        <Box>
          <Typography variant="overline" sx={{ opacity: 0.9 }}>
            {weather.city} · Today
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontSize: '3.4rem', lineHeight: 1, fontWeight: 600 }}>
              {weather.tempC}°
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>
              {c.label}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          <Metric icon={<WaterDropRoundedIcon fontSize="small" />} label="Humidity" value={`${weather.humidity}%`} />
          <Metric icon={<AirRoundedIcon fontSize="small" />} label="Wind" value={`${weather.windKmh} km/h`} />
          <Metric icon={<WbSunnyRoundedIcon fontSize="small" />} label="UV index" value={`${weather.uvIndex}`} />
          <Metric icon={<WbTwilightRoundedIcon fontSize="small" />} label="Sunset" value={weather.sunset} />
        </Stack>
      </Stack>
    </Card>
  )
}
