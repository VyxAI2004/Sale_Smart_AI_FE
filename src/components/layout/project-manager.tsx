import * as React from 'react'
import { ChevronsUpDown, Plus, FolderOpen, Loader2 } from 'lucide-react'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { ProjectApi, type ProjectApiResponse } from '@/features/projects/api/project-api'
import { useTranslation } from '@/hooks/use-translation'
import { useProjectContext } from '@/contexts/project-context'

export function ProjectManager() {
  const { t } = useTranslation()
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  const { activeProject, isLoading, setActiveProject } = useProjectContext()
  const [projects, setProjects] = React.useState<ProjectApiResponse[]>([])

  // Fetch projects list for dropdown
  React.useEffect(() => {
    let cancelled = false
    
    const fetchProjects = async () => {
      try {
        const response = await ProjectApi.getMyProjects({ limit: 20 })
        
        if (cancelled) return
        
        setProjects(response.items || [])
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        if (!cancelled) {
          setProjects([])
        }
      }
    }

    fetchProjects()
    
    return () => {
      cancelled = true
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { translationKey: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      active: { translationKey: 'projects.status', variant: 'default' },
      draft: { translationKey: 'projects.statusDraft', variant: 'secondary' },
      ready: { translationKey: 'projects.statusReady', variant: 'outline' },
      running: { translationKey: 'projects.statusRunning', variant: 'default' },
      paused: { translationKey: 'projects.statusPaused', variant: 'secondary' },
      completed: { translationKey: 'projects.statusCompleted', variant: 'outline' },
      archived: { translationKey: 'projects.statusArchived', variant: 'secondary' },
    }
    const statusInfo = statusMap[status?.toLowerCase()] || { translationKey: 'projects.status', variant: 'secondary' as const }
    return { 
      label: t(statusInfo.translationKey), 
      variant: statusInfo.variant 
    }
  }

  const handleProjectSelect = (project: ProjectApiResponse) => {
    setActiveProject(project)
    // Don't navigate, let the context handle it
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <Loader2 className='size-4 animate-spin' />
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>{t('projects.title')}</span>
              <span className='truncate text-xs'>{t('projects.loading')}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (projects.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <FolderOpen className='size-4' />
                </div>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>{t('projects.title')}</span>
                  <span className='truncate text-xs'>{t('projects.noProjects')}</span>
                </div>
                <ChevronsUpDown className='ms-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              align='start'
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-muted-foreground text-xs'>
                {t('projects.title')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className='gap-2 p-2'>
                <Link to="/projects/add">
                  <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                    <Plus className='size-4' />
                  </div>
                  <div className='text-muted-foreground font-medium'>{t('projects.addProject')}</div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <FolderOpen className='size-4' />
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeProject?.name || t('projects.title')}
                </span>
                <span className='truncate text-xs'>
                  {activeProject ? getStatusBadge(activeProject.status || '').label : t('projects.selectProject')}
                </span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg max-h-[400px] overflow-y-auto'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              {t('projects.title')} ({projects.length})
            </DropdownMenuLabel>
            {projects.map((project, index) => {
              const statusInfo = getStatusBadge(project.status || '')
              const isActive = activeProject?.id === project.id
              return (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={`gap-2 p-2 ${isActive ? 'bg-accent' : ''}`}
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <FolderOpen className='size-4 shrink-0' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='truncate font-medium'>{project.name}</div>
                    <div className='flex items-center gap-2 mt-0.5'>
                      <Badge variant={statusInfo.variant} className='text-xs h-4 px-1'>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                  {isActive && (
                    <DropdownMenuShortcut>✓</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className='gap-2 p-2'>
              <Link to="/projects">
                <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                  <FolderOpen className='size-4' />
                </div>
                <div className='font-medium'>{t('projects.viewAll')}</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='gap-2 p-2'>
              <Link to="/projects/add">
                <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                  <Plus className='size-4' />
                </div>
                <div className='text-muted-foreground font-medium'>{t('projects.addProject')}</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
