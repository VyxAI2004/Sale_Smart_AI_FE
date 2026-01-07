/**
 * Phase 4: Processing & Live Results Component
 */
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type {
  ImportedProduct,
  ProductProcessingResult,
} from '../types/auto-discovery-flow.types'

interface Phase2ProcessingProps {
  products: ImportedProduct[]
  productProgress: { [productId: string]: number }
  productResults: { [productId: string]: ProductProcessingResult }
  isProcessing: boolean
}

function StepProgressBar({
  label,
  percentage,
}: {
  label: string
  percentage?: number
}) {
  const isComplete = percentage === 100
  const isRunning =
    percentage !== undefined && percentage > 0 && percentage < 100

  return (
    <div className='space-y-1'>
      <div className='flex items-center gap-2'>
        {isComplete && <CheckCircle2 className='h-4 w-4 text-green-600' />}
        {isRunning && (
          <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
        )}
        {!isComplete && !isRunning && (
          <div className='h-4 w-4 rounded-full border-2 border-gray-300' />
        )}
        <span className='text-xs'>{label}</span>
      </div>
      {percentage !== undefined && (
        <Progress value={percentage} className='h-1' />
      )}
    </div>
  )
}

function SentimentChart({
  distribution,
}: {
  distribution?: { positive: number; neutral: number; negative: number }
}) {
  if (!distribution) return null

  const total =
    distribution.positive + distribution.neutral + distribution.negative
  if (total === 0) return null

  const positive = (distribution.positive / total) * 100
  const neutral = (distribution.neutral / total) * 100
  const negative = (distribution.negative / total) * 100

  return (
    <div className='space-y-2'>
      <p className='text-xs font-semibold'>Phân tích cảm xúc:</p>
      <div className='bg-muted flex h-2 gap-1 overflow-hidden rounded-full'>
        {positive > 0 && (
          <div
            className='bg-green-500'
            style={{ width: `${positive}%` }}
            title={`Tích cực: ${distribution.positive}`}
          />
        )}
        {neutral > 0 && (
          <div
            className='bg-gray-500'
            style={{ width: `${neutral}%` }}
            title={`Trung tính: ${distribution.neutral}`}
          />
        )}
        {negative > 0 && (
          <div
            className='bg-red-500'
            style={{ width: `${negative}%` }}
            title={`Tiêu cực: ${distribution.negative}`}
          />
        )}
      </div>
      <div className='text-muted-foreground flex justify-between text-xs'>
        <span>👍 {distribution.positive} tích cực</span>
        <span>😐 {distribution.neutral} trung tính</span>
        <span>👎 {distribution.negative} tiêu cực</span>
      </div>
    </div>
  )
}

function TrustScoreDisplay({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 8) return 'text-green-600 dark:text-green-400'
    if (s >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreStars = (s: number) => {
    const stars = Math.round(s / 2)
    return '⭐'.repeat(stars)
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-baseline gap-2'>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </span>
        <span className='text-muted-foreground text-sm'>/10</span>
      </div>
      <p className='text-sm'>{getScoreStars(score)}</p>
    </div>
  )
}

export function Phase2Processing({
  products,
  productProgress,
  productResults,
  isProcessing,
}: Phase2ProcessingProps) {
  return (
    <div className='space-y-4'>
      <Card className='flex flex-col'>
        <CardHeader>
          <CardTitle className='text-base'>Phân Tích Thực Thời</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 overflow-hidden'>
          <div className='grid h-96 grid-cols-2 gap-6 overflow-y-auto pr-2'>
            <div className='space-y-3'>
              <h4 className='bg-background sticky top-0 py-1 text-sm font-semibold'>
                📝 Tiến Độ
              </h4>
              <div className='space-y-4'>
                {products.map((product) => {
                  const progress = productProgress[product.id] || 0

                  return (
                    <div key={product.id} className='space-y-2'>
                      <p className='truncate text-xs font-medium'>
                        {product.name}
                      </p>
                      <div className='space-y-1 text-xs'>
                        <StepProgressBar label='Crawl' percentage={progress} />
                        <StepProgressBar
                          label='Trust'
                          percentage={
                            productResults[product.id]?.trust_score
                              ? 100
                              : undefined
                          }
                        />
                        <StepProgressBar
                          label='Analysis'
                          percentage={
                            productResults[product.id]?.key_insights.length
                              ? 100
                              : undefined
                          }
                        />
                        <StepProgressBar
                          label='Tasks'
                          percentage={
                            productResults[product.id]?.tasks.length
                              ? 100
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='space-y-3'>
              <h4 className='bg-background sticky top-0 py-1 text-sm font-semibold'>
                📊 Kết Quả
              </h4>
              <div className='space-y-3'>
                {products.map((product) => {
                  const result = productResults[product.id]
                  const hasData = result && result.trust_score

                  return (
                    <div
                      key={product.id}
                      className='space-y-2 rounded-lg border p-3'
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <p className='truncate text-xs font-medium'>
                          {product.name}
                        </p>
                        {hasData && (
                          <CheckCircle2 className='h-4 w-4 flex-shrink-0 text-green-600' />
                        )}
                      </div>

                      {hasData ? (
                        <div className='space-y-2'>
                          <div>
                            <p className='text-muted-foreground mb-1 text-xs font-semibold'>
                              Trust Score
                            </p>
                            <TrustScoreDisplay score={result.trust_score} />
                          </div>

                          {result.sentiment_distribution && (
                            <SentimentChart
                              distribution={result.sentiment_distribution}
                            />
                          )}

                          {result.key_insights.length > 0 && (
                            <div>
                              <p className='mb-1 text-xs font-semibold'>
                                Insights
                              </p>
                              <ul className='space-y-0.5'>
                                {result.key_insights.map((insight, idx) => (
                                  <li
                                    key={idx}
                                    className='text-muted-foreground text-xs'
                                  >
                                    • {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.tasks.length > 0 && (
                            <div>
                              <p className='mb-1 text-xs font-semibold'>
                                Tasks ({result.tasks.length})
                              </p>
                              <div className='space-y-1'>
                                {result.tasks.slice(0, 2).map((task, idx) => (
                                  <div
                                    key={idx}
                                    className={`truncate rounded px-2 py-1 text-xs ${
                                      task.priority === 'high'
                                        ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
                                        : task.priority === 'medium'
                                          ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300'
                                          : 'bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-300'
                                    }`}
                                  >
                                    {task.title}
                                  </div>
                                ))}
                                {result.tasks.length > 2 && (
                                  <p className='text-muted-foreground text-xs'>
                                    +{result.tasks.length - 2} tasks
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='flex items-center gap-2'>
                          {isProcessing ? (
                            <>
                              <Loader2 className='h-3 w-3 animate-spin text-blue-500' />
                              <span className='text-muted-foreground text-xs'>
                                Đang xử lý...
                              </span>
                            </>
                          ) : (
                            <span className='text-muted-foreground text-xs'>
                              Chờ dữ liệu...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isProcessing && (
        <div className='flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30'>
          <CheckCircle2 className='h-5 w-5 flex-shrink-0 text-green-600' />
          <div>
            <p className='text-sm font-semibold'>Phân Tích Hoàn Thành</p>
            <p className='text-muted-foreground text-xs'>
              Tất cả sản phẩm đã được xử lý thành công
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
