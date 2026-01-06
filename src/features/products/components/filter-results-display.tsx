'use client'

import { Star, ShoppingCart, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '../types/product.types'

interface FilterResultsDisplayProps {
  items: Product[]
  total: number
}

export function FilterResultsDisplay({
  items,
  total,
}: FilterResultsDisplayProps) {
  if (total === 0) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center py-8 text-muted-foreground'>
            Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Kết quả tìm kiếm</CardTitle>
          <CardDescription>Tìm được {total} sản phẩm</CardDescription>
        </CardHeader>
      </Card>

      {/* Products List */}
      <div className='space-y-3 max-h-[600px] overflow-y-auto'>
        {items.map((product) => (
          <Card key={product.id} className='hover:shadow-md transition-shadow'>
            <CardContent className='pt-4'>
              <div className='space-y-2'>
                {/* Product Name */}
                <h3 className='font-medium text-sm line-clamp-2 text-foreground'>
                  {product.name}
                </h3>

                {/* Badges */}
                <div className='flex flex-wrap gap-2'>
                  {product.platform && (
                    <Badge variant='outline' className='text-xs'>
                      {product.platform === 'shopee' && '🛒'}{' '}
                      {product.platform?.toUpperCase()}
                    </Badge>
                  )}
                  {product.brand && (
                    <Badge variant='secondary' className='text-xs'>
                      {product.brand}
                    </Badge>
                  )}
                  {product.category && (
                    <Badge variant='outline' className='text-xs'>
                      {product.category}
                    </Badge>
                  )}
                </div>

                {/* Price & Stats */}
                <div className='grid grid-cols-2 gap-3 mt-3'>
                  {/* Price */}
                  <div className='bg-muted/50 rounded p-2'>
                    <div className='text-xs text-muted-foreground'>Giá</div>
                    <div className='font-semibold text-sm text-foreground'>
                      ₫{product.current_price?.toLocaleString('vi-VN')}
                    </div>
                    {product.discount_rate && (
                      <div className='text-xs text-orange-600 dark:text-orange-400'>
                        -{product.discount_rate}%
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className='space-y-1 text-xs'>
                    {product.average_rating && (
                      <div className='flex items-center gap-1'>
                        <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                        <span className='font-medium'>
                          {product.average_rating}
                        </span>
                        {product.review_count && (
                          <span className='text-muted-foreground'>
                            ({product.review_count})
                          </span>
                        )}
                      </div>
                    )}
                    {product.sold_count && (
                      <div className='flex items-center gap-1 text-muted-foreground'>
                        <ShoppingCart className='h-3 w-3' />
                        <span>
                          {(product.sold_count as number).toLocaleString('vi-VN')} bán
                        </span>
                      </div>
                    )}
                    {product.trust_score && (
                      <div className='flex items-center gap-1 text-blue-600 dark:text-blue-400'>
                        <TrendingUp className='h-3 w-3' />
                        <span className='font-medium'>
                          {product.trust_score}% tin cậy
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product URL */}
                {product.url && (
                  <a
                    href={product.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-blue-600 hover:underline block truncate mt-2'
                  >
                    Xem trên sàn →
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
