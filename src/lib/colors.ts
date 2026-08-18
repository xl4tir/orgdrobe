/** A curated fashion colour catalogue. Every garment references these by id. */
export type ColorGroup = 'green' | 'gray' | 'white' | 'dark' | 'warm' | 'cool'

export interface GarmentColor {
  id: string
  name: string
  hex: string
  group: ColorGroup
}

export const COLORS: GarmentColor[] = [
  { id: 'ivory', name: 'Ivory', hex: '#F3EEE2', group: 'white' },
  { id: 'cream', name: 'Cream', hex: '#E9E0CD', group: 'white' },
  { id: 'sand', name: 'Sand', hex: '#D9C7A6', group: 'warm' },
  { id: 'camel', name: 'Camel', hex: '#B98A54', group: 'warm' },
  { id: 'rust', name: 'Rust', hex: '#B15533', group: 'warm' },
  { id: 'terracotta', name: 'Terracotta', hex: '#C96F4A', group: 'warm' },
  { id: 'mustard', name: 'Mustard', hex: '#D0A02A', group: 'warm' },
  { id: 'burgundy', name: 'Burgundy', hex: '#6E2733', group: 'warm' },
  { id: 'sage', name: 'Sage', hex: '#9CA88A', group: 'green' },
  { id: 'olive', name: 'Olive', hex: '#6B6B3A', group: 'green' },
  { id: 'forest', name: 'Forest', hex: '#2F5140', group: 'green' },
  { id: 'emerald', name: 'Emerald', hex: '#1F7A5A', group: 'green' },
  { id: 'sky', name: 'Sky', hex: '#8FB6D6', group: 'cool' },
  { id: 'denim', name: 'Denim', hex: '#3E5C82', group: 'cool' },
  { id: 'navy', name: 'Navy', hex: '#222E4A', group: 'cool' },
  { id: 'lilac', name: 'Lilac', hex: '#B6A8DC', group: 'cool' },
  { id: 'blush', name: 'Blush', hex: '#E4C0C0', group: 'warm' },
  { id: 'stone', name: 'Stone', hex: '#B4AC9F', group: 'gray' },
  { id: 'slate', name: 'Slate', hex: '#6E7079', group: 'gray' },
  { id: 'charcoal', name: 'Charcoal', hex: '#3B3B3F', group: 'gray' },
  { id: 'black', name: 'Black', hex: '#1B1B1D', group: 'dark' },
  { id: 'white', name: 'White', hex: '#FAFAF7', group: 'white' },
  { id: 'chocolate', name: 'Chocolate', hex: '#5A3B2E', group: 'warm' },
  { id: 'khaki', name: 'Khaki', hex: '#A19256', group: 'green' },
  { id: 'mint', name: 'Mint', hex: '#A7D6C3', group: 'green' },
  { id: 'teal', name: 'Teal', hex: '#2E7D77', group: 'cool' },
  { id: 'cobalt', name: 'Cobalt', hex: '#2B4CC0', group: 'cool' },
  { id: 'plum', name: 'Plum', hex: '#5E3A6E', group: 'cool' },
  { id: 'peach', name: 'Peach', hex: '#F0B49A', group: 'warm' },
  { id: 'cherry', name: 'Cherry', hex: '#B02A3A', group: 'warm' },
  { id: 'graphite', name: 'Graphite', hex: '#2C2E33', group: 'dark' },
]

export const colorMap: Record<string, GarmentColor> = Object.fromEntries(
  COLORS.map((c) => [c.id, c]),
)

export const getColor = (id: string): GarmentColor =>
  colorMap[id] ?? { id, name: id, hex: '#9E9E9E', group: 'gray' }

export const GROUP_LABELS: Record<ColorGroup, string> = {
  green: 'Greens',
  gray: 'Grays',
  white: 'Whites',
  dark: 'Darks',
  warm: 'Warm',
  cool: 'Cool',
}
