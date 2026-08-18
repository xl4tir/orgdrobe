import type { GarmentCategory, Season } from '@/types/domain'

export const CATEGORY_LABELS: Record<GarmentCategory, string> = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear',
  dresses: 'Dresses',
  footwear: 'Footwear',
  accessories: 'Accessories',
}

export const CATEGORY_ORDER: GarmentCategory[] = [
  'tops',
  'bottoms',
  'outerwear',
  'dresses',
  'footwear',
  'accessories',
]

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
}

export const SEASON_EMOJI: Record<Season, string> = {
  spring: '🌱',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
}

export const ALL_SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']
