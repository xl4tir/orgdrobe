import { Box, Card, Stack, Typography } from '@mui/material'
import AirRoundedIcon from '@mui/icons-material/AirRounded'
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import WbTwilightRoundedIcon from '@mui/icons-material/WbTwilightRounded'
import { motion } from 'framer-motion'
import type { Weather, WeatherCondition } from '@/types/domain'
import { riseItem } from '@/theme/motion'

const CONDITION: Record<WeatherCondition, { emoji: string; label: string; from: string; to: string }> = {
  sunny: { emoji: '☀️', label: 'Sunny', from: '#FDB44B', to: '#FF7E5F' },
  cloudy: { emoji: '⛅', label: 'Cloudy', from: '#8EC5FC', to: '#7C93C3' },
  rain: { emoji: '🌧️', label: 'Rainy', from: '#5B7CB3', to: '#3E5C82' },
  snow: { emoji: '❄️', label: 'Snowy', from: '#A7C7E7', to: '#C9D6DF' },
  fog: { emoji: '🌫️', label: 'Foggy', from: '#B0AFC0', to: '#8A8AA0' },
  storm: { emoji: '⛈️', label: 'Storm', from: '#4B4E6D', to: '#2C2E43' },
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
        background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`,
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
            <Typography sx={{ fontFamily: '"Fraunces Variable", serif', fontSize: '3.4rem', lineHeight: 1, fontWeight: 600 }}>
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
