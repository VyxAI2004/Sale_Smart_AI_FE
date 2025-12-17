import { Link } from '@tanstack/react-router'
import { useProjectContext } from '@/contexts/project-context'
import { AlertCircle, RefreshCw, Settings } from 'lucide-react'
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
import { LanguageSwitcher } from '@/components/language-switcher'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ExportButton } from '@/features/dashboard/components/export-button'
import { ProductsPlatformChart } from '@/features/dashboard/components/products-platform-chart'
import { ProjectsChart } from '@/features/dashboard/components/projects-chart'
import { ReviewsSentimentChart } from '@/features/dashboard/components/reviews-sentiment-chart'
import { TasksChart } from '@/features/dashboard/components/tasks-chart'
import { TimeSeriesChart } from '@/features/dashboard/components/time-series-chart'
import { TrustScoreChart } from '@/features/dashboard/components/trust-score-chart'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'

export function AnalyticsPage() {
  const { t } = useTranslation()
  const { dashboard, isLoading, isError, error, refetch } = useDashboard()
  const { activeProject } = useProjectContext()

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='flex items-center space-x-4'>
          {activeProject && (
            <Button variant='outline' size='sm' asChild>
              <Link
                to='/projects/$projectId'
                params={{ projectId: activeProject.id }}
              >
                <Settings className='mr-2 h-4 w-4' />
                {t('dashboard.projectSettings')}
              </Link>
            </Button>
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
              {t('dashboard.tabs.analytics')}
            </h1>
            <p className='text-muted-foreground'>
              {t('dashboard.analytics.projectsAnalyticsDesc')}
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
            <ExportButton dashboard={dashboard} disabled={isLoading} />
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

        {isLoading ? (
          <div className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className='h-6 w-48' />
                    <Skeleton className='h-4 w-64' />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className='h-64 w-full' />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : dashboard ? (
          <div className='space-y-6'>
            {/* Time Series Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.charts.trendsOverTime')}</CardTitle>
                <CardDescription>
                  {t('dashboard.charts.trendsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart data={dashboard.charts.timeSeries} />
              </CardContent>
            </Card>

            {/* Analytics Grid */}
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
                        {dashboard.stats.projects.total}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.active')}
                      </p>
                      <p className='text-2xl font-bold text-green-600'>
                        {dashboard.stats.projects.active}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.completed')}
                      </p>
                      <p className='text-2xl font-bold text-blue-600'>
                        {dashboard.stats.projects.completed}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.pending')}
                      </p>
                      <p className='text-2xl font-bold text-yellow-600'>
                        {dashboard.stats.projects.pending}
                      </p>
                    </div>
                  </div>
                  <ProjectsChart data={dashboard.charts.projectsByStatus} />
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
                        {dashboard.stats.products.total}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.analyzed')}
                      </p>
                      <p className='text-2xl font-bold text-green-600'>
                        {dashboard.stats.products.analyzed}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.withReviews')}
                      </p>
                      <p className='text-2xl font-bold text-blue-600'>
                        {dashboard.stats.products.withReviews}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.avgTrustScore')}
                      </p>
                      <p className='text-2xl font-bold text-purple-600'>
                        {(
                          dashboard.stats.products.averageTrustScore * 100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                  <ProductsPlatformChart
                    data={dashboard.charts.productsByPlatform}
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
                        {dashboard.stats.tasks.total}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.completed')}
                      </p>
                      <p className='text-2xl font-bold text-green-600'>
                        {dashboard.stats.tasks.completed}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.inProgress')}
                      </p>
                      <p className='text-2xl font-bold text-blue-600'>
                        {dashboard.stats.tasks.inProgress}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.overdue')}
                      </p>
                      <p className='text-2xl font-bold text-red-600'>
                        {dashboard.stats.tasks.overdue}
                      </p>
                    </div>
                  </div>
                  <TasksChart data={dashboard.charts.tasksByStatus} />
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
                        {dashboard.stats.reviews.total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.analyzed')}
                      </p>
                      <p className='text-2xl font-bold text-green-600'>
                        {dashboard.stats.reviews.analyzed.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.positive')}
                      </p>
                      <p className='text-2xl font-bold text-green-600'>
                        {dashboard.stats.reviews.positive.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        {t('dashboard.stats.negative')}
                      </p>
                      <p className='text-2xl font-bold text-red-600'>
                        {dashboard.stats.reviews.negative.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <ReviewsSentimentChart
                    data={dashboard.charts.reviewsBySentiment}
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
                  data={dashboard.charts.trustScoreDistribution}
                />
              </CardContent>
            </Card>
          </div>
        ) : null}
      </Main>
    </>
  )
}
