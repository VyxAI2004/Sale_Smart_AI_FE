import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Brain, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useProduct } from '../hooks/use-products'
import { useAnalysisStatistics } from '../hooks/use-review-analysis'
import { useCalculateTrustScore } from '../hooks/use-trust-score'
import { ReviewsList } from './reviews-list'
import { TrustScoreCard } from './trust-score-card'

export function AnalyzeReviewsPage() {
  const { productId } = useParams({
    from: '/_authenticated/products/$productId/analyze',
  })
  const navigate = useNavigate()
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProduct(productId)
  const calculateTrustScore = useCalculateTrustScore()
  const { data: analysisStats, refetch: refetchStats } =
    useAnalysisStatistics(productId)

  const handleAnalyzeReviews = async () => {
    if (!productId) {
      return
    }

    try {
      await calculateTrustScore.mutateAsync(productId)
      // Refetch statistics after analysis
      await refetchStats()
    } catch (error) {
      // Error handled by hook
    }
  }

  if (isLoadingProduct) {
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
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
          </div>
        </Main>
      </div>
    )
  }

  if (productError || !product) {
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
          <div className='py-12 text-center'>
            <div className='text-destructive mb-2 font-medium'>
              {productError
                ? `Error: ${(productError as Error).message}`
                : 'Product not found'}
            </div>
            <Button
              variant='outline'
              onClick={() =>
                navigate({
                  to: '/projects/$projectId',
                  params: { projectId: product?.project_id || '' },
                })
              }
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Project
            </Button>
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
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  navigate({
                    to: '/products/$productId',
                    params: { productId: product.id },
                  })
                }
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Product
              </Button>
              <div>
                <h1 className='text-2xl font-bold'>Analyze Reviews</h1>
                <p className='text-muted-foreground text-sm'>
                  Analyze reviews with spam detection and calculate trust score
                </p>
              </div>
            </div>
          </div>

          {/* Analyze Reviews Card */}
          <Card>
            <CardHeader>
              <CardTitle>Analyze Reviews</CardTitle>
              <CardDescription>
                Analyze reviews with spam detection and calculate trust score
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button
                onClick={handleAnalyzeReviews}
                disabled={calculateTrustScore.isPending}
                className='w-full'
              >
                {calculateTrustScore.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Analyzing Reviews...
                  </>
                ) : (
                  <>
                    <Brain className='mr-2 h-4 w-4' />
                    Analyze Reviews & Calculate Trust Score
                  </>
                )}
              </Button>
              {calculateTrustScore.isError && (
                <div className='text-destructive flex items-center gap-2 text-sm'>
                  <XCircle className='h-4 w-4' />
                  <span>Failed to analyze reviews</span>
                </div>
              )}
              {calculateTrustScore.isSuccess && (
                <div className='flex items-center gap-2 text-sm text-green-600'>
                  <CheckCircle2 className='h-4 w-4' />
                  <span>
                    Reviews analyzed and trust score calculated successfully
                  </span>
                </div>
              )}

              {/* Analysis Statistics */}
              {analysisStats && (
                <>
                  <Separator />
                  <div className='space-y-3'>
                    <h4 className='text-sm font-semibold'>
                      Analysis Statistics
                    </h4>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <div className='text-muted-foreground'>
                          Total Analyzed
                        </div>
                        <div className='text-lg font-semibold'>
                          {analysisStats.total_analyzed}
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground'>Spam Count</div>
                        <div className='text-destructive text-lg font-semibold'>
                          {analysisStats.spam_count}
                        </div>
                        <div className='text-muted-foreground text-xs'>
                          ({analysisStats.spam_percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground'>Positive</div>
                        <div className='text-lg font-semibold text-green-600'>
                          {analysisStats.sentiment_counts.positive || 0}
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground'>Negative</div>
                        <div className='text-lg font-semibold text-red-600'>
                          {analysisStats.sentiment_counts.negative || 0}
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground'>Neutral</div>
                        <div className='text-lg font-semibold text-yellow-600'>
                          {analysisStats.sentiment_counts.neutral || 0}
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground'>
                          Avg Sentiment
                        </div>
                        <div className='text-lg font-semibold'>
                          {analysisStats.average_sentiment_score.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Trust Score Card */}
          <TrustScoreCard productId={productId} />

          {/* Reviews and Ratings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
              <CardDescription>
                View all reviews and ratings for this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsList productId={productId} />
            </CardContent>
          </Card>
        </div>
      </Main>
    </div>
  )
}
