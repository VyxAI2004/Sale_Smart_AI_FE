import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Maximize2, Minimize2, Loader2 } from 'lucide-react'

// Dashboard Components
import { ProjectHeader } from './components/dashboard/project-header'
import { ProjectDetailTabs } from './components/dashboard/project-detail-tabs'

// API & Types
import { ProjectDetailApi } from './api/project-detail-api'
import type { ProjectDetailData } from './types/project-detail.types'

export function ProjectDetail() {
  const { projectId } = useParams({ from: '/_authenticated/projects/$projectId' })
  const [project, setProject] = useState<ProjectDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!projectId) return
      
      try {
        setIsLoading(true)
        setError(null)
        const data = await ProjectDetailApi.getProjectDetail(projectId)
        setProject(data)
      } catch (_err) {
        setError('Failed to load project details')
        // Handle error silently for production
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectDetail()
  }, [projectId])

  const handleTriggerCrawl = async () => {
    if (!projectId) return
    
    try {
      await ProjectDetailApi.triggerCrawl(projectId)
      // Refresh data after triggering crawl
      const data = await ProjectDetailApi.getProjectDetail(projectId)
      setProject(data)
    } catch (_err) {
      // Handle crawl trigger error silently
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
                  <p>Mở rộng bảng</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className="flex items-center justify-center min-h-[400px] text-center">
            <div>
              <h2 className="text-lg font-semibold mb-2">Failed to load project</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
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
                <p>{isFullWidth ? 'Thu nhỏ bảng' : 'Mở rộng bảng'}</p>
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
          isLoading={isLoading}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onProjectUpdate={(updates) => {
            if (project) {
              setProject({ ...project, ...updates })
            }
          }}
        />
      </Main>
    </div>
  )
}