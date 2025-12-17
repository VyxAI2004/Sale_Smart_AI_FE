import { useAuth } from '@/hooks/use-auth'
import { Loading } from '@/components/loading'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) {
    window.location.href = '/sign-in'
    return null
  }

  return <>{children}</>
}
