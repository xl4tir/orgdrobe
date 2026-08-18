import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  name: string
  email: string
  handle: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string) => void
  register: (name: string, email: string) => void
  logout: () => void
  updateUser: (patch: Partial<User>) => void
}

const deriveName = (email: string) => {
  const local = email.split('@')[0] || 'friend'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

/**
 * Mock auth persisted to localStorage. Swapping this for a real API later means
 * replacing the action bodies — the component contract stays identical.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email) =>
        set({
          isAuthenticated: true,
          user: { name: deriveName(email), email, handle: email.split('@')[0] },
        }),
      register: (name, email) =>
        set({
          isAuthenticated: true,
          user: { name, email, handle: email.split('@')[0] },
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
      updateUser: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    { name: 'orgdrobe.auth' },
  ),
)
