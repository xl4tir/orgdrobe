import { create } from 'zustand'
import type { Garment, GarmentCategory, Season } from '@/types/domain'
import { MOCK_GARMENTS } from '@/lib/mockData'

export type GarmentSort = 'recent' | 'most-worn' | 'least-worn' | 'name'

export interface GarmentFilters {
  search: string
  categories: GarmentCategory[]
  colors: string[]
  seasons: Season[]
  favoritesOnly: boolean
  sort: GarmentSort
}

interface GarmentState {
  garments: Garment[]
  filters: GarmentFilters
  setSearch: (v: string) => void
  toggleCategory: (c: GarmentCategory) => void
  toggleColor: (c: string) => void
  toggleSeason: (s: Season) => void
  toggleFavoritesOnly: () => void
  setSort: (s: GarmentSort) => void
  resetFilters: () => void
  toggleFavorite: (id: string) => void
  addGarment: (input: NewGarmentInput) => string
  removeGarment: (id: string) => void
  getById: (id: string) => Garment | undefined
}

export interface NewGarmentInput {
  name: string
  description?: string
  category: GarmentCategory
  colors: string[]
  seasons: Season[]
  brand?: string
  material?: string
  image?: string
}

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `g-${crypto.randomUUID().slice(0, 8)}`
    : `g-${Math.floor(Math.random() * 1e9).toString(36)}`

const emptyFilters: GarmentFilters = {
  search: '',
  categories: [],
  colors: [],
  seasons: [],
  favoritesOnly: false,
  sort: 'recent',
}

const toggle = <T>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

export const useGarmentStore = create<GarmentState>((set, get) => ({
  garments: MOCK_GARMENTS,
  filters: emptyFilters,
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  toggleCategory: (c) =>
    set((s) => ({ filters: { ...s.filters, categories: toggle(s.filters.categories, c) } })),
  toggleColor: (c) =>
    set((s) => ({ filters: { ...s.filters, colors: toggle(s.filters.colors, c) } })),
  toggleSeason: (season) =>
    set((s) => ({ filters: { ...s.filters, seasons: toggle(s.filters.seasons, season) } })),
  toggleFavoritesOnly: () =>
    set((s) => ({ filters: { ...s.filters, favoritesOnly: !s.filters.favoritesOnly } })),
  setSort: (sort) => set((s) => ({ filters: { ...s.filters, sort } })),
  resetFilters: () => set({ filters: emptyFilters }),
  toggleFavorite: (id) =>
    set((s) => ({
      garments: s.garments.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g)),
    })),
  addGarment: (input) => {
    const id = makeId()
    const garment: Garment = {
      id,
      name: input.name.trim() || 'Untitled garment',
      description: input.description?.trim() ?? '',
      category: input.category,
      image: input.image,
      colors: input.colors.length ? input.colors : ['stone'],
      seasons: input.seasons,
      brand: input.brand?.trim() || undefined,
      material: input.material?.trim() || undefined,
      timesWorn: 0,
      lastWorn: null,
      createdAt: new Date().toISOString(),
      favorite: false,
    }
    set((s) => ({ garments: [garment, ...s.garments] }))
    return id
  },
  removeGarment: (id) => set((s) => ({ garments: s.garments.filter((g) => g.id !== id) })),
  getById: (id) => get().garments.find((g) => g.id === id),
}))

/** Pure, memoisable filter+sort. Kept free of the store so it stays testable. */
export function applyGarmentFilters(garments: Garment[], filters: GarmentFilters): Garment[] {
  const q = filters.search.trim().toLowerCase()

  const filtered = garments.filter((g) => {
    if (filters.favoritesOnly && !g.favorite) return false
    if (filters.categories.length && !filters.categories.includes(g.category)) return false
    if (filters.seasons.length && !filters.seasons.some((s) => g.seasons.includes(s))) return false
    if (filters.colors.length && !filters.colors.some((c) => g.colors.includes(c))) return false
    if (q) {
      const haystack = `${g.name} ${g.description} ${g.brand ?? ''} ${g.material ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const sorters: Record<GarmentSort, (a: Garment, b: Garment) => number> = {
    recent: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    'most-worn': (a, b) => b.timesWorn - a.timesWorn,
    'least-worn': (a, b) => a.timesWorn - b.timesWorn,
    name: (a, b) => a.name.localeCompare(b.name),
  }
  return [...filtered].sort(sorters[filters.sort])
}

export const countActiveFilters = (f: GarmentFilters): number =>
  f.categories.length +
  f.colors.length +
  f.seasons.length +
  (f.favoritesOnly ? 1 : 0)
