import {
  ExternalLink,
  Star,
  TrendingUp,
  ShoppingCart,
  Package,
  Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CompetitorProduct } from '../../types/project-detail.types'

interface CompetitorProductsCardProps {
  products: CompetitorProduct[] | null
  isLoading?: boolean
  onViewDetails?: (productId: string) => void
}

export function CompetitorProductsCard({
  products,
  isLoading = false,
  onViewDetails,
}: CompetitorProductsCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const formatSimilarity = (score: number) => {
    return `${(score * 100).toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Competitor Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='flex items-center space-x-4 rounded-lg border p-3'
              >
                <Skeleton className='h-12 w-12 rounded' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-40' />
                  <Skeleton className='h-3 w-32' />
                  <Skeleton className='h-3 w-24' />
                </div>
                <div className='space-y-2 text-right'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-3 w-16' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!products || products.length === 0) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Competitor Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <Search className='text-muted-foreground mb-3 h-12 w-12' />
            <h3 className='mb-1 text-sm font-medium'>No products found</h3>
            <p className='text-muted-foreground mb-4 text-xs'>
              Start crawling to collect competitor data
            </p>
            <Button size='sm' variant='outline'>
              Start Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show top 5 products, sorted by similarity
  const topProducts = products
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 5)

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Package className='h-5 w-5' />
          Competitor Products
          <Badge variant='secondary' className='ml-auto'>
            {products.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <div className='max-h-96 space-y-3 overflow-y-auto'>
            {topProducts.map((product) => (
              <div
                key={product.id}
                className='hover:bg-muted/50 flex items-start space-x-3 rounded-lg border p-3 transition-colors'
              >
                {/* Product Info */}
                <div className='min-w-0 flex-1'>
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='min-w-0 flex-1'>
                      <h4 className='mb-1 line-clamp-2 text-sm font-medium'>
                        {product.name}
                      </h4>

                      <div className='text-muted-foreground mb-1 flex items-center gap-2 text-xs'>
                        <span className='font-medium'>{product.platform}</span>
                        {product.brand && (
                          <>
                            <span>•</span>
                            <span>{product.brand}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Similarity Score */}
                    <Badge
                      variant='secondary'
                      className={`ml-2 text-xs ${getSimilarityColor(product.similarity_score)}`}
                    >
                      {formatSimilarity(product.similarity_score)}
                    </Badge>
                  </div>

                  {/* Price & Rating */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <span className='text-sm font-bold'>
                        {formatPrice(product.current_price, product.currency)}
                      </span>

                      {product.average_rating && (
                        <div className='flex items-center gap-1'>
                          <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                          <span className='text-muted-foreground text-xs'>
                            {product.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {product.review_count && product.review_count > 0 && (
                        <span className='text-muted-foreground text-xs'>
                          ({product.review_count.toLocaleString()})
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-1'>
                      <Button
                        size='sm'
                        variant='ghost'
                        asChild
                        className='h-6 w-6 p-0'
                      >
                        <a
                          href={product.url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <ExternalLink className='h-3 w-3' />
                        </a>
                      </Button>

                      {onViewDetails && (
                        <Button
                          size='sm'
                          variant='ghost'
                          className='h-6 w-6 p-0'
                          onClick={() => onViewDetails(product.id)}
                        >
                          <TrendingUp className='h-3 w-3' />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > 5 && (
            <div className='border-t pt-3'>
              <Button variant='ghost' size='sm' className='w-full'>
                <ShoppingCart className='mr-2 h-4 w-4' />
                View All Products ({products.length})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
