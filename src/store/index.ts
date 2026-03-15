import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  accountTier: 'free' | 'pro' | 'teams' | 'embed-starter' | 'embed-business' | 'embed-agency'
  emailVerified: boolean
  isAdmin?: boolean
}

export interface SavedCalculation {
  id: string
  calculatorSlug: string
  label: string
  inputData: Record<string, number | string>
  outputData: Record<string, number>
  isPublic: boolean
  shareToken?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User, token: string) => void
  updateTier: (tier: User['accountTier']) => void
  logout: () => void
}

interface CalcState {
  savedCalculations: SavedCalculation[]
  recentSlugs: string[]
  addRecent: (slug: string) => void
  saveCalculation: (calc: Omit<SavedCalculation, 'id' | 'createdAt'>) => void
  deleteCalculation: (id: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => set({ user, token, isAuthenticated: true }),
      updateTier: (tier) => {
        const u = get().user
        if (u) set({ user: { ...u, accountTier: tier } })
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'valcr-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const useCalcStore = create<CalcState>()((set) => ({
  savedCalculations: [],
  recentSlugs: [],
  addRecent: (slug) =>
    set((state) => ({
      recentSlugs: [slug, ...state.recentSlugs.filter((s) => s !== slug)].slice(0, 8),
    })),
  saveCalculation: (calc) =>
    set((state) => ({
      savedCalculations: [
        { ...calc, id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString() },
        ...state.savedCalculations,
      ],
    })),
  deleteCalculation: (id) =>
    set((state) => ({
      savedCalculations: state.savedCalculations.filter((c) => c.id !== id),
    })),
}))
