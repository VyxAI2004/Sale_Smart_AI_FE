import {
  Star,
  ShoppingCart,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
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
      <div className='py-12 text-center'>
        <p className='text-muted-foreground'>No products found</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map((product) => {
        const imageUrls = (product.images as any)?.urls || []
        const firstImage = imageUrls[0]

        return (
          <Card
            key={product.id}
            className='flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg'
            onClick={() => onViewProduct?.(product.id)}
          >
            {/* Image */}
            <div className='bg-muted flex h-48 w-full items-center justify-center overflow-hidden'>
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={product.name}
                  className='h-full w-full object-cover transition-transform hover:scale-105'
                  onError={(e) => {
                    // Fallback icon if image fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <ImageIcon className='text-muted-foreground h-12 w-12' />
              )}
            </div>

            <CardContent className='flex-1 pt-4 pb-3'>
              {/* Platform Badge */}
              <div className='mb-2 flex items-start justify-between'>
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
              <h3 className='mb-2 line-clamp-2 text-sm font-semibold'>
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
              <div className='mb-2 flex items-center gap-4 text-xs'>
                <div className='flex items-center gap-1'>
                  <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold'>
                    {(() => {
                      const avg = (product.specifications as any)
                        ?.detailed_rating?.avg
                      return avg ? Number(avg).toFixed(1) : '-'
                    })()}
                  </span>
                </div>
                <span className='text-muted-foreground'>
                  (
                  {(() => {
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
                <p className='text-muted-foreground line-clamp-1 text-xs'>
                  {product.category}
                </p>
              )}
            </CardContent>

            <CardFooter className='flex gap-2 border-t pt-3'>
              <Button
                size='sm'
                variant='outline'
                className='h-8 flex-1 text-xs'
                onClick={(e) => {
                  e.stopPropagation()
                  onViewProduct?.(product.id)
                }}
              >
                Chi tiết
              </Button>
              <Button
                size='sm'
                className='h-8 flex-1 text-xs'
                onClick={(e) => {
                  e.stopPropagation()
                  onCrawlReviews?.(product.id)
                }}
              >
                <ShoppingCart className='mr-1 h-3 w-3' />
                Crawl
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
