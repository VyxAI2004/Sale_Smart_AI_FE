import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Package,
  MessageSquare,
  Shield,
  BarChart3,
} from 'lucide-react';
import { TrustScoreCard } from '../trust-score-card';
import { ReviewsList } from '../reviews-list';
import type { Product } from '../../types/product.types';

interface ProductDetailTabsProps {
  product: Product | null;
  productId: string;
  isLoading?: boolean;
}

export function ProductDetailTabs({
  product,
  productId,
  isLoading = false,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-none lg:flex flex-wrap">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Reviews</span>
        </TabsTrigger>
        <TabsTrigger value="trust-score" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Trust Score</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
      </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Price</span>
                </div>
                <p className="text-2xl font-bold">
                  {product?.current_price 
                    ? `${product.current_price.toLocaleString()} ${product.currency || 'VND'}`
                    : 'N/A'}
                </p>
                {product?.original_price && product.original_price > (product.current_price || 0) && (
                  <p className="text-sm text-muted-foreground line-through">
                    {product.original_price.toLocaleString()} {product.currency || 'VND'}
                  </p>
                )}
              </div>

              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Reviews</span>
                </div>
                <p className="text-2xl font-bold">{product?.review_count || 0}</p>
                <p className="text-sm text-muted-foreground">
                  {product?.average_rating 
                    ? `Rating: ${product.average_rating.toFixed(1)}/5`
                    : 'No ratings yet'}
                </p>
              </div>

              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Trust Score</span>
                </div>
                <p className="text-2xl font-bold">
                  {product?.trust_score != null 
                    ? product.trust_score.toFixed(1)
                    : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product?.trust_score != null
                    ? product.trust_score >= 80
                      ? 'High Trust'
                      : product.trust_score >= 60
                        ? 'Medium Trust'
                        : 'Low Trust'
                    : 'Not calculated'}
                </p>
              </div>

              <div className="p-6 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Sold</span>
                </div>
                <p className="text-2xl font-bold">
                  {product?.sold_count?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">Units sold</p>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="p-6 border rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Product Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform</span>
                    <span className="font-medium">{product?.platform || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">{product?.brand || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product?.category || 'N/A'}</span>
                  </div>
                  {product?.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subcategory</span>
                      <span className="font-medium">{product.subcategory}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Info */}
              <div className="p-6 border rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verified</span>
                    <span className="font-medium">
                      {product?.is_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Source</span>
                    <span className="font-medium">{product?.data_source || 'N/A'}</span>
                  </div>
                  {product?.collected_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Collected</span>
                      <span className="font-medium">
                        {new Date(product.collected_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          <ReviewsList productId={productId} />
        </TabsContent>

        {/* Trust Score Tab */}
        <TabsContent value="trust-score" className="mt-6">
          <TrustScoreCard productId={productId} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Analytics data will be displayed here.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

