import { Link } from '@tanstack/react-router'
import { useProjectContext } from '@/contexts/project-context'
import {
  AlertCircle,
  RefreshCw,
  Package,
  ShoppingCart,
  ListTodo,
  MessageSquare,
  TrendingUp,
  Shield,
  BarChart3,
  Settings,
} from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ExportButton } from './components/export-button'
import { ProductsPlatformChart } from './components/products-platform-chart'
import { ProjectStatusButton } from './components/project-status-button'
import { ProjectsChart } from './components/projects-chart'
import { RecentActivity } from './components/recent-activity'
import { ReviewsSentimentChart } from './components/reviews-sentiment-chart'
import { StatsCard } from './components/stats-card'
import { TasksChart } from './components/tasks-chart'
import { TimeSeriesChart } from './components/time-series-chart'
import { TrustScoreChart } from './components/trust-score-chart'
import { useDashboard } from './hooks/use-dashboard'

export function Dashboard() {
  const { t } = useTranslation()
  const { dashboard: dashboardData, isLoading, isError, error, refetch } =
    useDashboard()
  const { activeProject, setActiveProject } = useProjectContext()

  const handleStatusChange = (updatedProject: any) => {
    // Update active project with new status
    setActiveProject(updatedProject)
    // Refetch dashboard data to reflect changes
    refetch()
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='flex items-center space-x-4'>
          {activeProject && (
            <>
              <ProjectStatusButton
                project={activeProject}
                onStatusChange={handleStatusChange}
              />
              <Button variant='outline' size='sm' asChild>
                <Link
                  to='/projects/$projectId'
                  params={{ projectId: activeProject.id }}
                >
                  <Settings className='mr-2 h-4 w-4' />
                  {t('dashboard.projectSettings')}
                </Link>
              </Button>
            </>
          )}
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <LanguageSwitcher />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {t('dashboard.title')}
            </h1>
            <p className='text-muted-foreground'>
              {t('dashboard.description')}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              {t('dashboard.refresh')}
            </Button>
            <ExportButton dashboard={dashboardData} disabled={isLoading} />
          </div>
        </div>

        {isError && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : t('dashboard.errorLoading')}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>
              {t('dashboard.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value='analytics'>
              {t('dashboard.tabs.analytics')}
            </TabsTrigger>
            <TabsTrigger value='projects'>
              {t('dashboard.tabs.projects')}
            </TabsTrigger>
            <TabsTrigger value='products'>
              {t('dashboard.tabs.products')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-4'>
            {/* Stats Cards */}
            {isLoading ? (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className='h-4 w-24' />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className='mb-2 h-8 w-32' />
                      <Skeleton className='h-3 w-40' />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : dashboardData ? (
              <>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatsCard
                    title={t('dashboard.stats.totalProjects')}
                    value={dashboardData.stats.projects.total}
                    description={`${dashboardData.stats.projects.active} ${t('dashboard.stats.active')}, ${dashboardData.stats.projects.completed} ${t('dashboard.stats.completed')}`}
                    icon={Package}
                  />
                  <StatsCard
                    title={t('dashboard.stats.totalProducts')}
                    value={dashboardData.stats.products.total}
                    description={`${dashboardData.stats.products.analyzed} ${t('dashboard.stats.analyzed')}, ${dashboardData.stats.products.withReviews} ${t('dashboard.stats.withReviews')}`}
                    icon={ShoppingCart}
                  />
                  <StatsCard
                    title={t('dashboard.stats.totalTasks')}
                    value={dashboardData.stats.tasks.total}
                    description={`${dashboardData.stats.tasks.completed} ${t('dashboard.stats.completed')}, ${dashboardData.stats.tasks.pending} ${t('dashboard.stats.pending')}`}
                    icon={ListTodo}
                  />
                  <StatsCard
                    title={t('dashboard.stats.totalReviews')}
                    value={dashboardData.stats.reviews.total.toLocaleString()}
                    description={`${dashboardData.stats.reviews.analyzed} ${t('dashboard.stats.analyzed')}, ${dashboardData.stats.reviews.spam} spam`}
                    icon={MessageSquare}
                  />
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatsCard
                    title={t('dashboard.stats.activeProjects')}
                    value={dashboardData.stats.projects.active}
                    description={`${((dashboardData.stats.projects.active / dashboardData.stats.projects.total) * 100 || 0).toFixed(1)}% ${t('dashboard.stats.ofTotal')}`}
                    icon={TrendingUp}
                  />
                  <StatsCard
                    title={t('dashboard.stats.avgTrustScore')}
                    value={`${(dashboardData.stats.products.averageTrustScore * 100).toFixed(1)}%`}
                    description={`${t('dashboard.stats.high')}: ${dashboardData.stats.trustScores.high}, ${t('dashboard.stats.medium')}: ${dashboardData.stats.trustScores.medium}, ${t('dashboard.stats.low')}: ${dashboardData.stats.trustScores.low}`}
                    icon={Shield}
                  />
                  <StatsCard
                    title={t('dashboard.stats.completedTasks')}
                    value={dashboardData.stats.tasks.completed}
                    description={`${((dashboardData.stats.tasks.completed / dashboardData.stats.tasks.total) * 100 || 0).toFixed(1)}% ${t('dashboard.stats.completionRate')}`}
                    icon={BarChart3}
                  />
                  <StatsCard
                    title={t('dashboard.stats.avgRating')}
                    value={dashboardData.stats.reviews.averageRating.toFixed(1)}
                    description={`${t('dashboard.stats.positive')}: ${dashboardData.stats.reviews.positive}, ${t('dashboard.stats.negative')}: ${dashboardData.stats.reviews.negative}`}
                    icon={TrendingUp}
                  />
                </div>

                {/* Time Series Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.charts.trendsOverTime')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.charts.trendsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TimeSeriesChart data={dashboardData.charts.timeSeries} />
                  </CardContent>
                </Card>

                {/* Charts Grid */}
                <div className='grid gap-4 md:grid-cols-2'>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t('dashboard.charts.projectsByStatus')}
                      </CardTitle>
                      <CardDescription>
                        {t('dashboard.charts.projectsByStatusDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProjectsChart
                        data={dashboardData.charts.projectsByStatus}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t('dashboard.charts.tasksByStatus')}
                      </CardTitle>
                      <CardDescription>
                        {t('dashboard.charts.tasksByStatusDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TasksChart data={dashboardData.charts.tasksByStatus} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t('dashboard.charts.reviewsBySentiment')}
                      </CardTitle>
                      <CardDescription>
                        {t('dashboard.charts.reviewsBySentimentDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ReviewsSentimentChart
                        data={dashboardData.charts.reviewsBySentiment}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t('dashboard.charts.productsByPlatform')}
                      </CardTitle>
                      <CardDescription>
                        {t('dashboard.charts.productsByPlatformDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProductsPlatformChart
                        data={dashboardData.charts.productsByPlatform}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Trust Score Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.charts.trustScoreDistribution')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.charts.trustScoreDistributionDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrustScoreChart
                      data={dashboardData.charts.trustScoreDistribution}
                    />
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <RecentActivity activities={dashboardData.charts.recentActivity} />
              </>
            ) : null}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value='analytics' className='space-y-4'>
            {isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-64 w-full' />
                <Skeleton className='h-64 w-full' />
              </div>
            ) : dashboardData ? (
              <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.analytics.projectsAnalytics')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.analytics.projectsAnalyticsDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.totalProjects')}
                        </p>
                        <p className='text-2xl font-bold'>
                          {dashboardData.stats.projects.total}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.active')}
                        </p>
                        <p className='text-2xl font-bold text-green-600'>
                          {dashboardData.stats.projects.active}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.completed')}
                        </p>
                        <p className='text-2xl font-bold text-blue-600'>
                          {dashboardData.stats.projects.completed}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.pending')}
                        </p>
                        <p className='text-2xl font-bold text-yellow-600'>
                          {dashboardData.stats.projects.pending}
                        </p>
                      </div>
                    </div>
                    <ProjectsChart data={dashboardData.charts.projectsByStatus} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.analytics.productsAnalytics')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.analytics.productsAnalyticsDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.totalProducts')}
                        </p>
                        <p className='text-2xl font-bold'>
                          {dashboardData.stats.products.total}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.analyzed')}
                        </p>
                        <p className='text-2xl font-bold text-green-600'>
                          {dashboardData.stats.products.analyzed}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.withReviews')}
                        </p>
                        <p className='text-2xl font-bold text-blue-600'>
                          {dashboardData.stats.products.withReviews}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.avgTrustScore')}
                        </p>
                        <p className='text-2xl font-bold text-purple-600'>
                          {(
                            dashboardData.stats.products.averageTrustScore * 100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                    <ProductsPlatformChart
                      data={dashboardData.charts.productsByPlatform}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.analytics.tasksAnalytics')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.analytics.tasksAnalyticsDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.totalTasks')}
                        </p>
                        <p className='text-2xl font-bold'>
                          {dashboardData.stats.tasks.total}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.completed')}
                        </p>
                        <p className='text-2xl font-bold text-green-600'>
                          {dashboardData.stats.tasks.completed}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.inProgress')}
                        </p>
                        <p className='text-2xl font-bold text-blue-600'>
                          {dashboardData.stats.tasks.inProgress}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.overdue')}
                        </p>
                        <p className='text-2xl font-bold text-red-600'>
                          {dashboardData.stats.tasks.overdue}
                        </p>
                      </div>
                    </div>
                    <TasksChart data={dashboardData.charts.tasksByStatus} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.analytics.reviewsAnalytics')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.analytics.reviewsAnalyticsDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.totalReviews')}
                        </p>
                        <p className='text-2xl font-bold'>
                          {dashboardData.stats.reviews.total.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.analyzed')}
                        </p>
                        <p className='text-2xl font-bold text-green-600'>
                          {dashboardData.stats.reviews.analyzed.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.positive')}
                        </p>
                        <p className='text-2xl font-bold text-green-600'>
                          {dashboardData.stats.reviews.positive.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-sm'>
                          {t('dashboard.stats.negative')}
                        </p>
                        <p className='text-2xl font-bold text-red-600'>
                          {dashboardData.stats.reviews.negative.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <ReviewsSentimentChart
                      data={dashboardData.charts.reviewsBySentiment}
                    />
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value='projects' className='space-y-4'>
            {isLoading ? (
              <Skeleton className='h-64 w-full' />
            ) : dashboardData ? (
              <div className='grid gap-4'>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.charts.projectsByStatus')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.charts.projectsByStatusDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectsChart data={dashboardData.charts.projectsByStatus} />
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value='products' className='space-y-4'>
            {isLoading ? (
              <Skeleton className='h-64 w-full' />
            ) : dashboardData ? (
              <div className='grid gap-4'>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('dashboard.charts.productsByPlatform')}
                    </CardTitle>
                    <CardDescription>
                      {t('dashboard.charts.productsByPlatformDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <ProductsPlatformChart
                        data={dashboardData.charts.productsByPlatform}
                      />
                      <TrustScoreChart
                        data={dashboardData.charts.trustScoreDistribution}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
