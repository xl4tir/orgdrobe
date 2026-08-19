import { useEffect, useState } from 'react'
import { Autocomplete, Box, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import { useWeatherStore } from '../weatherStore'

/** Shape of a single Open-Meteo geocoding hit. */
interface GeoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  timezone: string
  country?: string
  country_code?: string
  admin1?: string
}

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

function subtitle(o: GeoResult): string {
  return [o.admin1, o.country].filter(Boolean).join(', ')
}

/**
 * Async city search. Queries the geocoding API ~300ms after the user stops
 * typing, and calls `setLocation` on select. `onSelect` lets the host (a Dialog)
 * close itself once a place is chosen.
 */
export function LocationPicker({ onSelect }: { onSelect?: () => void }) {
  const setLocation = useWeatherStore((s) => s.setLocation)
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<GeoResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = input.trim()
    if (q.length < 2) {
      setOptions([])
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        name: q,
        count: '6',
        language: 'en',
        format: 'json',
      })
      fetch(`${GEOCODE_URL}?${params.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          if (active) setOptions((data.results as GeoResult[]) ?? [])
        })
        .catch(() => {
          if (active) setOptions([])
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 300)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [input])

  return (
    <Autocomplete<GeoResult>
      fullWidth
      autoHighlight
      options={options}
      loading={loading}
      // Server already filters — pass options straight through.
      filterOptions={(x) => x}
      getOptionLabel={(o) => o.name}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      noOptionsText={input.trim().length < 2 ? 'Type a city name…' : 'No matches'}
      onInputChange={(_, value) => setInput(value)}
      onChange={(_, value) => {
        if (!value) return
        setLocation({
          name: value.name,
          country: value.country,
          latitude: value.latitude,
          longitude: value.longitude,
          timezone: value.timezone,
        })
        onSelect?.()
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
            <PlaceRoundedIcon fontSize="small" color="action" />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {option.name}
              </Typography>
              {subtitle(option) && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {subtitle(option)}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus
          label="City"
          placeholder="Search for a city…"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  )
}
