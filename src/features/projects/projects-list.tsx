import { useState, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProjectsDialogs } from './components/projects-dialogs'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { ProjectsProvider } from './components/projects-provider'
import { ProjectsTable } from './components/projects-table'
import { ProjectApi, type ProjectApiResponse } from './api/project-api'
import { Loader2, Maximize2, Minimize2 } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

const route = getRouteApi('/_authenticated/projects/')

export function Projects() {
  const { t } = useTranslation()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [projects, setProjects] = useState<ProjectApiResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await ProjectApi.getMyProjects({ limit: 10 })
        setProjects(response.items || [])
      } catch (_error) {
        // Failed to fetch projects, use empty array
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <ProjectsProvider>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsFullWidth(!isFullWidth)}
                    className="h-8 w-8 p-0 hidden md:flex"
                  >
                    {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullWidth ? t('common.collapseTable') : t('common.expandTable')}</p>
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
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Main>
      </ProjectsProvider>
    )
  }

  return (
    <ProjectsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsFullWidth(!isFullWidth)}
                  className="h-8 w-8 p-0 hidden md:flex"
                >
                  {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
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
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t('projects.title')}</h2>
            <p className='text-muted-foreground'>
              {t('projects.description')} ({projects.length} {t('common.total')})
            </p>
          </div>
          <ProjectsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ProjectsTable data={projects} search={search} navigate={navigate} />
        </div>
      </Main>

      <ProjectsDialogs />
    </ProjectsProvider>
  )
}