import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Loading } from '@/components/loading'

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
