import { TrendingUp, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react'
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
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useTrustScore, useCalculateTrustScore } from '../hooks/use-trust-score'

interface TrustScoreCardProps {
  productId: string
}

export function TrustScoreCard({ productId }: TrustScoreCardProps) {
  const { data: trustScore, isLoading, error } = useTrustScore(productId)
  const calculateTrustScore = useCalculateTrustScore()

  const handleCalculate = async () => {
    try {
      await calculateTrustScore.mutateAsync(productId)
    } catch (error) {
      // Error handled by hook
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreVariant = (
    score: number
  ): 'default' | 'secondary' | 'destructive' => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-[200px]' />
          <Skeleton className='mt-2 h-4 w-[300px]' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-32 w-full' />
        </CardContent>
      </Card>
    )
  }

  if (error && !trustScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trust Score</CardTitle>
          <CardDescription>Product trustworthiness analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='py-8 text-center'>
            <AlertCircle className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground mb-4 text-sm'>
              Trust score not calculated yet
            </p>
            <Button
              onClick={handleCalculate}
              disabled={calculateTrustScore.isPending}
            >
              {calculateTrustScore.isPending ? (
                <>
                  <Calculator className='mr-2 h-4 w-4 animate-spin' />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className='mr-2 h-4 w-4' />
                  Calculate Trust Score
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!trustScore) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Trust Score</CardTitle>
            <CardDescription>Product trustworthiness analysis</CardDescription>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={handleCalculate}
            disabled={calculateTrustScore.isPending}
          >
            {calculateTrustScore.isPending ? (
              <>
                <Calculator className='mr-2 h-4 w-4 animate-spin' />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className='mr-2 h-4 w-4' />
                Recalculate
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Main Score */}
        <div className='space-y-2 text-center'>
          <div
            className={`text-5xl font-bold ${getScoreColor(Number(trustScore.trust_score))}`}
          >
            {Number(trustScore.trust_score).toFixed(1)}
          </div>
          <div className='flex items-center justify-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            <Badge variant={getScoreVariant(Number(trustScore.trust_score))}>
              {Number(trustScore.trust_score) >= 80
                ? 'High Trust'
                : Number(trustScore.trust_score) >= 60
                  ? 'Medium Trust'
                  : 'Low Trust'}
            </Badge>
          </div>
          <Progress value={Number(trustScore.trust_score)} className='w-full' />
        </div>

        {/* Statistics */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <div className='text-muted-foreground text-sm'>Total Reviews</div>
            <div className='text-2xl font-semibold'>
              {trustScore.total_reviews}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-muted-foreground text-sm'>Analyzed</div>
            <div className='text-2xl font-semibold'>
              {trustScore.analyzed_reviews}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-muted-foreground text-sm'>Verified</div>
            <div className='text-2xl font-semibold'>
              {trustScore.verified_reviews_count}
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-muted-foreground text-sm'>Spam</div>
            <div className='text-destructive text-2xl font-semibold'>
              {trustScore.spam_reviews_count}
            </div>
            <div className='text-muted-foreground text-xs'>
              ({Number(trustScore.spam_percentage).toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className='space-y-2 border-t pt-4'>
          <div className='text-sm font-semibold'>Sentiment Distribution</div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='rounded bg-green-50 p-2 text-center'>
              <div className='text-lg font-semibold text-green-600'>
                {trustScore.positive_reviews_count}
              </div>
              <div className='text-muted-foreground text-xs'>Positive</div>
            </div>
            <div className='rounded bg-yellow-50 p-2 text-center'>
              <div className='text-lg font-semibold text-yellow-600'>
                {trustScore.neutral_reviews_count}
              </div>
              <div className='text-muted-foreground text-xs'>Neutral</div>
            </div>
            <div className='rounded bg-red-50 p-2 text-center'>
              <div className='text-lg font-semibold text-red-600'>
                {trustScore.negative_reviews_count}
              </div>
              <div className='text-muted-foreground text-xs'>Negative</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
