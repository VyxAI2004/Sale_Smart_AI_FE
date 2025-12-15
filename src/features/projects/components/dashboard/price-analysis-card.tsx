import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Lightbulb,
  DollarSign
} from 'lucide-react'
import type { PriceAnalysis } from '../../types/project-detail.types'

interface PriceAnalysisCardProps {
  analysis: PriceAnalysis | null
  isLoading?: boolean
  onViewDetails?: () => void
}

export function PriceAnalysisCard({ 
  analysis, 
  isLoading = false,
  onViewDetails 
}: PriceAnalysisCardProps) {
  const formatPrice = (price: number, currency = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return 'High'
    if (score >= 0.6) return 'Medium'
    return 'Low'
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Price Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Price Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="font-medium text-sm mb-1">No analysis available</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Collect product data to generate price insights
            </p>
            <Button size="sm" variant="outline">
              Start Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const confidencePercent = Math.round(analysis.confidence_score * 100)
  const priceRange = analysis.max_price - analysis.min_price
  const avgPosition = analysis.avg_market_price 
    ? ((analysis.avg_market_price - analysis.min_price) / priceRange) * 100 
    : 50

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Price Analysis
          <Badge 
            variant="secondary" 
            className={`ml-auto ${getConfidenceColor(analysis.confidence_score)}`}
          >
            {getConfidenceLevel(analysis.confidence_score)} Confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Recommended</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(analysis.recommended_price)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Market Avg</span>
            </div>
            <div className="text-xl font-bold">
              {formatPrice(analysis.avg_market_price)}
            </div>
          </div>
        </div>

        {/* Price Range Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Price Range</span>
            <span className="text-muted-foreground">
              {formatPrice(analysis.min_price)} - {formatPrice(analysis.max_price)}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${avgPosition}%` }}
              />
            </div>
            <div 
              className="absolute top-0 h-2 w-1 bg-blue-600 rounded-full"
              style={{ left: `${((analysis.recommended_price - analysis.min_price) / priceRange) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {formatPrice(analysis.min_price)}</span>
            <span>Max: {formatPrice(analysis.max_price)}</span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Analysis Confidence</span>
            <span className={`text-sm font-semibold ${getConfidenceColor(analysis.confidence_score)}`}>
              {confidencePercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        {/* Insights */}
        {analysis.insights && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Key Insights</span>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {analysis.insights}
              </p>
            </div>
          </div>
        )}

        {/* Price by Brand Preview */}
        {analysis.price_by_brand && Object.keys(analysis.price_by_brand).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Top Brands</span>
            </div>
            <div className="space-y-1">
              {Object.entries(analysis.price_by_brand)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([brand, price]) => (
                <div key={brand} className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate">{brand}</span>
                  <span className="font-medium">{formatPrice(price as number)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t">
          {onViewDetails && (
            <Button variant="ghost" size="sm" className="w-full" onClick={onViewDetails}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Analysis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}