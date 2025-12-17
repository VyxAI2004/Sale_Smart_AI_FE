export const statuses = [
  {
    value: 'draft',
    label: 'Draft',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    value: 'ready',
    label: 'Ready',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    value: 'running',
    label: 'Running',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    value: 'paused',
    label: 'Paused',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    value: 'archived',
    label: 'Archived',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
] as const

export const pipelineTypes = [
  {
    value: 'standard',
    label: 'Standard',
  },
  {
    value: 'advanced',
    label: 'Advanced',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
] as const

export const crawlSchedules = [
  {
    value: 'daily',
    label: 'Daily',
  },
  {
    value: 'weekly',
    label: 'Weekly',
  },
  {
    value: 'monthly',
    label: 'Monthly',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
] as const
