import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Pause,
  Play,
  Database,
  Globe
} from 'lucide-react'
import type { ProductSource } from '../../types/project-detail.types'

interface ProductSourcesCardProps {
  sources: ProductSource[] | null
  isLoading?: boolean
  onTriggerCrawl?: (sourceId: string) => void
}

export function ProductSourcesCard({ 
  sources, 
  isLoading = false,
  onTriggerCrawl 
}: ProductSourcesCardProps) {
  const getStatusIcon = (status: ProductSource['crawl_status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'paused':
        return <Pause className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: ProductSource['crawl_status']) => {
    const variants: Record<ProductSource['crawl_status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary', 
      failed: 'destructive',
      paused: 'outline'
    }
    
    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Product Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!sources || sources.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Product Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Globe className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="font-medium text-sm mb-1">No sources configured</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Add product URLs to start crawling data
            </p>
            <Button size="sm" variant="outline">
              Add Source
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Product Sources
          <Badge variant="secondary" className="ml-auto">
            {sources.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-96 overflow-y-auto space-y-3">
          {sources.map((source) => (
            <div 
              key={source.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(source.crawl_status)}
                  <span className="font-medium text-sm truncate">
                    {source.product_name || 'Unnamed Source'}
                  </span>
                  {getStatusBadge(source.crawl_status)}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{source.platform}</span>
                    <span>•</span>
                    <span>Last: {formatLastCrawl(source.last_crawled_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate max-w-48"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      {source.url}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-3">
                {onTriggerCrawl && source.crawl_status !== 'active' && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onTriggerCrawl(source.id)}
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {sources.length > 3 && (
          <div className="pt-3 border-t">
            <Button variant="ghost" size="sm" className="w-full">
              View All Sources ({sources.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}