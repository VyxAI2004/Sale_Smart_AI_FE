import { useMutation } from '@tanstack/react-query'
import { login } from '@/apis/auth.api'
import type { TLoginPayload } from '@/types/auth.type'
import { toast } from 'sonner'
import { setTokenResponseToLocalStorage } from '@/utils/localStorage'

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: TLoginPayload) => login(credentials),
    onSuccess: (response, variables) => {
      setTokenResponseToLocalStorage(response.data)
      toast.success(`Welcome back, ${variables.email}!`)
      window.location.href = '/'
    },
    onError: () => {
      toast.error('Invalid email or password')
    },
  })
}
