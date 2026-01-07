/**
 * Phase 2: Review Confirmation Component
 * Show passed/rejected products with decision prompt
 */
import { useState } from 'react'
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ImportedProduct } from '../types/auto-discovery-flow.types'

interface ReviewConfirmationProps {
  passedProducts: ImportedProduct[]
  rejectedProducts: ImportedProduct[]
  onContinue: (shouldContinue: boolean) => void
  isLoading?: boolean
}

interface ProductCardProps {
  product: ImportedProduct
  isRejected?: boolean
}

function ProductCard({ product, isRejected = false }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`rounded-lg border p-3 ${
        isRejected
          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
          : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className='flex w-full items-start justify-between gap-2'
      >
        <div className='flex-1 text-left'>
          <div className='flex items-center gap-2'>
            {isRejected ? (
              <AlertCircle className='h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400' />
            ) : (
              <CheckCircle2 className='h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400' />
            )}
            <h4 className='line-clamp-2 text-sm font-medium'>{product.name}</h4>
          </div>
          <div className='text-muted-foreground mt-1 text-xs'>
            Giá: {product.price?.toLocaleString('vi-VN')} VND | Rating:{' '}
            {product.rating ?? 'N/A'} | Reviews: {product.review_count ?? 'N/A'}{' '}
            | Platform: {product.platform}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className='h-4 w-4 flex-shrink-0' />
        ) : (
          <ChevronDown className='h-4 w-4 flex-shrink-0' />
        )}
      </button>

      {expanded && (
        <div className='border-t border-current/20 pt-2'>
          <div className='mt-2 space-y-2 text-xs'>
            <div>
              <span className='font-medium'>Lý do:</span>{' '}
              <span
                className={
                  isRejected
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-green-700 dark:text-green-300'
                }
              >
                {product.reason}
              </span>
            </div>
            {product.url && (
              <div>
                <a
                  href={product.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='truncate text-blue-600 hover:underline dark:text-blue-400'
                >
                  🔗 Xem trên sàn
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function ReviewConfirmation({
  passedProducts,
  rejectedProducts,
  onContinue,
  isLoading,
}: ReviewConfirmationProps) {
  const [selectedDecision, setSelectedDecision] = useState<boolean | null>(null)

  const handleContinue = () => {
    if (selectedDecision !== null) {
      onContinue(selectedDecision)
    }
  }

  return (
    <div className='flex h-full flex-col space-y-4'>
      {/* Summary Stats */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>✅ Tìm Kiếm Hoàn Thành</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-3 gap-2 text-sm'>
            <div className='rounded-lg bg-blue-50 p-2 dark:bg-blue-950/30'>
              <div className='text-muted-foreground text-xs'>Tìm được</div>
              <div className='font-semibold'>
                {passedProducts.length + rejectedProducts.length}
              </div>
            </div>
            <div className='rounded-lg bg-green-50 p-2 dark:bg-green-950/30'>
              <div className='text-muted-foreground text-xs'>Đạt yêu cầu</div>
              <div className='font-semibold text-green-700 dark:text-green-300'>
                {passedProducts.length}
              </div>
            </div>
            <div className='rounded-lg bg-red-50 p-2 dark:bg-red-950/30'>
              <div className='text-muted-foreground text-xs'>Loại bỏ</div>
              <div className='font-semibold text-red-700 dark:text-red-300'>
                {rejectedProducts.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content - scrollable */}
      <div className='flex-1 space-y-4 overflow-y-auto pr-2'>
        {/* Passed Products */}
        {passedProducts.length > 0 && (
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <CheckCircle2 className='h-4 w-4 text-green-600' />
                Lý Do Chọn ({passedProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {passedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejected Products */}
        {rejectedProducts.length > 0 && (
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <AlertCircle className='h-4 w-4 text-red-600' />
                Lý Do Loại Bỏ ({rejectedProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {rejectedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isRejected />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Decision - sticky button */}
      <Card className='sticky bottom-0 mt-4'>
        <CardContent className='pt-4'>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <label className='hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3'>
                <input
                  type='radio'
                  name='decision'
                  value='no'
                  checked={selectedDecision === false}
                  onChange={() => setSelectedDecision(false)}
                  className='h-4 w-4'
                />
                <span className='text-sm'>Không, dừng lại đây</span>
              </label>

              <label className='hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3'>
                <input
                  type='radio'
                  name='decision'
                  value='yes'
                  checked={selectedDecision === true}
                  onChange={() => setSelectedDecision(true)}
                  className='h-4 w-4'
                />
                <span className='text-sm'>Có, tiếp tục phân tích chi tiết</span>
              </label>
            </div>

            <div className='flex gap-2 pt-2'>
              <Button
                variant='outline'
                onClick={() => onContinue(false)}
                disabled={isLoading}
                className='flex-1'
              >
                Quay Lại
              </Button>
              <Button
                onClick={handleContinue}
                disabled={selectedDecision === null || isLoading}
                className='flex-1'
              >
                Tiếp Tục
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
