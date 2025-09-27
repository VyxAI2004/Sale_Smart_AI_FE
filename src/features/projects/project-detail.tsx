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
import { 
  ProductCountCard, 
  ConfidenceScoreCard, 
  RecommendedPriceCard, 
  MarketPositionCard 
} from './components/dashboard/kpi-card'
import { ProductSourcesCard } from './components/dashboard/product-sources-card'
import { CompetitorProductsCard } from './components/dashboard/competitor-products-card'
import { PriceAnalysisCard } from './components/dashboard/price-analysis-card'

// API & Types
import { ProjectDetailApi } from './api/project-detail-api'
import type { ProjectDetailData } from './types/project-detail.types'

export function ProjectDetail() {
  const { projectId } = useParams({ from: '/_authenticated/projects/$projectId' })
  const [project, setProject] = useState<ProjectDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          onTriggerCrawl={handleTriggerCrawl}
        />
        
        <div className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProductCountCard 
              value={project?.analytics?.total_products || null}
              trend={project?.analytics?.trends.products_growth}
              isLoading={isLoading}
            />
            <ConfidenceScoreCard 
              value={project?.price_analysis?.confidence_score ? project.price_analysis.confidence_score * 100 : null}
              isLoading={isLoading}
            />
            <RecommendedPriceCard 
              value={project?.price_analysis?.recommended_price || null}
              currency={project?.currency}
              isLoading={isLoading}
            />
            <MarketPositionCard 
              value={project?.analytics?.market_position || null}
              isLoading={isLoading}
            />
          </div>

          {/* Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Price Analysis - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PriceAnalysisCard 
                analysis={project?.price_analysis || null}
                isLoading={isLoading}
              />
            </div>

            {/* Product Sources */}
            <div>
              <ProductSourcesCard 
                sources={project?.product_sources || null}
                isLoading={isLoading}
                onTriggerCrawl={handleTriggerCrawl}
              />
            </div>
          </div>

          {/* Competitor Products Row */}
          <div className="grid grid-cols-1 gap-6">
            <CompetitorProductsCard 
              products={project?.competitor_products || null}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Main>
    </div>
  )
}