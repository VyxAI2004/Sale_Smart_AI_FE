/**
 * Project Status Button Component - Dropdown menu for changing project status
 */
import { useState } from 'react'
import { ChevronDown, Loader2, Circle } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ProjectApiResponse } from '@/features/projects/api/project-api'
import {
  STATUS_OPTIONS,
  getStatusTranslationKey,
} from '@/features/projects/constants/project.constants'
import { ProjectService } from '@/features/projects/services/project-service'

interface ProjectStatusButtonProps {
  project: ProjectApiResponse | null
  onStatusChange?: (project: ProjectApiResponse) => void
  disabled?: boolean
}

export function ProjectStatusButton({
  project,
  onStatusChange,
  disabled,
}: ProjectStatusButtonProps) {
  const { t } = useTranslation()
  const [isUpdating, setIsUpdating] = useState(false)

  if (!project) {
    return null
  }

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === project.status) || STATUS_OPTIONS[0]
  const currentStatusLabel =
    t(getStatusTranslationKey(currentStatus.value)) || currentStatus.label

  const handleStatusChange = async (newStatus: string) => {
    if (!project || newStatus === project.status || isUpdating) {
      return
    }

    try {
      setIsUpdating(true)
      const updatedProject = await ProjectService.updateProjectStatus(
        project.id,
        newStatus
      )

      if (onStatusChange) {
        onStatusChange(updatedProject)
      }
    } catch (error) {
      console.error('Failed to update project status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (colorClass: string) => {
    if (colorClass.includes('green')) return '#22c55e'
    if (colorClass.includes('yellow')) return '#eab308'
    if (colorClass.includes('orange')) return '#f97316'
    if (colorClass.includes('blue')) return '#3b82f6'
    return '#6b7280'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          disabled={disabled || isUpdating}
          className='flex items-center gap-2'
        >
          {isUpdating ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span className='hidden sm:inline'>
                {t('common.updating') || 'Updating...'}
              </span>
            </>
          ) : (
            <>
              <Circle
                className='h-3 w-3 fill-current'
                style={{ color: getStatusColor(currentStatus.color) }}
              />
              <Badge
                variant='outline'
                className={`${currentStatus.color} border-0 text-xs font-medium`}
              >
                {currentStatusLabel}
              </Badge>
              <ChevronDown className='h-4 w-4 opacity-50' />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='min-w-[150px]'>
        {STATUS_OPTIONS.map((status) => {
          const statusLabel =
            t(getStatusTranslationKey(status.value)) || status.label
          return (
            <DropdownMenuItem
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              disabled={isUpdating || status.value === project.status}
              className='flex items-center gap-2'
            >
              <Circle
                className='h-3 w-3 fill-current'
                style={{ color: getStatusColor(status.color) }}
              />
              <span>{statusLabel}</span>
              {status.value === project.status && (
                <span className='text-muted-foreground ml-auto text-xs'>✓</span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
