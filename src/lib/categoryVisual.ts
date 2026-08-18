import type { GarmentCategory } from '@/types/domain'

/** Expressive emoji watermark per category — clearer than the icon set. */
export const CATEGORY_EMOJI: Record<GarmentCategory, string> = {
  tops: '👕',
  bottoms: '👖',
  outerwear: '🧥',
  dresses: '👗',
  footwear: '👟',
  accessories: '👜',
}
