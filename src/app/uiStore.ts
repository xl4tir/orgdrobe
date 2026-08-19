import { create } from 'zustand'

/** Small global UI state — e.g. the app-wide "Add garment" dialog, opened from
 *  the sidebar, the header, or anywhere, without navigating first. */
interface UiState {
  addGarmentOpen: boolean
  openAddGarment: () => void
  closeAddGarment: () => void
}

export const useUiStore = create<UiState>((set) => ({
  addGarmentOpen: false,
  openAddGarment: () => set({ addGarmentOpen: true }),
  closeAddGarment: () => set({ addGarmentOpen: false }),
}))
