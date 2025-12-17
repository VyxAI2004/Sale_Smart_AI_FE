import { createContext } from 'react'
import type { TUser } from '@/types/auth.type'

export type AuthContextType = {
  user: TUser | undefined
  isLoading: boolean
  error: Error | null
  isAuthenticated: boolean
  logout: (callback?: () => void) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
