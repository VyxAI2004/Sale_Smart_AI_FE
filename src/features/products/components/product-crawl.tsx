import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useProduct } from '@/hooks/use-products';
import { useCrawlReviews } from '@/hooks/use-product-crawler';
import { useAnalyzeProductReviews } from '@/hooks/use-reviews';
import { ReviewsList } from './reviews-list';
import { TrustScoreCard } from './trust-score-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, CheckCircle2, XCircle, ArrowLeft, ExternalLink, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ConfigDrawer } from '@/components/config-drawer';
import { ProfileDropdown } from '@/components/profile-dropdown';

export function ProductCrawl() {
  const { productId } = useParams({ from: '/_authenticated/products/$productId/crawl' });
  const navigate = useNavigate();
  const { data: product, isLoading: isLoadingProduct, error: productError } = useProduct(productId);
  const crawlReviews = useCrawlReviews();
  const analyzeReviews = useAnalyzeProductReviews();
  const [reviewLimit, setReviewLimit] = useState(30);

  const handleCrawlReviews = async () => {
    if (!productId) {
      toast.error('Product ID is required');
      return;
    }

    try {
      await crawlReviews.mutateAsync({
        product_id: productId,
        review_limit: reviewLimit,
      });
      toast.success('Crawl completed successfully');
      // Reviews list will automatically refresh due to query invalidation in hook
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleAnalyzeReviews = async () => {
    if (!productId) {
      toast.error('Product ID is required');
      return;
    }

    try {
      await analyzeReviews.mutateAsync(productId);
      // Trust score will automatically refresh due to query invalidation in hook
    } catch (error) {
      // Error handled by hook
    }
  };

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
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Main>
      </div>
    );
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
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-destructive font-medium">
                  Error loading product
                </div>
                <div className="text-sm text-muted-foreground">
                  {(productError as Error)?.message || 'Product not found'}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate({ to: '/projects' })}
                  className="mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </Main>
      </div>
    );
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ 
                  to: '/projects/$projectId', 
                  params: { projectId: product.project_id } 
                })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Crawl Product Data</h1>
                <p className="text-sm text-muted-foreground">
                  Crawl reviews and details for this product
                </p>
              </div>
            </div>
          </div>

          {/* Product Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Product details and current status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Product Name</Label>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Platform</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">{product.platform || 'Unknown'}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="font-medium">
                    {product.current_price ? `${product.current_price.toLocaleString()} ${product.currency || 'VND'}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reviews</Label>
                  <p className="font-medium">{product.review_count || 0} reviews</p>
                </div>
                {product.url && (
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground">Product URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate flex-1"
                      >
                        {product.url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(product.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="review-limit">Review Limit</Label>
                <Input
                  id="review-limit"
                  type="number"
                  min={0}
                  max={100}
                  value={reviewLimit}
                  onChange={(e) => setReviewLimit(parseInt(e.target.value) || 30)}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of reviews to crawl (0-100)
                </p>
              </div>
              <Button
                onClick={handleCrawlReviews}
                disabled={crawlReviews.isPending}
                className="w-full"
              >
                {crawlReviews.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Crawling Reviews...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Crawling Reviews
                  </>
                )}
              </Button>
              {crawlReviews.isError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>Failed to crawl reviews</span>
                </div>
              )}
              {crawlReviews.isSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Reviews crawled successfully</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analyze Reviews Card */}
          <Card>
            <CardHeader>
              <CardTitle>Analyze Reviews</CardTitle>
              <CardDescription>
                Analyze reviews with spam detection and calculate trust score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleAnalyzeReviews}
                disabled={analyzeReviews.isPending}
                className="w-full"
              >
                {analyzeReviews.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Reviews...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Reviews & Calculate Trust Score
                  </>
                )}
              </Button>
              {analyzeReviews.isError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>Failed to analyze reviews</span>
                </div>
              )}
              {analyzeReviews.isSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Reviews analyzed successfully</span>
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
  );
}

