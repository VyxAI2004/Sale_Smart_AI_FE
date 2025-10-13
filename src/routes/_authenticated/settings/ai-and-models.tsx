import { createFileRoute } from '@tanstack/react-router'
import SettingsAIAndModels from '@/features/settings/ai-and-models'

export const Route = createFileRoute('/_authenticated/settings/ai-and-models')({
  component: SettingsAIAndModels,
})
