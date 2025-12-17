import { createFileRoute } from '@tanstack/react-router'
import { AddProjectForm } from '@/features/projects'

export const Route = createFileRoute('/_authenticated/projects/add')({
  component: AddProjectForm,
})
