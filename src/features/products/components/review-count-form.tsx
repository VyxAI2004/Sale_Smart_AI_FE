/**
 * Phase 3: Review Count Input Component
 * Number input with recommendations and time estimate
 */
import { useState, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type {
  ImportedProduct,
  ReviewCountInput,
} from '../types/auto-discovery-flow.types'

interface ReviewCountFormProps {
  products: ImportedProduct[]
  onContinue: (reviewCounts: ReviewCountInput[]) => void
  isLoading?: boolean
}

const MIN_REVIEWS = 10
const MAX_REVIEWS = 200
const TIME_PER_REVIEW_MS = 500 // Estimated time per review in ms

interface ProductInputState {
  [productId: string]: number
}

export function ReviewCountForm({
  products,
  onContinue,
  isLoading,
}: ReviewCountFormProps) {
  const [reviewCounts, setReviewCounts] = useState<ProductInputState>(
    Object.fromEntries(
      products.map((p) => [
        p.id,
        Math.min(
          p.review_count ? Math.floor(p.review_count * 0.8) : 50,
          MAX_REVIEWS
        ),
      ])
    )
  )

  // Calculate estimated time
  const estimatedTimeMs = useMemo(() => {
    const totalReviews = Object.values(reviewCounts).reduce((a, b) => a + b, 0)
    return totalReviews * TIME_PER_REVIEW_MS
  }, [reviewCounts])

  const estimatedTimeSec = Math.ceil(estimatedTimeMs / 1000)
  const estimatedTimeMin = Math.ceil(estimatedTimeSec / 60)

  const handleSliderChange = (productId: string, value: number[]) => {
    setReviewCounts((prev) => ({
      ...prev,
      [productId]: value[0],
    }))
  }

  const handleContinue = () => {
    const inputs: ReviewCountInput[] = products.map((p) => ({
      product_id: p.id,
      review_count: reviewCounts[p.id] || 50,
    }))
    onContinue(inputs)
  }

  return (
    <div className='space-y-4'>
      {/* Info Card */}
      <Card className='border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30'>
        <CardContent className='flex gap-3 pt-4'>
          <AlertCircle className='h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400' />
          <div className='text-sm'>
            <p className='font-medium text-blue-900 dark:text-blue-100'>
              Hệ thống sẽ:
            </p>
            <ul className='text-muted-foreground mt-1 space-y-1 text-xs'>
              <li>1. Crawl reviews (số bạn nhập)</li>
              <li>2. Tính Trust Score</li>
              <li>3. Phân tích chi tiết</li>
              <li>4. Tạo Marketing Tasks</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Product Inputs */}
      <div className='space-y-3'>
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1'>
                  <CardTitle className='text-base'>📱 {product.name}</CardTitle>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Reviews hiện tại:{' '}
                    <span className='font-semibold'>
                      {product.review_count}
                    </span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              {/* Input */}
              <div>
                <p className='text-muted-foreground mb-2 text-xs font-medium'>
                  Bạn muốn crawl (10-200):
                </p>
                <Input
                  type='number'
                  value={reviewCounts[product.id] || 50}
                  onChange={(e) =>
                    handleSliderChange(product.id, [
                      Math.min(
                        Math.max(parseInt(e.target.value) || 50, MIN_REVIEWS),
                        MAX_REVIEWS
                      ),
                    ])
                  }
                  min={MIN_REVIEWS}
                  max={MAX_REVIEWS}
                  className='w-full'
                />
              </div>

              {/* Value Display */}
              <div className='bg-muted flex items-center justify-between rounded-lg p-2'>
                <span className='text-sm font-semibold'>
                  {reviewCounts[product.id] || 50}
                </span>
                <span className='text-muted-foreground text-xs'>
                  Min: {MIN_REVIEWS} | Max: {MAX_REVIEWS} | Đề xuất:{' '}
                  {Math.min(
                    Math.floor((product.review_count || 50) * 0.8),
                    MAX_REVIEWS
                  )}
                </span>
              </div>

              {/* Info */}
              <p className='text-muted-foreground text-xs italic'>
                💡 Càng nhiều reviews, phân tích càng chính xác (nhưng mất thời
                gian lâu hơn)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Estimate */}
      <Card>
        <CardContent className='flex items-center justify-between pt-4'>
          <div className='text-sm'>
            <p className='font-medium'>⏱️ Thời gian ước tính:</p>
            <p className='text-muted-foreground text-xs'>
              {estimatedTimeMin} phút ({products.length} sản phẩm ×{' '}
              {Object.values(reviewCounts).reduce((a, b) => a + b, 0)} reviews)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className='flex gap-2'>
        <Button
          variant='outline'
          onClick={() => window.history.back()}
          disabled={isLoading}
          className='flex-1'
        >
          Quay Lại
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isLoading}
          className='flex-1'
        >
          {isLoading ? 'Đang xử lý...' : 'Bắt Đầu Phân Tích'}
        </Button>
      </div>
    </div>
  )
}
