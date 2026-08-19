import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** A resolved place we can fetch a forecast for. */
export interface WeatherLocation {
  name: string
  country?: string
  latitude: number
  longitude: number
  timezone: string
}

export interface CurrentWeather {
  time: string
  temperature: number
  humidity: number
  code: number
  windSpeed: number
  isDay: boolean
}

export interface HourlyPoint {
  time: string
  temp: number
  code: number
}

export interface DailyPoint {
  date: string
  code: number
  max: number
  min: number
  sunset: string
  uvMax: number
}

export type WeatherStatus = 'idle' | 'loading' | 'ready' | 'error'

interface WeatherState {
  location: WeatherLocation
  current: CurrentWeather | null
  hourly: HourlyPoint[]
  daily: DailyPoint[]
  status: WeatherStatus
  setLocation: (loc: WeatherLocation) => void
  fetchWeather: () => Promise<void>
}

const DEFAULT_LOCATION: WeatherLocation = {
  name: 'Kyiv',
  country: 'Ukraine',
  latitude: 50.4547,
  longitude: 30.5238,
  timezone: 'Europe/Kyiv',
}

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

function buildForecastUrl(loc: WeatherLocation): string {
  const params = new URLSearchParams({
    latitude: String(loc.latitude),
    longitude: String(loc.longitude),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
    hourly: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunset,uv_index_max',
    timezone: 'auto',
    forecast_days: '7',
  })
  return `${FORECAST_URL}?${params.toString()}`
}

/**
 * Live weather backed by Open-Meteo. Only the chosen location is persisted; the
 * forecast itself is always re-fetched (it goes stale) on mount / location change.
 */
export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      location: DEFAULT_LOCATION,
      current: null,
      hourly: [],
      daily: [],
      status: 'idle',

      setLocation: (loc) => {
        set({ location: loc })
        void get().fetchWeather()
      },

      fetchWeather: async () => {
        set({ status: 'loading' })
        try {
          const res = await fetch(buildForecastUrl(get().location))
          if (!res.ok) throw new Error(`Weather request failed (${res.status})`)
          const data = await res.json()

          const c = data.current
          const current: CurrentWeather = {
            time: c.time,
            temperature: c.temperature_2m,
            humidity: c.relative_humidity_2m,
            code: c.weather_code,
            windSpeed: c.wind_speed_10m,
            isDay: c.is_day === 1,
          }

          const h = data.hourly
          const hourly: HourlyPoint[] = (h.time as string[]).map((time, i) => ({
            time,
            temp: h.temperature_2m[i],
            code: h.weather_code[i],
          }))

          const d = data.daily
          const daily: DailyPoint[] = (d.time as string[]).map((date, i) => ({
            date,
            code: d.weather_code[i],
            max: d.temperature_2m_max[i],
            min: d.temperature_2m_min[i],
            sunset: d.sunset[i],
            uvMax: d.uv_index_max[i],
          }))

          set({ current, hourly, daily, status: 'ready' })
        } catch {
          set({ status: 'error' })
        }
      },
    }),
    {
      name: 'orgdrobe.weather',
      partialize: (s) => ({ location: s.location }),
    },
  ),
)
