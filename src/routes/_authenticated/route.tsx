import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { Loading } from '@/components/loading'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

function AuthenticatedGuard() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />
  
  if (!isAuthenticated) {
    window.location.href = '/sign-in'
    return null
  }

  return <AuthenticatedLayout />
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedGuard,
})
