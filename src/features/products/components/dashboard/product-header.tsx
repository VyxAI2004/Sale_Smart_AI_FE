import { Link, useNavigate } from '@tanstack/react-router'
import {
  Calendar,
  ExternalLink,
  Image,
  ArrowLeft,
  Package,
  DollarSign,
  Star,
  TrendingUp,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '../../types/product.types'

interface ProductHeaderProps {
  product: Product | null
  isLoading?: boolean
}

export function ProductHeader({
  product,
  isLoading = false,
}: ProductHeaderProps) {
  const navigate = useNavigate()

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className='mb-6'>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-16 w-16 rounded-lg' />
            <div className='space-y-2'>
              <Skeleton className='h-8 w-64' />
              <Skeleton className='h-4 w-96' />
              <div className='flex items-center gap-6'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-16' />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='mb-6'>
        <div className='flex items-center justify-center py-8'>
          <p className='text-muted-foreground'>Product not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className='mb-6'>
      {/* Back Link */}
      <div className='mb-4'>
        <Link
          to='/projects/$projectId'
          params={{ projectId: product.project_id }}
          className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Project
        </Link>
      </div>

      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className='flex items-start gap-4'>
          {/* Product Image */}
          <div className='bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'>
            {product.images &&
            typeof product.images === 'object' &&
            Object.keys(product.images).length > 0 ? (
              <img
                src={Object.values(product.images)[0] as string}
                alt={product.name}
                className='h-full w-full rounded-lg object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Image
              className={`text-muted-foreground h-6 w-6 ${product.images && typeof product.images === 'object' && Object.keys(product.images).length > 0 ? 'hidden' : ''}`}
            />
          </div>

          {/* Product Info */}
          <div className='min-w-0 flex-1'>
            {/* Title & Platform */}
            <div className='mb-1 flex items-center gap-3'>
              <h2 className='truncate text-2xl font-bold tracking-tight'>
                {product.name}
              </h2>
              <Badge variant='outline' className='text-sm'>
                {product.platform}
              </Badge>
            </div>

            {/* Brand & Category */}
            <div className='text-muted-foreground mb-2 flex items-center gap-2 text-sm'>
              {product.brand && (
                <span className='font-medium'>{product.brand}</span>
              )}
              {product.category && (
                <>
                  {product.brand && <span>•</span>}
                  <span>{product.category}</span>
                </>
              )}
            </div>

            {/* Meta Info */}
            <div className='text-muted-foreground flex flex-wrap items-center gap-6 text-sm'>
              <div className='flex items-center gap-2'>
                <DollarSign className='h-4 w-4' />
                <span className='text-foreground font-semibold'>
                  {formatCurrency(
                    product.current_price,
                    product.currency || 'VND'
                  )}
                </span>
                {product.original_price &&
                  product.original_price > product.current_price && (
                    <span className='text-muted-foreground line-through'>
                      {formatCurrency(
                        product.original_price,
                        product.currency || 'VND'
                      )}
                    </span>
                  )}
              </div>

              {product.average_rating && (
                <div className='flex items-center gap-2'>
                  <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold'>
                    {product.average_rating.toFixed(1)}
                  </span>
                  <span className='text-muted-foreground'>
                    ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              {product.trust_score != null &&
                typeof product.trust_score === 'number' && (
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='h-4 w-4' />
                    <span className='font-semibold'>
                      Trust Score: {product.trust_score.toFixed(1)}
                    </span>
                  </div>
                )}

              {product.sold_count && (
                <div className='flex items-center gap-2'>
                  <Package className='h-4 w-4' />
                  <span>{product.sold_count.toLocaleString()} sold</span>
                </div>
              )}

              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                <span>Created {formatDate(product.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          {product.url && (
            <Button
              size='sm'
              variant='outline'
              onClick={() => window.open(product.url, '_blank')}
              className='flex items-center gap-2'
            >
              <ExternalLink className='h-4 w-4' />
              View on {product.platform}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
