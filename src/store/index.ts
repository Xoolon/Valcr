import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  accountTier: 'free' | 'pro' | 'teams' | 'embed-starter' | 'embed-business' | 'embed-agency'
  emailVerified: boolean
  isAdmin: boolean
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
  clearRecent: () => void
  saveCalculation: (calc: Omit<SavedCalculation, 'id' | 'createdAt'>) => void
  deleteCalculation: (id: string) => void
  fetchRecentCalculators: () => Promise<void>
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
      logout: () => {
        // Clear recent slugs so next user doesn't see previous user's history
        useCalcStore.getState().clearRecent()
        // Reset telemetry session — clears anonymous_id cookie
        // so the next account gets a fresh session profile
        import('@/api/telemetry').then(({ telemetryClient }) => {
          telemetryClient.resetSession()
        })
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'valcr-auth', storage: createJSONStorage(() => localStorage) }
  )
)

// NOT persisted — fetched fresh per user to prevent cross-account bleed
export const useCalcStore = create<CalcState>()((set) => ({
  savedCalculations: [],
  recentSlugs: [],

  addRecent: (slug) =>
    set((state) => ({
      recentSlugs: [slug, ...state.recentSlugs.filter((s) => s !== slug)].slice(0, 8),
    })),

  clearRecent: () => set({ recentSlugs: [] }),

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

  fetchRecentCalculators: async () => {
    const token = useAuthStore.getState().token
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    try {
      const res = await fetch(`${API}/telemetry/recent-calculators`, {
        credentials: 'include', headers,
      })
      if (res.ok) {
        const slugs = await res.json()
        set({ recentSlugs: Array.isArray(slugs) ? slugs : [] })
      }
    } catch (e) { console.error('fetchRecent failed', e) }
  },
}))

export function hasAccess(user: User | null, requiredTier: User['accountTier']): boolean {
  if (!user) return false
  if (user.isAdmin) return true
  const TIER_RANK: Record<User['accountTier'], number> = {
    free: 0, pro: 1, teams: 2,
    'embed-starter': 3, 'embed-business': 4, 'embed-agency': 5,
  }
  return TIER_RANK[user.accountTier] >= TIER_RANK[requiredTier]
}