import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Brain,
  RefreshCw,
  Sparkles,
  Target,
  Lightbulb,
  Shield,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductAnalyticsApi } from '../api/analytics.api'
import type { ProductAnalyticsResponse } from '../types/analytics.types'

interface ProductAnalyticsProps {
  productId: string
}

export function ProductAnalytics({ productId }: ProductAnalyticsProps) {
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useQuery<ProductAnalyticsResponse>({
    queryKey: ['product-analytics', productId],
    queryFn: () => ProductAnalyticsApi.getByProduct(productId),
    retry: 1,
  })

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return <CheckCircle2 className='h-4 w-4' />
      case 'medium':
        return <AlertTriangle className='h-4 w-4' />
      case 'high':
        return <AlertCircle className='h-4 w-4' />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-[200px]' />
            <Skeleton className='mt-2 h-4 w-[300px]' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-32 w-full' />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Brain className='h-5 w-5' />
            Phân tích Sản phẩm
          </CardTitle>
          <CardDescription>
            Phân tích AI dựa trên đánh giá và độ tin cậy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='py-8 text-center'>
            <AlertCircle className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground mb-4 text-sm'>
              {error instanceof Error
                ? error.message
                : 'Không thể tải phân tích. Vui lòng đảm bảo độ tin cậy đã được tính toán.'}
            </p>
            <Button onClick={() => refetch()} variant='outline'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return null
  }

  const { analysis, metadata } = analytics

  return (
    <div className='space-y-6'>
      {/* Header with Summary */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Summary - Takes 2 columns on large screens */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <Brain className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                  <CardTitle className='text-xl'>Phân tích Sản phẩm</CardTitle>
                  <CardDescription className='mt-1 text-sm'>
                    Phân tích bằng AI • {metadata.model_used} •{' '}
                    {metadata.total_reviews_analyzed} đánh giá
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={() => refetch()}
                variant='outline'
                size='sm'
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-foreground text-base leading-relaxed'>
              {analysis.summary}
            </p>
          </CardContent>
        </Card>

        {/* Risk Assessment - Compact */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Shield className='h-5 w-5 text-purple-600' />
              <CardTitle className='text-lg'>Mức độ Rủi ro</CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-3'>
              <Badge
                className={`${getRiskColor(analysis.risk_assessment.overall_risk)} justify-center px-4 py-2 text-base`}
              >
                <span className='flex items-center gap-2'>
                  {getRiskIcon(analysis.risk_assessment.overall_risk)}
                  {analysis.risk_assessment.overall_risk === 'low'
                    ? 'THẤP'
                    : analysis.risk_assessment.overall_risk === 'medium'
                      ? 'TRUNG BÌNH'
                      : analysis.risk_assessment.overall_risk === 'high'
                        ? 'CAO'
                        : analysis.risk_assessment.overall_risk.toUpperCase()}
                </span>
              </Badge>
              <p className='text-muted-foreground text-center text-sm'>
                {analysis.risk_assessment.confidence_level}
              </p>
            </div>
            {analysis.risk_assessment.risk_factors.length > 0 && (
              <div className='border-t pt-3'>
                <p className='text-muted-foreground mb-2 text-xs font-medium'>
                  Yếu tố Rủi ro:
                </p>
                <ul className='space-y-1.5'>
                  {analysis.risk_assessment.risk_factors
                    .slice(0, 3)
                    .map((factor, idx) => (
                      <li
                        key={idx}
                        className='text-muted-foreground flex items-start gap-1.5 text-xs'
                      >
                        <AlertTriangle className='mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-600' />
                        <span className='line-clamp-2'>{factor}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trust Score Analysis & Review Insights - Side by Side */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Trust Score Analysis */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Target className='h-5 w-5 text-blue-600' />
              <CardTitle className='text-lg'>Phân tích Độ tin cậy</CardTitle>
            </div>
            <CardDescription>Giải thích chi tiết</CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='rounded-lg border border-blue-100 bg-blue-50 p-4'>
              <p className='mb-1 text-sm font-medium text-blue-900'>
                Giải thích
              </p>
              <p className='text-sm leading-relaxed text-blue-800'>
                {analysis.trust_score_analysis.interpretation}
              </p>
            </div>

            {analysis.trust_score_analysis.strengths.length > 0 && (
              <div>
                <div className='mb-3 flex items-center gap-2'>
                  <TrendingUp className='h-4 w-4 text-green-600' />
                  <h4 className='text-sm font-semibold'>Điểm mạnh</h4>
                </div>
                <ul className='space-y-2'>
                  {analysis.trust_score_analysis.strengths.map(
                    (strength, idx) => (
                      <li
                        key={idx}
                        className='text-foreground flex items-start gap-2.5 rounded-md bg-green-50 p-2.5 text-sm'
                      >
                        <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                        <span className='leading-relaxed'>{strength}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {analysis.trust_score_analysis.weaknesses.length > 0 && (
              <div>
                <div className='mb-3 flex items-center gap-2'>
                  <TrendingDown className='h-4 w-4 text-red-600' />
                  <h4 className='text-sm font-semibold'>Cần cải thiện</h4>
                </div>
                <ul className='space-y-2'>
                  {analysis.trust_score_analysis.weaknesses.map(
                    (weakness, idx) => (
                      <li
                        key={idx}
                        className='text-foreground flex items-start gap-2.5 rounded-md bg-red-50 p-2.5 text-sm'
                      >
                        <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0 text-red-600' />
                        <span className='leading-relaxed'>{weakness}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Insights */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5 text-purple-600' />
              <CardTitle className='text-lg'>Thông tin từ Đánh giá</CardTitle>
            </div>
            <CardDescription>
              Các chủ đề chính từ đánh giá khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5 overflow-hidden'>
            <div className='rounded-lg border border-purple-100 bg-purple-50 p-4'>
              <p className='mb-1 text-sm font-medium text-purple-900'>
                Tổng quan Cảm xúc
              </p>
              <p className='text-sm leading-relaxed text-purple-800'>
                {analysis.review_insights.sentiment_overview}
              </p>
            </div>

            {analysis.review_insights.key_positive_themes.length > 0 && (
              <div className='min-w-0'>
                <h4 className='mb-3 text-sm font-semibold'>Chủ đề Tích cực</h4>
                <div className='flex min-w-0 flex-wrap gap-2'>
                  {analysis.review_insights.key_positive_themes.map(
                    (theme, idx) => (
                      <Badge
                        key={idx}
                        variant='default'
                        className='inline-block max-w-full border-green-200 bg-green-100 px-3 py-1.5 text-xs break-words whitespace-normal text-green-800 hover:bg-green-200'
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {theme}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {analysis.review_insights.key_negative_themes.length > 0 && (
              <div className='min-w-0'>
                <h4 className='mb-3 text-sm font-semibold'>Vấn đề & Lo ngại</h4>
                <div className='flex min-w-0 flex-wrap gap-2'>
                  {analysis.review_insights.key_negative_themes.map(
                    (theme, idx) => (
                      <Badge
                        key={idx}
                        variant='destructive'
                        className='inline-block max-w-full px-3 py-1.5 text-xs break-words whitespace-normal'
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {theme}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            <div className='border-t pt-3'>
              <h4 className='mb-2 text-sm font-semibold'>Đánh giá Spam</h4>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {analysis.review_insights.spam_concerns}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations - Full Width */}
      {analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Lightbulb className='h-5 w-5 text-amber-600' />
              <CardTitle className='text-lg'>Khuyến nghị</CardTitle>
            </div>
            <CardDescription>
              Những gợi ý cụ thể để cải thiện độ tin cậy sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {analysis.recommendations.map((recommendation, idx) => (
                <div
                  key={idx}
                  className='flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4 transition-colors hover:bg-amber-100'
                >
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white'>
                    {idx + 1}
                  </div>
                  <p className='text-foreground flex-1 text-sm leading-relaxed'>
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
