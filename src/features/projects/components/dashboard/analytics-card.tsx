import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Download
} from 'lucide-react'
import type { ProjectDetailData } from '../../types/project-detail.types'

// Simple Progress component
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`bg-muted rounded-full ${className}`}>
    <div
      className="bg-primary rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

interface AnalyticsCardProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  onRefreshAnalytics?: () => void
  onExportReport?: () => void
}

export function AnalyticsCard({ 
  project, 
  isLoading = false,
  onRefreshAnalytics,
  onExportReport
}: AnalyticsCardProps) {
  const formatCurrency = (amount: number | null, currency = 'VND') => {
    if (!amount) return '--'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getTrendIcon = (trend: string) => {
    if (trend.includes('up') || trend.includes('increase') || trend.includes('growth')) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />
    }
    if (trend.includes('down') || trend.includes('decrease') || trend.includes('decline')) {
      return <ArrowDownRight className="w-4 h-4 text-red-500" />
    }
    return <Minus className="w-4 h-4 text-yellow-500" />
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMarketPositionLabel = (position: number) => {
    if (position >= 80) return { label: 'Leader', color: 'bg-green-100 text-green-800' }
    if (position >= 60) return { label: 'Strong', color: 'bg-blue-100 text-blue-800' }
    if (position >= 40) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Weak', color: 'bg-red-100 text-red-800' }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Analytics Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No project data available</p>
      </div>
    )
  }

  const analytics = project.analytics || {
    total_products: 0,
    analyzed_products: 0,
    confidence_score: 0,
    recommended_price: 0,
    market_position: 0,
    trends: {
      products_growth: 'No data',
      price_trend: 'No data'
    }
  }

  const analysisProgress = analytics.total_products > 0 
    ? (analytics.analyzed_products / analytics.total_products) * 100 
    : 0

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefreshAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Products */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Total Products</span>
              </div>
              <p className="text-2xl font-bold">{analytics.total_products}</p>
              <p className="text-xs text-muted-foreground">Products tracked</p>
            </div>

            {/* Analyzed Products */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Analyzed</span>
              </div>
              <p className="text-2xl font-bold">{analytics.analyzed_products}</p>
              <div className="flex items-center gap-2">
                <Progress value={analysisProgress} className="h-1" />
                <span className="text-xs text-muted-foreground">{analysisProgress.toFixed(0)}%</span>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-muted-foreground">Confidence</span>
              </div>
              <p className={`text-2xl font-bold ${getConfidenceColor(analytics.confidence_score)}`}>
                {analytics.confidence_score}%
              </p>
              <p className="text-xs text-muted-foreground">Analysis accuracy</p>
            </div>

            {/* Recommended Price */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-muted-foreground">Recommended Price</span>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(analytics.recommended_price, project.currency)}
              </p>
              <p className="text-xs text-muted-foreground">AI suggested</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Position & Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Market Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Market Position */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Market Position</span>
                <Badge className={getMarketPositionLabel(analytics.market_position).color}>
                  {getMarketPositionLabel(analytics.market_position).label}
                </Badge>
              </div>
              <Progress value={analytics.market_position} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.market_position}% market strength
              </p>
            </div>

            {/* Analysis Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Analysis Progress</span>
                <span className="text-sm text-muted-foreground">
                  {analytics.analyzed_products} / {analytics.total_products}
                </span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {analysisProgress.toFixed(1)}% completed
              </p>
            </div>

            {/* Confidence Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Confidence Level</span>
                <span className={`text-sm font-medium ${getConfidenceColor(analytics.confidence_score)}`}>
                  {analytics.confidence_score}%
                </span>
              </div>
              <Progress 
                value={analytics.confidence_score} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.confidence_score >= 80 ? 'High confidence' : 
                 analytics.confidence_score >= 60 ? 'Medium confidence' : 'Low confidence'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Market Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Products Growth Trend */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTrendIcon(analytics.trends.products_growth)}
                <div>
                  <p className="font-medium text-sm">Products Growth</p>
                  <p className="text-xs text-muted-foreground">Market expansion</p>
                </div>
              </div>
              <Badge variant="outline">{analytics.trends.products_growth}</Badge>
            </div>

            {/* Price Trend */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTrendIcon(analytics.trends.price_trend)}
                <div>
                  <p className="font-medium text-sm">Price Trend</p>
                  <p className="text-xs text-muted-foreground">Market pricing</p>
                </div>
              </div>
              <Badge variant="outline">{analytics.trends.price_trend}</Badge>
            </div>

            {/* Recommended Action */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">AI Recommendation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Based on current market analysis and trends, we recommend:
              </p>
              <div className="space-y-2">
                {analytics.confidence_score >= 70 ? (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Proceed with current pricing strategy
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    Consider gathering more market data
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Monitor competitor pricing changes
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Review analysis weekly for updates
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}