/**
 * WMO weather-code helpers. Open-Meteo returns a single `weather_code`; these
 * map it to a human label, an emoji, and one of the app's six conditions.
 * The per-condition colours mirror the values the old static widget used, so the
 * coloured card keeps its exact palette across both design languages.
 */
import type { WeatherCondition } from '@/types/domain'

const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82])
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86])
const STORM_CODES = new Set([95, 96, 99])

/** Long-form description per WMO code, falling back to a condition label. */
const LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Violent showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm',
}

export function codeToCondition(code: number): WeatherCondition {
  if (code <= 1) return 'sunny'
  if (code === 2 || code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (RAIN_CODES.has(code)) return 'rain'
  if (SNOW_CODES.has(code)) return 'snow'
  if (STORM_CODES.has(code)) return 'storm'
  return 'cloudy'
}

export function codeToEmoji(code: number): string {
  if (code <= 1) return '☀️'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (RAIN_CODES.has(code)) return '🌧️'
  if (SNOW_CODES.has(code)) return '❄️'
  if (STORM_CODES.has(code)) return '⛈️'
  return '☁️'
}

export function codeToLabel(code: number): string {
  return LABELS[code] ?? 'Unknown'
}

/** Card gradient/solid colours for each condition (reused from the old widget). */
export const CONDITION_COLORS: Record<
  WeatherCondition,
  { color: string; from: string; to: string }
> = {
  sunny: { color: '#EF7A3D', from: '#FDB44B', to: '#FF7E5F' },
  cloudy: { color: '#5C7CB3', from: '#8EC5FC', to: '#7C93C3' },
  rain: { color: '#3E5C82', from: '#5B7CB3', to: '#3E5C82' },
  snow: { color: '#6E8BB5', from: '#A7C7E7', to: '#C9D6DF' },
  fog: { color: '#71718A', from: '#B0AFC0', to: '#8A8AA0' },
  storm: { color: '#2C2E43', from: '#4B4E6D', to: '#2C2E43' },
}
