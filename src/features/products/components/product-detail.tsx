import { useProduct } from '../hooks/use-products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, TrendingUp, Package, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-4 w-[200px] mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            {error ? `Error: ${(error as Error).message}` : 'Product not found'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription className="mt-2">
                {product.brand && <span className="font-medium">{product.brand}</span>}
                {product.category && (
                  <span className="ml-2 text-muted-foreground">{product.category}</span>
                )}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {product.platform}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <DollarSign className="h-5 w-5" />
                  {formatCurrency(product.current_price, product.currency || 'VND')}
                </div>
                {product.original_price && product.original_price > product.current_price && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.original_price, product.currency || 'VND')}
                  </div>
                )}
                {product.discount_rate && (
                  <Badge variant="destructive" className="mt-1">
                    -{product.discount_rate}%
                  </Badge>
                )}
              </div>

              {product.average_rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{product.average_rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              {product.trust_score != null && typeof product.trust_score === 'number' && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-lg font-semibold">Trust Score: {product.trust_score.toFixed(1)}</span>
                </div>
              )}

              {product.sold_count && (
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="text-sm text-muted-foreground">
                    {product.sold_count.toLocaleString()} sold
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {product.features && (
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {product.features}
                  </p>
                </div>
              )}

              {product.specifications && (
                <div>
                  <h4 className="font-semibold mb-2">Specifications</h4>
                  <div className="text-sm space-y-1">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => window.open(product.url, '_blank')}
                className="w-full"
                variant="outline"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on {product.platform}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



