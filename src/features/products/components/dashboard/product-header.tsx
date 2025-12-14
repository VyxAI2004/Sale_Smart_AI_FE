import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  ExternalLink,
  Image,
  ArrowLeft,
  Package,
  DollarSign,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import type { Product } from '../../types/product.types';
import { formatCurrency } from '@/lib/utils';

interface ProductHeaderProps {
  product: Product | null;
  isLoading?: boolean;
}

export function ProductHeader({ 
  product, 
  isLoading = false,
}: ProductHeaderProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <div className="flex items-center gap-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Back Link */}
      <div className="mb-4">
        <Link 
          to="/projects/$projectId" 
          params={{ projectId: product.project_id }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>
      </div>

      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            {product.images && typeof product.images === 'object' && Object.keys(product.images).length > 0 ? (
              <img 
                src={Object.values(product.images)[0] as string} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Image className={`w-6 h-6 text-muted-foreground ${product.images && typeof product.images === 'object' && Object.keys(product.images).length > 0 ? 'hidden' : ''}`} />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            {/* Title & Platform */}
            <div className="flex items-center gap-3 mb-1">
              <h2 className='text-2xl font-bold tracking-tight truncate'>
                {product.name}
              </h2>
              <Badge variant="outline" className="text-sm">
                {product.platform}
              </Badge>
            </div>

            {/* Brand & Category */}
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              {product.brand && <span className="font-medium">{product.brand}</span>}
              {product.category && (
                <>
                  {product.brand && <span>•</span>}
                  <span>{product.category}</span>
                </>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold text-foreground">
                  {formatCurrency(product.current_price, product.currency || 'VND')}
                </span>
                {product.original_price && product.original_price > product.current_price && (
                  <span className="line-through text-muted-foreground">
                    {formatCurrency(product.original_price, product.currency || 'VND')}
                  </span>
                )}
              </div>

              {product.average_rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.average_rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              {product.trust_score != null && typeof product.trust_score === 'number' && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">Trust Score: {product.trust_score.toFixed(1)}</span>
                </div>
              )}

              {product.sold_count && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{product.sold_count.toLocaleString()} sold</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(product.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {product.url && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(product.url, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on {product.platform}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}



