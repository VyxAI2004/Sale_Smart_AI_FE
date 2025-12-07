import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

// Import tab components
import { PriceAnalysisCard } from './price-analysis-card'
import { ProductSourcesCard } from './product-sources-card'
import { CompetitorProductsCard } from './competitor-products-card'
import { ProjectDetailsCard } from './project-details-card'
import { TeamManagementCard } from './team-management-card'
import { AnalyticsCard } from './analytics-card'

// Import new product components
import { ProductsList, CrawlerInterface, ReviewsList, TrustScoreCard } from '@/features/products'

import type { ProjectDetailData } from '../../types/project-detail.types'

interface ProjectDetailTabsProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  onProjectUpdate?: (updates: Partial<ProjectDetailData>) => void
}

export function ProjectDetailTabs({
  project,
  isLoading = false,
  onProjectUpdate
}: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
  <div className="w-full space-y-6">
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-none lg:flex flex-wrap">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="products" className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Products</span>
        </TabsTrigger>
        <TabsTrigger value="crawler" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Crawler</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Reviews</span>
        </TabsTrigger>
        <TabsTrigger value="trust-score" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Trust Score</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="sources" className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">Sources</span>
        </TabsTrigger>
        <TabsTrigger value="team" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Team</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <FolderCog2Icon className="w-4 h-4" />
          <span className="hidden sm:inline">Project</span>
        </TabsTrigger>
      </TabsList>
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="space-y-6">
            {/* KPI Cards Grid - Simplified */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Total Products</span>
                </div>
                <p className="text-2xl font-bold">{project?.analytics?.total_products || 0}</p>
                <p className="text-sm text-muted-foreground">Products tracked</p>
              </div>
              
              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Analyzed</span>
                </div>
                <p className="text-2xl font-bold">{project?.analytics?.analyzed_products || 0}</p>
                <p className="text-sm text-muted-foreground">Analysis complete</p>
              </div>
              
              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Confidence</span>
                </div>
                <p className="text-2xl font-bold">{project?.analytics?.confidence_score || 0}%</p>
                <p className="text-sm text-muted-foreground">Analysis accuracy</p>
              </div>
              
              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Market Position</span>
                </div>
                <p className="text-2xl font-bold">{project?.analytics?.market_position || 0}%</p>
                <p className="text-sm text-muted-foreground">Market strength</p>
              </div>
            </div>

            {/* Equal height cards layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Price Analysis</h3>
                <div className="h-[400px]">
                  <PriceAnalysisCard 
                    analysis={project?.price_analysis || null} 
                    isLoading={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Sources</h3>
                <div className="h-[400px]">
                  <ProductSourcesCard 
                    sources={project?.product_sources || []} 
                    isLoading={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Competitor Products</h3>
                <div className="h-[400px]">
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
        <TabsContent value="team" className="mt-6">
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
        <TabsContent value="sources" className="mt-6">
          <ProductSourcesCard 
            sources={project?.product_sources || []} 
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6 mt-6">
          {project?.id ? (
            <ProductsList 
              projectId={project.id}
              onViewProduct={(productId) => {
                // Navigate to product detail if needed
                console.log('View product:', productId)
              }}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {isLoading ? 'Loading project...' : 'Project ID not available'}
            </div>
          )}
        </TabsContent>

        {/* Crawler Tab */}
        <TabsContent value="crawler" className="mt-6">
          {project?.id && (
            <CrawlerInterface 
              projectId={project.id}
              onCrawlComplete={() => {
                // Refresh data after crawl
                console.log('Crawl completed')
              }}
          />
          )}
        </TabsContent>

        {/* Reviews Tab - Note: This shows reviews for a selected product */}
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a product from the Products tab to view its reviews and analysis.
            </p>
            {/* TODO: Add product selector or integrate with product detail view */}
          </div>
        </TabsContent>

        {/* Trust Score Tab - Note: This shows trust score for a selected product */}
        <TabsContent value="trust-score" className="mt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a product from the Products tab to view its trust score.
            </p>
            {/* TODO: Add product selector or integrate with product detail view */}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
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
        <TabsContent value="settings" className="mt-6">
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