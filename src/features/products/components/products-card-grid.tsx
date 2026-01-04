import { Star, ShoppingCart, TrendingUp, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Product } from '../types/product.types'

interface ProductsCardGridProps {
  products: Product[]
  onViewProduct?: (productId: string) => void
  onCrawlReviews?: (productId: string) => void
}

export function ProductsCardGrid({
  products,
  onViewProduct,
  onCrawlReviews,
}: ProductsCardGridProps) {
  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>No products found</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {products.map((product) => {
        const imageUrls = (product.images as any)?.urls || []
        const firstImage = imageUrls[0]

        return (
          <Card
            key={product.id}
            className='flex flex-col hover:shadow-lg transition-shadow cursor-pointer overflow-hidden'
            onClick={() => onViewProduct?.(product.id)}
          >
            {/* Image */}
            <div className='w-full h-48 bg-muted flex items-center justify-center overflow-hidden'>
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={product.name}
                  className='w-full h-full object-cover hover:scale-105 transition-transform'
                  onError={(e) => {
                    // Fallback icon if image fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <ImageIcon className='h-12 w-12 text-muted-foreground' />
              )}
            </div>

            <CardContent className='pt-4 pb-3 flex-1'>
              {/* Platform Badge */}
              <div className='flex items-start justify-between mb-2'>
                <Badge variant='secondary' className='text-xs'>
                  {product.platform}
                </Badge>
                {product.trust_score && (
                  <div className='flex items-center gap-1 text-xs'>
                    <TrendingUp className='h-3 w-3' />
                    <span className='font-semibold'>
                      {product.trust_score.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Name */}
              <h3 className='font-semibold text-sm line-clamp-2 mb-2'>
                {product.name}
              </h3>

              {/* Price */}
              <div className='mb-2'>
                <p className='text-lg font-bold'>
                  {product.current_price.toLocaleString()} ₫
                </p>
                {product.discount_rate && (
                  <p className='text-xs text-green-600'>
                    Giảm {product.discount_rate}%
                  </p>
                )}
              </div>

              {/* Rating and Reviews */}
              <div className='flex items-center gap-4 text-xs mb-2'>
                <div className='flex items-center gap-1'>
                  <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold'>
                    {(() => {
                      const avg = (product.specifications as any)?.detailed_rating
                        ?.avg
                      return avg ? Number(avg).toFixed(1) : '-'
                    })()}
                  </span>
                </div>
                <span className='text-muted-foreground'>
                  ({(() => {
                    const count =
                      (product.specifications as any)?.detailed_rating?.count ||
                      product.review_count
                    return count || 0
                  })()}{' '}
                  đánh giá)
                </span>
              </div>

              {/* Category */}
              {product.category && (
                <p className='text-xs text-muted-foreground line-clamp-1'>
                  {product.category}
                </p>
              )}
            </CardContent>

            <CardFooter className='pt-3 border-t flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                className='flex-1 text-xs h-8'
                onClick={(e) => {
                  e.stopPropagation()
                  onViewProduct?.(product.id)
                }}
              >
                Chi tiết
              </Button>
              <Button
                size='sm'
                className='flex-1 text-xs h-8'
                onClick={(e) => {
                  e.stopPropagation()
                  onCrawlReviews?.(product.id)
                }}
              >
                <ShoppingCart className='h-3 w-3 mr-1' />
                Crawl
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
