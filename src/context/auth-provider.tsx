import { type ReactNode, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMeQueryOptions } from '@/queries/auth.query'
import {
  getAccessTokenFromLocalStorage,
  removeAllTokensFromLocalStorage,
} from '@/utils/localStorage'
import { AuthContext } from './auth.types'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const token = getAccessTokenFromLocalStorage()

  const { data: user, isLoading } = useQuery({
    ...getMeQueryOptions(),
    enabled: !!token,
  })

  const queryClient = useQueryClient()

  const handleLogout = useCallback(() => {
    removeAllTokensFromLocalStorage()
    queryClient.clear()
    window.location.href = '/sign-in'
  }, [queryClient])

  const value = useMemo(
    () => ({
      user: user?.data,
      isLoading,
      error: null,
      isAuthenticated: !!token && !!user?.data,
      logout: handleLogout,
    }),
    [user, isLoading, token, handleLogout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
