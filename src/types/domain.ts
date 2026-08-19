/** Core domain model for OrgDrobe. Kept framework-agnostic on purpose. */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type GarmentCategory =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'dresses'
  | 'footwear'
  | 'accessories'

export interface Garment {
  id: string
  name: string
  description: string
  category: GarmentCategory
  /** Photo URL or data URL. When absent, the UI falls back to a colour silhouette. */
  image?: string
  /** Colour ids referencing the catalogue in lib/colors. First one is dominant. */
  colors: string[]
  seasons: Season[]
  brand?: string
  material?: string
  timesWorn: number
  /** ISO date, or null if never worn. */
  lastWorn: string | null
  createdAt: string
  favorite: boolean
}

export type OutfitLayout = 'cover' | 'grid' | 'canvas'

export interface Outfit {
  id: string
  name: string
  description: string
  garmentIds: string[]
  /** A separately-uploaded cover photo (the outfit's "look"). Shown in the Cover layout. */
  coverImage?: string
  layout: OutfitLayout
  seasons: Season[]
  timesWorn: number
  lastWorn: string | null
  createdAt: string
  favorite: boolean
}

export type FeedEventType =
  | 'outfit_worn'
  | 'outfit_created'
  | 'garment_created'
  | 'garment_worn'

export interface FeedEvent {
  id: string
  type: FeedEventType
  /** garment id or outfit id depending on type. */
  refId: string
  at: string
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'storm'

export interface Weather {
  tempC: number
  condition: WeatherCondition
  precipitationMm: number
  windKmh: number
  humidity: number
  uvIndex: number
  sunset: string
  city: string
}
