import { Link } from '@tanstack/react-router'
import {
  Calendar,
  Users,
  Settings,
  Share2,
  Trash2,
  Edit,
  Play,
  Pause,
  Image,
  ArrowLeft,
} from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getStatusTranslationKey } from '../../constants/project.constants'
import type { ProjectDetailData } from '../../types/project-detail.types'

interface ProjectHeaderProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onTriggerCrawl?: () => void
}

export function ProjectHeader({
  project,
  isLoading = false,
  onEdit,
  onDelete,
  onShare,
  onTriggerCrawl,
}: ProjectHeaderProps) {
  const { t } = useTranslation()
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
        color: string
      }
    > = {
      draft: { variant: 'secondary', color: 'bg-gray-100 text-gray-700' },
      ready: { variant: 'outline', color: 'bg-blue-100 text-blue-700' },
      running: { variant: 'default', color: 'bg-green-100 text-green-700' },
      paused: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-700' },
      completed: { variant: 'default', color: 'bg-green-100 text-green-800' },
      archived: { variant: 'outline', color: 'bg-gray-100 text-gray-600' },
    }

    const config = variants[status] || variants.draft
    const statusLabel =
      t(getStatusTranslationKey(status)) ||
      status.charAt(0).toUpperCase() + status.slice(1)
    return (
      <Badge variant={config.variant} className={config.color}>
        {statusLabel}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className='mb-6'>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-16 w-16 rounded-lg' />
            <div className='space-y-2'>
              <Skeleton className='h-8 w-64' />
              <Skeleton className='h-4 w-96' />
              <div className='flex items-center gap-6'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-16' />
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-8 w-20' />
            <Skeleton className='h-8 w-20' />
            <Skeleton className='h-8 w-8' />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='mb-6'>
        <div className='flex items-center justify-center py-8'>
          <p className='text-muted-foreground'>
            {t('projects.projectNotFound')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='mb-6'>
      {/* Back Link */}
      <div className='mb-4'>
        <Link
          to='/projects'
          className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          {t('projects.backToProjects')}
        </Link>
      </div>

      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className='flex items-start gap-4'>
          {/* Project Image */}
          <div className='bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'>
            {project.product_images && project.product_images.length > 0 ? (
              <img
                src={project.product_images[0]}
                alt={project.name}
                className='h-full w-full rounded-lg object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Image
              className={`text-muted-foreground h-6 w-6 ${project.product_images && project.product_images.length > 0 ? 'hidden' : ''}`}
            />
          </div>

          {/* Project Info */}
          <div className='min-w-0 flex-1'>
            {/* Title & Status */}
            <div className='mb-1 flex items-center gap-3'>
              <h2 className='truncate text-2xl font-bold tracking-tight'>
                {project.name}
              </h2>
              {getStatusBadge(project.status || 'draft')}
            </div>

            {/* Description */}
            <p className='text-muted-foreground mb-2 line-clamp-2'>
              {project.description || t('projects.noDescription')}
            </p>

            {/* Meta Info */}
            <div className='text-muted-foreground flex flex-wrap items-center gap-6 text-sm'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                <span>
                  {t('projects.created')} {formatDate(project.created_at)}
                </span>
              </div>

              {project.deadline && (
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span>
                    {t('projects.due')}{' '}
                    {new Date(project.deadline).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}

              {project.team_members && project.team_members.length > 0 && (
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  <div className='flex items-center gap-1'>
                    <div className='flex -space-x-2'>
                      {project.team_members.slice(0, 3).map((member) => (
                        <Avatar
                          key={member.id}
                          className='h-5 w-5 border-2 border-white'
                        >
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className='text-xs'>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className='ml-2'>
                      {project.team_members.length}{' '}
                      {project.team_members.length > 1
                        ? t('projects.members')
                        : t('projects.member')}
                    </span>
                  </div>
                </div>
              )}

              {project.target_product_name && (
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{t('projects.target')}</span>
                  <span className='max-w-48 truncate'>
                    {project.target_product_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions - Same as ProjectsPrimaryButtons style */}
        <div className='flex items-center gap-2'>
          {onTriggerCrawl && (
            <Button
              size='sm'
              variant='outline'
              onClick={onTriggerCrawl}
              className='flex items-center gap-2'
            >
              {project.status === 'running' ? (
                <>
                  <Pause className='h-4 w-4' />
                  {t('projects.pause')}
                </>
              ) : (
                <>
                  <Play className='h-4 w-4' />
                  {t('projects.findProducts')}
                </>
              )}
            </Button>
          )}

          {onShare && (
            <Button size='sm' variant='outline' onClick={onShare}>
              <Share2 className='h-4 w-4' />
            </Button>
          )}

          {onEdit && (
            <Button size='sm' variant='outline' onClick={onEdit}>
              <Edit className='h-4 w-4' />
            </Button>
          )}

          <Button size='sm' variant='ghost'>
            <Settings className='h-4 w-4' />
          </Button>

          {onDelete && (
            <Button size='sm' variant='ghost' onClick={onDelete}>
              <Trash2 className='h-4 w-4 text-red-600' />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
