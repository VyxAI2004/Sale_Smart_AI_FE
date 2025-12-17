import {
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  Play,
  Database,
  Globe,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProductSource } from '../../types/project-detail.types'

interface ProductSourcesCardProps {
  sources: ProductSource[] | null
  isLoading?: boolean
  onTriggerCrawl?: (sourceId: string) => void
}

export function ProductSourcesCard({
  sources,
  isLoading = false,
  onTriggerCrawl,
}: ProductSourcesCardProps) {
  const getStatusIcon = (status: ProductSource['crawl_status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='h-4 w-4 text-green-600' />
      case 'pending':
        return <Clock className='h-4 w-4 text-yellow-600' />
      case 'failed':
        return <XCircle className='h-4 w-4 text-red-600' />
      case 'paused':
        return <Pause className='h-4 w-4 text-gray-600' />
      default:
        return <AlertCircle className='h-4 w-4 text-gray-400' />
    }
  }

  const getStatusBadge = (status: ProductSource['crawl_status']) => {
    const variants: Record<
      ProductSource['crawl_status'],
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      active: 'default',
      pending: 'secondary',
      failed: 'destructive',
      paused: 'outline',
    }

    return (
      <Badge variant={variants[status] || 'outline'} className='text-xs'>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatLastCrawl = (dateStr: string | null) => {
    if (!dateStr) return 'Never'

    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Database className='h-5 w-5' />
            Product Sources
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex items-center justify-between rounded-lg border p-3'
            >
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-48' />
              </div>
              <Skeleton className='h-6 w-16' />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!sources || sources.length === 0) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Database className='h-5 w-5' />
            Product Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Globe className='text-muted-foreground mb-3 h-12 w-12' />
            <h3 className='mb-1 text-sm font-medium'>No sources configured</h3>
            <p className='text-muted-foreground mb-4 text-xs'>
              Add product URLs to start crawling data
            </p>
            <Button size='sm' variant='outline'>
              Add Source
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Database className='h-5 w-5' />
          Product Sources
          <Badge variant='secondary' className='ml-auto'>
            {sources.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='max-h-96 space-y-3 overflow-y-auto'>
          {sources.map((source) => (
            <div
              key={source.id}
              className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors'
            >
              <div className='min-w-0 flex-1'>
                <div className='mb-1 flex items-center gap-2'>
                  {getStatusIcon(source.crawl_status)}
                  <span className='truncate text-sm font-medium'>
                    {source.product_name || 'Unnamed Source'}
                  </span>
                  {getStatusBadge(source.crawl_status)}
                </div>

                <div className='space-y-1'>
                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                    <span className='font-medium'>{source.platform}</span>
                    <span>•</span>
                    <span>Last: {formatLastCrawl(source.last_crawled_at)}</span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <a
                      href={source.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex max-w-48 items-center gap-1 truncate text-xs text-blue-600 hover:text-blue-800'
                    >
                      <ExternalLink className='h-3 w-3 flex-shrink-0' />
                      {source.url}
                    </a>
                  </div>
                </div>
              </div>

              <div className='ml-3 flex items-center gap-2'>
                {onTriggerCrawl && source.crawl_status !== 'active' && (
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => onTriggerCrawl(source.id)}
                  >
                    <Play className='h-3 w-3' />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {sources.length > 3 && (
          <div className='border-t pt-3'>
            <Button variant='ghost' size='sm' className='w-full'>
              View All Sources ({sources.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
