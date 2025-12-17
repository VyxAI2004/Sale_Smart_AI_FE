import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  BarChart3,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface KPICardProps {
  title: string
  value: number | string | null
  subtitle?: string
  trend?: string
  type?: 'number' | 'currency' | 'percentage' | 'ranking'
  currency?: string
  isLoading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  type = 'number',
  currency = 'VND',
  isLoading = false,
  icon: Icon,
  className,
}: KPICardProps) {
  const formatValue = (val: number | string | null) => {
    if (val === null || val === undefined) return '--'

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
        }).format(Number(val))
      case 'percentage':
        return `${Number(val).toFixed(1)}%`
      case 'ranking':
        return `#${val}`
      default:
        return typeof val === 'number' ? val.toLocaleString() : val
    }
  }

  const getTrendIcon = () => {
    if (!trend) return null

    const isPositive = trend.startsWith('+')
    const isNegative = trend.startsWith('-')

    if (isPositive) {
      return <TrendingUp className='h-3 w-3 text-green-600' />
    } else if (isNegative) {
      return <TrendingDown className='h-3 w-3 text-red-600' />
    }
    return <Minus className='h-3 w-3 text-gray-400' />
  }

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground'
    return trend.startsWith('+')
      ? 'text-green-600'
      : trend.startsWith('-')
        ? 'text-red-600'
        : 'text-muted-foreground'
  }

  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            {Icon && <Skeleton className='h-4 w-4 rounded' />}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className='mb-1 h-8 w-20' />
          <Skeleton className='h-3 w-16' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm font-medium'>{title}</p>
          {Icon && <Icon className='text-muted-foreground h-4 w-4' />}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-1'>
          <div className='flex items-baseline space-x-2'>
            <span className='text-2xl font-bold'>
              {value !== null ? formatValue(value) : '--'}
            </span>
            {trend && (
              <div
                className={cn(
                  'flex items-center space-x-1 text-xs',
                  getTrendColor()
                )}
              >
                {getTrendIcon()}
                <span>{trend}</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className='text-muted-foreground text-xs'>{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Preset KPI Cards for common metrics
export function ProductCountCard({
  value,
  trend,
  isLoading,
}: {
  value: number | null
  trend?: string
  isLoading?: boolean
}) {
  return (
    <KPICard
      title='Products Found'
      value={value}
      trend={trend}
      icon={BarChart3}
      isLoading={isLoading}
    />
  )
}

export function ConfidenceScoreCard({
  value,
  isLoading,
}: {
  value: number | null
  isLoading?: boolean
}) {
  return (
    <KPICard
      title='Analysis Confidence'
      value={value}
      type='percentage'
      icon={Target}
      isLoading={isLoading}
    />
  )
}

export function RecommendedPriceCard({
  value,
  currency,
  isLoading,
}: {
  value: number | null
  currency?: string
  isLoading?: boolean
}) {
  return (
    <KPICard
      title='Recommended Price'
      value={value}
      type='currency'
      currency={currency}
      icon={Zap}
      isLoading={isLoading}
    />
  )
}

export function MarketPositionCard({
  value,
  isLoading,
}: {
  value: number | null
  isLoading?: boolean
}) {
  return (
    <KPICard
      title='Market Position'
      value={value}
      type='ranking'
      icon={TrendingUp}
      isLoading={isLoading}
    />
  )
}
