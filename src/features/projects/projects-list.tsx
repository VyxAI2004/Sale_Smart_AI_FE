import { useState, useEffect, useCallback } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Loader2, Maximize2, Minimize2, Grid, List } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { useViewModePreference } from '@/hooks/use-view-mode-preference'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProjectApi, type ProjectApiResponse } from './api/project-api'
import { ProjectsDialogs } from './components/projects-dialogs'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { ProjectsProvider } from './components/projects-provider'
import { ProjectsTable } from './components/projects-table'
import { ProjectsCardGrid } from './components/projects-card-grid'

const route = getRouteApi('/_authenticated/projects/')

export function Projects() {
  const { t } = useTranslation()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [projects, setProjects] = useState<ProjectApiResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [viewMode, setViewMode] = useViewModePreference('projects-view-mode')

  const fetchProjects = useCallback(async () => {
    try {
      const response = await ProjectApi.getMyProjects({ limit: 10 })
      setProjects(response.items || [])
    } catch (_error) {
      // Failed to fetch projects, use empty array
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  if (loading) {
    return (
      <ProjectsProvider onRefresh={fetchProjects}>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setIsFullWidth(!isFullWidth)}
                    className='hidden h-8 w-8 p-0 md:flex'
                  >
                    {isFullWidth ? (
                      <Minimize2 className='h-4 w-4' />
                    ) : (
                      <Maximize2 className='h-4 w-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isFullWidth
                      ? t('common.collapseTable')
                      : t('common.expandTable')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <LanguageSwitcher />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main fluid={isFullWidth}>
          <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        </Main>
      </ProjectsProvider>
    )
  }

  return (
    <ProjectsProvider onRefresh={fetchProjects}>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsFullWidth(!isFullWidth)}
                  className='hidden h-8 w-8 p-0 md:flex'
                >
                  {isFullWidth ? (
                    <Minimize2 className='h-4 w-4' />
                  ) : (
                    <Maximize2 className='h-4 w-4' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullWidth ? 'Thu nhỏ bảng' : 'Mở rộng bảng'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <LanguageSwitcher />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fluid={isFullWidth}>
        <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('projects.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('projects.description')} ({projects.length} {t('common.total')}
              )
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <ProjectsPrimaryButtons />
            <div className='ml-2 flex items-center gap-1 rounded-md border p-1'>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => setViewMode('table')}
                title='Table view'
              >
                <List className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => setViewMode('grid')}
                title='Grid view'
              >
                <Grid className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {viewMode === 'table' ? (
            <ProjectsTable data={projects} search={search} navigate={navigate} />
          ) : (
            <ProjectsCardGrid
              projects={projects}
              onViewProject={(projectId) => {
                navigate({ to: '/projects/$projectId', params: { projectId } })
              }}
              onEditProject={(projectId) => {
                // Open edit dialog
                navigate({ to: '/projects/$projectId', params: { projectId } })
              }}
              onDeleteProject={(projectId) => {
                // Open delete dialog
                console.log('Delete:', projectId)
              }}
            />
          )}
        </div>
      </Main>

      <ProjectsDialogs />
    </ProjectsProvider>
  )
}
