import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ExternalLink,
  Star,
  TrendingUp,
  ShoppingCart,
  Package,
  Search
} from 'lucide-react'
import type { CompetitorProduct } from '../../types/project-detail.types'

interface CompetitorProductsCardProps {
  products: CompetitorProduct[] | null
  isLoading?: boolean
  onViewDetails?: (productId: string) => void
}

export function CompetitorProductsCard({ 
  products, 
  isLoading = false,
  onViewDetails 
}: CompetitorProductsCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50' 
    return 'text-red-600 bg-red-50'
  }

  const formatSimilarity = (score: number) => {
    return `${(score * 100).toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Competitor Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!products || products.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Competitor Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="font-medium text-sm mb-1">No products found</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Start crawling to collect competitor data
            </p>
            <Button size="sm" variant="outline">
              Start Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show top 5 products, sorted by similarity
  const topProducts = products
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 5)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Competitor Products
          <Badge variant="secondary" className="ml-auto">
            {products.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="max-h-96 overflow-y-auto space-y-3">
            {topProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {product.name}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="font-medium">{product.platform}</span>
                        {product.brand && (
                          <>
                            <span>•</span>
                            <span>{product.brand}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Similarity Score */}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ml-2 ${getSimilarityColor(product.similarity_score)}`}
                    >
                      {formatSimilarity(product.similarity_score)}
                    </Badge>
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">
                        {formatPrice(product.current_price, product.currency)}
                      </span>
                      
                      {product.average_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {product.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      
                      {product.review_count && product.review_count > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({product.review_count.toLocaleString()})
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-6 w-6 p-0"
                      >
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                      
                      {onViewDetails && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => onViewDetails(product.id)}
                        >
                          <TrendingUp className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > 5 && (
            <div className="pt-3 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View All Products ({products.length})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}