import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import AirRoundedIcon from '@mui/icons-material/AirRounded'
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import WbTwilightRoundedIcon from '@mui/icons-material/WbTwilightRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { motion } from 'framer-motion'
import { riseItem } from '@/theme/motion'
import { CONDITION_COLORS, codeToCondition, codeToEmoji, codeToLabel } from '../wmo'
import { useWeatherStore } from '../weatherStore'
import { LocationPicker } from './LocationPicker'

/** "2026-08-19T20:34" → "20:34" */
const hhmm = (iso: string) => iso.slice(11, 16)
/** "2026-08-19T14:00" → "14:00" */
const hourLabel = (iso: string) => `${iso.slice(11, 13)}:00`

function dayLabel(date: string, index: number): string {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' })
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

export function WeatherWidget() {
  const location = useWeatherStore((s) => s.location)
  const current = useWeatherStore((s) => s.current)
  const hourly = useWeatherStore((s) => s.hourly)
  const daily = useWeatherStore((s) => s.daily)
  const status = useWeatherStore((s) => s.status)
  const fetchWeather = useWeatherStore((s) => s.fetchWeather)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [view, setView] = useState<'hourly' | 'daily'>('hourly')

  useEffect(() => {
    if (status === 'idle') void fetchWeather()
  }, [status, fetchWeather])

  const condition = current ? codeToCondition(current.code) : 'cloudy'
  const c = CONDITION_COLORS[condition]
  const today = daily[0]

  // Next ~12 hours starting from the current hour.
  const upcoming = current
    ? hourly.filter((h) => h.time.slice(0, 13) >= current.time.slice(0, 13)).slice(0, 12)
    : []

  return (
    <Card
      component={motion.div}
      variants={riseItem}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        border: 'none',
        width: '100%',
        height: '100%',
        background: (t) =>
          t.custom.design === 'editorial'
            ? `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`
            : c.color,
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
        {codeToEmoji(current?.code ?? 3)}
      </Box>

      <Stack sx={{ position: 'relative', height: '100%' }} spacing={2}>
        {/* Header: a clear, tappable location selector */}
        <Box>
          <Button
            onClick={() => setPickerOpen(true)}
            startIcon={<PlaceRoundedIcon />}
            endIcon={<ExpandMoreRoundedIcon />}
            aria-label="Change location"
            sx={{
              maxWidth: '100%',
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.18)',
              borderRadius: 999,
              px: 1.5,
              py: 0.5,
              textTransform: 'none',
              fontWeight: 700,
              lineHeight: 1.2,
              '& .MuiButton-endIcon': { ml: 0.25 },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {location.name}
              {location.country ? `, ${location.country}` : ''}
            </Box>
          </Button>
        </Box>

        {status === 'error' ? (
          <Stack spacing={1.5} alignItems="flex-start" sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.95 }}>
              Couldn’t load weather.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => void fetchWeather()}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}
            >
              Retry
            </Button>
          </Stack>
        ) : !current ? (
          <Stack alignItems="center" justifyContent="center" sx={{ flex: 1, py: 4 }}>
            <CircularProgress color="inherit" size={28} />
          </Stack>
        ) : (
          <>
            {/* Current */}
            <Box>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography
                  sx={{
                    fontFamily: (t) =>
                      t.custom.design === 'editorial' ? '"Fraunces Variable", serif' : undefined,
                    fontSize: '3.4rem',
                    lineHeight: 1,
                    fontWeight: 600,
                  }}
                >
                  {Math.round(current.temperature)}°
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95 }}>
                  {codeToLabel(current.code)} {codeToEmoji(current.code)}
                </Typography>
              </Stack>
            </Box>

            {/* Metrics */}
            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              <Metric
                icon={<WaterDropRoundedIcon fontSize="small" />}
                label="Humidity"
                value={`${Math.round(current.humidity)}%`}
              />
              <Metric
                icon={<AirRoundedIcon fontSize="small" />}
                label="Wind"
                value={`${Math.round(current.windSpeed)} km/h`}
              />
              <Metric
                icon={<WbSunnyRoundedIcon fontSize="small" />}
                label="UV index"
                value={today ? `${Math.round(today.uvMax)}` : '—'}
              />
              <Metric
                icon={<WbTwilightRoundedIcon fontSize="small" />}
                label="Sunset"
                value={today ? hhmm(today.sunset) : '—'}
              />
            </Stack>

            {/* Hourly | 7-day toggle */}
            <ToggleButtonGroup
              exclusive
              size="small"
              value={view}
              onChange={(_, v) => v && setView(v)}
              sx={{
                alignSelf: 'flex-start',
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.85)',
                  borderColor: 'rgba(255,255,255,0.35)',
                  px: 1.5,
                  py: 0.25,
                  fontSize: '0.7rem',
                  textTransform: 'none',
                },
                '& .Mui-selected': {
                  color: '#fff !important',
                  bgcolor: 'rgba(255,255,255,0.22) !important',
                },
              }}
            >
              <ToggleButton value="hourly">Hourly</ToggleButton>
              <ToggleButton value="daily">7-day</ToggleButton>
            </ToggleButtonGroup>

            {view === 'hourly' ? (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  overflowX: 'auto',
                  pb: 0.5,
                  // slim, subtle scrollbar on the coloured card
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    borderRadius: 3,
                  },
                }}
              >
                {upcoming.map((h) => (
                  <Stack key={h.time} alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      {hourLabel(h.time)}
                    </Typography>
                    <Box sx={{ fontSize: 18, lineHeight: 1 }}>{codeToEmoji(h.code)}</Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {Math.round(h.temp)}°
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Stack spacing={0.5}>
                {daily.map((d, i) => (
                  <Stack
                    key={d.date}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ py: 0.25 }}
                  >
                    <Typography variant="body2" sx={{ width: 72, opacity: 0.95 }}>
                      {dayLabel(d.date, i)}
                    </Typography>
                    <Box sx={{ fontSize: 18, lineHeight: 1 }}>{codeToEmoji(d.code)}</Box>
                    <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 700 }}>
                      {Math.round(d.max)}°{' '}
                      <Box component="span" sx={{ opacity: 0.7, fontWeight: 500 }}>
                        / {Math.round(d.min)}°
                      </Box>
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </>
        )}
      </Stack>

      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Change location</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ pt: 1 }}>
            <LocationPicker onSelect={() => setPickerOpen(false)} />
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
