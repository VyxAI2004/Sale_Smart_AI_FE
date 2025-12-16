import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Maximize2, Minimize2, Loader2 } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

// Dashboard Components
import { ProjectHeader } from './components/dashboard/project-header'
import { ProjectDetailTabs } from './components/dashboard/project-detail-tabs'

// API & Types
import { ProjectDetailApi } from './api/project-detail-api'
import type { ProjectDetailData } from './types/project-detail.types'

export function ProjectDetail() {
  const { t } = useTranslation()
  const { projectId } = useParams({ from: '/_authenticated/projects/$projectId' })
  const [project, setProject] = useState<ProjectDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false)
      setProject(null)
      return
    }

    let cancelled = false
    
    const fetchProjectDetail = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await ProjectDetailApi.getProjectDetail(projectId)
        
        if (!cancelled) {
          setProject(data)
          setIsLoading(false)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to load project detail:', err)
        if (!cancelled) {
          setError(t('projects.failedToLoadDetails'))
          setProject(null)
          setIsLoading(false)
        }
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn('Project detail fetch timeout')
        setIsLoading(false)
      }
    }, 30000) // 30 seconds timeout

    fetchProjectDetail()
    
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const handleProjectUpdate = async (updates: Partial<ProjectDetailData>) => {
    if (!projectId) return
    
    try {
      // Refresh data from API after update
      const data = await ProjectDetailApi.getProjectDetail(projectId)
      setProject(data)
    } catch (_err) {
      console.error('Failed to refresh project after update:', _err)
      // If refresh fails, update local state
      if (project) {
        setProject({ ...project, ...updates })
      }
    }
  }

  if (isLoading) {
    return (
      <div>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 hidden md:flex"
                    disabled
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('common.expandTable')}</p>
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
          <ProjectHeader project={null} isLoading={true} />
          
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <LanguageSwitcher />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className="flex items-center justify-center min-h-[400px] text-center">
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('projects.failedToLoad')}</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                {t('common.tryAgain')}
              </Button>
            </div>
          </div>
        </Main>
      </div>
    )
  }

  return (
    <div>
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
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fluid={isFullWidth}>
        <ProjectHeader 
          project={project} 
          onTriggerCrawl={() => setActiveTab('find-product')}
        />
        
        <ProjectDetailTabs 
          project={project}
          isLoading={false}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onProjectUpdate={handleProjectUpdate}
        />
      </Main>
    </div>
  )
}