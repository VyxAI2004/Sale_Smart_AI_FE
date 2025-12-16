import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '@/features/projects/pages/analytics-page'

const analyticsSearchSchema = z.object({
  projectId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/analytics/')({
  validateSearch: analyticsSearchSchema,
  component: AnalyticsPage,
})
