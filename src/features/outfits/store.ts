import { create } from 'zustand'
import type { Outfit, Season } from '@/types/domain'
import { MOCK_OUTFITS } from '@/lib/mockData'

export type OutfitSort = 'recent' | 'most-worn' | 'name'

export interface OutfitFilters {
  search: string
  seasons: Season[]
  favoritesOnly: boolean
  sort: OutfitSort
}

interface OutfitState {
  outfits: Outfit[]
  filters: OutfitFilters
  setSearch: (v: string) => void
  toggleSeason: (s: Season) => void
  toggleFavoritesOnly: () => void
  setSort: (s: OutfitSort) => void
  resetFilters: () => void
  toggleFavorite: (id: string) => void
  addOutfit: (input?: Partial<Pick<Outfit, 'name' | 'description' | 'garmentIds' | 'layout' | 'seasons'>>) => string
  updateOutfit: (id: string, patch: Partial<Omit<Outfit, 'id'>>) => void
  removeOutfit: (id: string) => void
  getById: (id: string) => Outfit | undefined
}

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `o-${crypto.randomUUID().slice(0, 8)}`
    : `o-${Math.floor(Math.random() * 1e9).toString(36)}`

const emptyFilters: OutfitFilters = {
  search: '',
  seasons: [],
  favoritesOnly: false,
  sort: 'recent',
}

const toggle = <T>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

export const useOutfitStore = create<OutfitState>((set, get) => ({
  outfits: MOCK_OUTFITS,
  filters: emptyFilters,
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  toggleSeason: (season) =>
    set((s) => ({ filters: { ...s.filters, seasons: toggle(s.filters.seasons, season) } })),
  toggleFavoritesOnly: () =>
    set((s) => ({ filters: { ...s.filters, favoritesOnly: !s.filters.favoritesOnly } })),
  setSort: (sort) => set((s) => ({ filters: { ...s.filters, sort } })),
  resetFilters: () => set({ filters: emptyFilters }),
  toggleFavorite: (id) =>
    set((s) => ({
      outfits: s.outfits.map((o) => (o.id === id ? { ...o, favorite: !o.favorite } : o)),
    })),
  addOutfit: (input) => {
    const id = makeId()
    const outfit: Outfit = {
      id,
      name: input?.name ?? 'New outfit',
      description: input?.description ?? '',
      garmentIds: input?.garmentIds ?? [],
      layout: input?.layout ?? 'grid',
      seasons: input?.seasons ?? [],
      timesWorn: 0,
      lastWorn: null,
      createdAt: new Date().toISOString(),
      favorite: false,
    }
    set((s) => ({ outfits: [outfit, ...s.outfits] }))
    return id
  },
  updateOutfit: (id, patch) =>
    set((s) => ({
      outfits: s.outfits.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    })),
  removeOutfit: (id) => set((s) => ({ outfits: s.outfits.filter((o) => o.id !== id) })),
  getById: (id) => get().outfits.find((o) => o.id === id),
}))

export function applyOutfitFilters(outfits: Outfit[], filters: OutfitFilters): Outfit[] {
  const q = filters.search.trim().toLowerCase()

  const filtered = outfits.filter((o) => {
    if (filters.favoritesOnly && !o.favorite) return false
    if (filters.seasons.length && !filters.seasons.some((s) => o.seasons.includes(s))) return false
    if (q && !`${o.name} ${o.description}`.toLowerCase().includes(q)) return false
    return true
  })

  const sorters: Record<OutfitSort, (a: Outfit, b: Outfit) => number> = {
    recent: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    'most-worn': (a, b) => b.timesWorn - a.timesWorn,
    name: (a, b) => a.name.localeCompare(b.name),
  }
  return [...filtered].sort(sorters[filters.sort])
}
