import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { TLoginResponse } from '@/types/auth.type'
import { useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'sonner'
import http from '@/utils/http'
import { setTokenResponseToLocalStorage } from '@/utils/localStorage'

// API endpoint to exchange Clerk token for your backend token
const exchangeClerkToken = async (clerkToken: string) => {
  return http.post<TLoginResponse>('/auth/clerk-exchange', {
    clerk_token: clerkToken,
  })
}

export const useClerkSync = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const clerkSyncMutation = useMutation({
    mutationFn: async () => {
      const clerkToken = await getToken()
      if (!clerkToken) {
        throw new Error('No Clerk token available')
      }
      return exchangeClerkToken(clerkToken)
    },
    onSuccess: (response) => {
      // Save backend tokens to localStorage
      setTokenResponseToLocalStorage(response.data)

      // Invalidate queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['me'] })

      toast.success(`Welcome back, ${user?.emailAddresses[0]?.emailAddress}!`)

      // Navigate to dashboard
      navigate({ to: '/', replace: true })
    },
    onError: () => {
      toast.error('Failed to sync with backend. Please try again.')
    },
  })

  return {
    syncClerkAuth: clerkSyncMutation.mutate,
    isLoading: clerkSyncMutation.isPending,
  }
}
