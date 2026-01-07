import {
  FolderOpen,
  Users,
  ListTodo,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { ProjectApiResponse } from '../api/project-api'

interface ProjectsCardGridProps {
  projects: ProjectApiResponse[]
  onViewProject?: (projectId: string) => void
  onEditProject?: (projectId: string) => void
  onDeleteProject?: (projectId: string) => void
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  ready: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  running: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  paused:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  completed:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

export function ProjectsCardGrid({
  projects,
  onViewProject,
  onEditProject,
  onDeleteProject,
}: ProjectsCardGridProps) {
  if (projects.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-muted-foreground'>No projects found</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2'>
      {projects.map((project) => {
        const statusColor =
          STATUS_COLORS[project.status as string] || STATUS_COLORS.draft

        return (
          <Card
            key={project.id}
            className='flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg md:col-span-1'
            onClick={() => onViewProject?.(project.id)}
          >
            {/* Header with Icon and Actions */}
            <div className='flex h-32 items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:from-blue-950/30 dark:to-indigo-950/30'>
              <div className='flex items-center gap-3'>
                <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900'>
                  <FolderOpen className='h-8 w-8 text-blue-600 dark:text-blue-300' />
                </div>
                <div className='flex-1'>
                  <h3 className='line-clamp-2 text-sm font-semibold'>
                    {project.name}
                  </h3>
                  <p className='text-muted-foreground text-xs'>
                    {project.target_product_name}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewProject?.(project.id)
                    }}
                  >
                    <Eye className='mr-2 h-4 w-4' />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditProject?.(project.id)
                    }}
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-red-600 dark:text-red-400'
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteProject?.(project.id)
                    }}
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Content */}
            <CardContent className='flex-1 space-y-4 pt-4 pb-3'>
              {/* Status Badge */}
              <div className='flex flex-wrap gap-2'>
                <Badge className={statusColor}>{project.status}</Badge>
                {project.pipeline_type && (
                  <Badge variant='outline' className='text-xs'>
                    {project.pipeline_type}
                  </Badge>
                )}
              </div>

              {/* Description */}
              {project.description && (
                <p className='text-muted-foreground line-clamp-2 text-xs'>
                  {project.description}
                </p>
              )}

              {/* Category */}
              {project.target_product_category && (
                <p className='text-muted-foreground text-xs'>
                  📦 {project.target_product_category}
                </p>
              )}

              {/* Stats */}
              <div className='grid grid-cols-3 gap-2 border-t pt-2'>
                <div className='text-center'>
                  <div className='flex items-center justify-center gap-1'>
                    <Users className='h-3 w-3 text-gray-500' />
                    <span className='text-xs font-semibold'>0</span>
                  </div>
                  <p className='text-muted-foreground text-xs'>Members</p>
                </div>
                <div className='text-center'>
                  <div className='flex items-center justify-center gap-1'>
                    <ListTodo className='h-3 w-3 text-gray-500' />
                    <span className='text-xs font-semibold'>0</span>
                  </div>
                  <p className='text-muted-foreground text-xs'>Tasks</p>
                </div>
                <div className='text-center'>
                  <div className='flex items-center justify-center gap-1'>
                    <span className='text-xs font-semibold'>0</span>
                  </div>
                  <p className='text-muted-foreground text-xs'>Products</p>
                </div>
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className='flex gap-2 border-t pt-3 pb-3'>
              <Button
                size='sm'
                variant='outline'
                className='flex-1 text-xs'
                onClick={(e) => {
                  e.stopPropagation()
                  onViewProject?.(project.id)
                }}
              >
                Details
              </Button>
              <Button
                size='sm'
                className='flex-1 text-xs'
                onClick={(e) => {
                  e.stopPropagation()
                  onEditProject?.(project.id)
                }}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
