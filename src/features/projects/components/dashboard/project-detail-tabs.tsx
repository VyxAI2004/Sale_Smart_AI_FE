import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Database,
  ShoppingCart,
  BarChart3,
  Target,
  Zap,
  Activity,
  TrendingUp,
  FolderCog2Icon,
  Search,
  MessageSquare,
  Shield,
} from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Import new product components
import {
  ProductsList,
  FindProductWorkflow,
  ReviewsList,
  TrustScoreCard,
} from '@/features/products'
import type { ProjectDetailData } from '../../types/project-detail.types'
import { AnalyticsCard } from './analytics-card'
import { CompetitorProductsCard } from './competitor-products-card'
// Import tab components
import { PriceAnalysisCard } from './price-analysis-card'
import { ProductSourcesCard } from './product-sources-card'
import { ProjectDetailsCard } from './project-details-card'
import { TeamManagementCard } from './team-management-card'

interface ProjectDetailTabsProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  activeTab?: string
  onTabChange?: (tab: string) => void
  onProjectUpdate?: (updates: Partial<ProjectDetailData>) => void
}

export function ProjectDetailTabs({
  project,
  isLoading = false,
  activeTab: externalActiveTab,
  onTabChange,
  onProjectUpdate,
}: ProjectDetailTabsProps) {
  const { t } = useTranslation()
  const [internalActiveTab, setInternalActiveTab] = useState('overview')
  const activeTab = externalActiveTab ?? internalActiveTab
  const setActiveTab = onTabChange ?? setInternalActiveTab

  return (
    <div className='w-full space-y-6'>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-6 flex-wrap lg:flex lg:w-fit lg:grid-cols-none'>
          <TabsTrigger value='overview' className='flex items-center gap-2'>
            <LayoutDashboard className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.overview')}</span>
          </TabsTrigger>
          <TabsTrigger value='products' className='flex items-center gap-2'>
            <ShoppingCart className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.products')}</span>
          </TabsTrigger>
          <TabsTrigger value='find-product' className='flex items-center gap-2'>
            <Search className='h-4 w-4' />
            <span className='hidden sm:inline'>
              {t('projects.findProduct')}
            </span>
          </TabsTrigger>
          <TabsTrigger value='reviews' className='flex items-center gap-2'>
            <MessageSquare className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.reviews')}</span>
          </TabsTrigger>
          <TabsTrigger value='trust-score' className='flex items-center gap-2'>
            <Shield className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.trustScore')}</span>
          </TabsTrigger>
          <TabsTrigger value='analytics' className='flex items-center gap-2'>
            <BarChart3 className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.analytics')}</span>
          </TabsTrigger>
          <TabsTrigger value='sources' className='flex items-center gap-2'>
            <Database className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.sources')}</span>
          </TabsTrigger>
          <TabsTrigger value='team' className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.team')}</span>
          </TabsTrigger>
          <TabsTrigger value='settings' className='flex items-center gap-2'>
            <FolderCog2Icon className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.project')}</span>
          </TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value='overview' className='mt-6 space-y-6'>
          <div className='space-y-6'>
            {/* KPI Cards Grid - Simplified */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <Target className='h-5 w-5 text-blue-500' />
                  <span className='font-medium'>
                    {t('projects.totalProducts')}
                  </span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.total_products || 0}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.productsTracked')}
                </p>
              </div>

              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-green-500' />
                  <span className='font-medium'>{t('projects.analyzed')}</span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.analyzed_products || 0}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.analysisComplete')}
                </p>
              </div>

              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <Activity className='h-5 w-5 text-purple-500' />
                  <span className='font-medium'>
                    {t('projects.confidence')}
                  </span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.confidence_score || 0}%
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.analysisAccuracy')}
                </p>
              </div>

              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5 text-orange-500' />
                  <span className='font-medium'>
                    {t('projects.marketPosition')}
                  </span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.market_position || 0}%
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.marketStrength')}
                </p>
              </div>
            </div>

            {/* Equal height cards layout */}
            <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  {t('projects.priceAnalysis')}
                </h3>
                <div className='h-[400px]'>
                  <PriceAnalysisCard
                    analysis={project?.price_analysis || null}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  {t('projects.productSources')}
                </h3>
                <div className='h-[400px]'>
                  <ProductSourcesCard
                    sources={project?.product_sources || []}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Competitor Products</h3>
                <div className='h-[400px]'>
                  <CompetitorProductsCard
                    products={project?.competitor_products || []}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value='team' className='mt-6'>
          <TeamManagementCard
            project={project}
            isLoading={isLoading}
            onAddMember={(_email, _role) => {
              // Handle add member logic
            }}
            onRemoveMember={(_memberId) => {
              // Handle remove member logic
            }}
            onAssignTask={(_taskId, _memberId) => {
              // Handle task assignment logic
            }}
          />
        </TabsContent>

        {/* Data Sources Tab */}
        <TabsContent value='sources' className='mt-6'>
          <ProductSourcesCard
            sources={project?.product_sources || []}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value='products' className='mt-6 space-y-6'>
          {project?.id ? (
            <ProductsList
              projectId={project.id}
              onViewProduct={(productId) => {
                // Navigate to product detail if needed
                console.log('View product:', productId)
              }}
            />
          ) : (
            <div className='text-muted-foreground py-8 text-center'>
              {isLoading ? 'Loading project...' : 'Project ID not available'}
            </div>
          )}
        </TabsContent>

        {/* Find Product Tab */}
        <TabsContent value='find-product' className='mt-6'>
          {project?.id ? (
            <FindProductWorkflow
              projectId={project.id}
              onComplete={() => {
                // Refresh data after workflow completes
                console.log('Workflow completed')
              }}
            />
          ) : (
            <div className='text-muted-foreground py-8 text-center'>
              {isLoading ? 'Loading project...' : 'Project ID not available'}
            </div>
          )}
        </TabsContent>

        {/* Reviews Tab - Note: This shows reviews for a selected product */}
        <TabsContent value='reviews' className='mt-6'>
          <div className='space-y-4'>
            <p className='text-muted-foreground text-sm'>
              Select a product from the Products tab to view its reviews and
              analysis.
            </p>
            {/* TODO: Add product selector or integrate with product detail view */}
          </div>
        </TabsContent>

        {/* Trust Score Tab - Note: This shows trust score for a selected product */}
        <TabsContent value='trust-score' className='mt-6'>
          <div className='space-y-4'>
            <p className='text-muted-foreground text-sm'>
              Select a product from the Products tab to view its trust score.
            </p>
            {/* TODO: Add product selector or integrate with product detail view */}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='mt-6'>
          <AnalyticsCard
            project={project}
            isLoading={isLoading}
            onRefreshAnalytics={() => {
              // Handle refresh analytics logic
            }}
            onExportReport={() => {
              // Handle export report logic
            }}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='settings' className='mt-6'>
          <ProjectDetailsCard
            project={project}
            isLoading={isLoading}
            onUpdate={(updates) => {
              // Handle project updates
              if (onProjectUpdate) {
                onProjectUpdate(updates)
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
