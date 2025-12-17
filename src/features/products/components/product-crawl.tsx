import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import {
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useCrawlReviews } from '../hooks/use-product-crawler'
import { useProduct } from '../hooks/use-products'
import { ReviewsList } from './reviews-list'
import { TrustScoreCard } from './trust-score-card'

export function ProductCrawl() {
  const { productId } = useParams({
    from: '/_authenticated/products/$productId/crawl',
  })
  const navigate = useNavigate()
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProduct(productId)
  const crawlReviews = useCrawlReviews()
  const [reviewLimit, setReviewLimit] = useState(30)

  const handleCrawlReviews = async () => {
    if (!productId) {
      toast.error('Product ID is required')
      return
    }

    try {
      await crawlReviews.mutateAsync({
        product_id: productId,
        review_limit: reviewLimit,
      })
      toast.success('Crawl completed successfully')
      // Reviews list will automatically refresh due to query invalidation in hook
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
          <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin' />
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
          <Card>
            <CardContent className='pt-6'>
              <div className='space-y-2 text-center'>
                <div className='text-destructive font-medium'>
                  Error loading product
                </div>
                <div className='text-muted-foreground text-sm'>
                  {(productError as Error)?.message || 'Product not found'}
                </div>
                <Button
                  variant='outline'
                  onClick={() => navigate({ to: '/projects' })}
                  className='mt-4'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to Projects
                </Button>
              </div>
            </CardContent>
          </Card>
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
                    to: '/projects/$projectId',
                    params: { projectId: product.project_id },
                  })
                }
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
              <div>
                <h1 className='text-2xl font-bold'>Crawl Product Data</h1>
                <p className='text-muted-foreground text-sm'>
                  Crawl reviews and details for this product
                </p>
              </div>
            </div>
          </div>

          {/* Product Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Product details and current status
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <Label className='text-muted-foreground'>Product Name</Label>
                  <p className='font-medium'>{product.name}</p>
                </div>
                <div>
                  <Label className='text-muted-foreground'>Platform</Label>
                  <div className='mt-1'>
                    <Badge variant='secondary'>
                      {product.platform || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className='text-muted-foreground'>Price</Label>
                  <p className='font-medium'>
                    {product.current_price
                      ? `${product.current_price.toLocaleString()} ${product.currency || 'VND'}`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className='text-muted-foreground'>Reviews</Label>
                  <p className='font-medium'>
                    {product.review_count || 0} reviews
                  </p>
                </div>
                {product.url && (
                  <div className='md:col-span-2'>
                    <Label className='text-muted-foreground'>Product URL</Label>
                    <div className='mt-1 flex items-center gap-2'>
                      <a
                        href={product.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary flex-1 truncate text-sm hover:underline'
                      >
                        {product.url}
                      </a>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => window.open(product.url, '_blank')}
                      >
                        <ExternalLink className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crawl Reviews Card */}
          <Card>
            <CardHeader>
              <CardTitle>Crawl Reviews</CardTitle>
              <CardDescription>
                Crawl product reviews and update product details
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='review-limit'>Review Limit</Label>
                <Input
                  id='review-limit'
                  type='number'
                  min={0}
                  max={100}
                  value={reviewLimit}
                  onChange={(e) =>
                    setReviewLimit(parseInt(e.target.value) || 30)
                  }
                />
                <p className='text-muted-foreground text-xs'>
                  Maximum number of reviews to crawl (0-100)
                </p>
              </div>
              <Button
                onClick={handleCrawlReviews}
                disabled={crawlReviews.isPending}
                className='w-full'
              >
                {crawlReviews.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Crawling Reviews...
                  </>
                ) : (
                  <>
                    <MessageSquare className='mr-2 h-4 w-4' />
                    Start Crawling Reviews
                  </>
                )}
              </Button>
              {crawlReviews.isError && (
                <div className='text-destructive flex items-center gap-2 text-sm'>
                  <XCircle className='h-4 w-4' />
                  <span>Failed to crawl reviews</span>
                </div>
              )}
              {crawlReviews.isSuccess && (
                <div className='flex items-center gap-2 text-sm text-green-600'>
                  <CheckCircle2 className='h-4 w-4' />
                  <span>Reviews crawled successfully</span>
                </div>
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
