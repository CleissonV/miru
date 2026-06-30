import { create } from 'zustand'

export type Language = 'pt-BR' | 'en'

interface AuthUser {
  id: string
  username: string
  email: string
  displayName: string | null
  avatar: string | null
  language: Language
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  setUser: user => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}))
