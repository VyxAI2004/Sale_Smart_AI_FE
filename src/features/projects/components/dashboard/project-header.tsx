import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
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
  ArrowLeft
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
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
  onTriggerCrawl
}: ProjectHeaderProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', color: string }> = {
      draft: { variant: 'secondary', color: 'bg-gray-100 text-gray-700' },
      ready: { variant: 'outline', color: 'bg-blue-100 text-blue-700' },
      running: { variant: 'default', color: 'bg-green-100 text-green-700' },
      paused: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-700' },
      completed: { variant: 'default', color: 'bg-green-100 text-green-800' },
      archived: { variant: 'outline', color: 'bg-gray-100 text-gray-600' }
    }
    
    const config = variants[status] || variants.draft
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <div className="flex items-center gap-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      {/* Back Link */}
      <div className="mb-4">
        <Link 
          to="/projects" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className="flex items-start gap-4">
          {/* Project Image */}
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            {project.product_images && project.product_images.length > 0 ? (
              <img 
                src={project.product_images[0]} 
                alt={project.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Image className={`w-6 h-6 text-muted-foreground ${project.product_images && project.product_images.length > 0 ? 'hidden' : ''}`} />
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            {/* Title & Status */}
            <div className="flex items-center gap-3 mb-1">
              <h2 className='text-2xl font-bold tracking-tight truncate'>
                {project.name}
              </h2>
              {getStatusBadge(project.status || 'draft')}
            </div>

            {/* Description */}
            <p className='text-muted-foreground mb-2 line-clamp-2'>
              {project.description || 'No description provided'}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(project.created_at)}</span>
              </div>
              
              {project.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due {new Date(project.deadline).toLocaleDateString('vi-VN')}</span>
                </div>
              )}

              {project.team_members && project.team_members.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {project.team_members.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="w-5 h-5 border-2 border-white">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="ml-2">
                      {project.team_members.length} member{project.team_members.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {project.target_product_name && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Target:</span>
                  <span className="truncate max-w-48">{project.target_product_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions - Same as ProjectsPrimaryButtons style */}
        <div className="flex items-center gap-2">
          {onTriggerCrawl && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onTriggerCrawl}
              className="flex items-center gap-2"
            >
              {project.status === 'running' ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Crawl
                </>
              )}
            </Button>
          )}

          {onShare && (
            <Button size="sm" variant="outline" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          )}

          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}

          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>

          {onDelete && (
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}