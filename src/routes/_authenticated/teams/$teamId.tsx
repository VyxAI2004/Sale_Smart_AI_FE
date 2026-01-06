import { createFileRoute } from '@tanstack/react-router'
import { TeamDetailPage } from '@/features/teams'

export const Route = createFileRoute('/_authenticated/teams/$teamId')({
  component: TeamDetailPage,
})
