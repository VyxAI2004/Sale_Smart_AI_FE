import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import { ProductsTable } from './products-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Download } from 'lucide-react';
import { ProductsTableSkeleton } from './products-table-skeleton';

interface ProductsListProps {
  projectId: string;
  onViewProduct?: (productId: string) => void;
}

export function ProductsList({ projectId, onViewProduct }: ProductsListProps) {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [skip, setSkip] = useState(0);
  const limit = 20;

  const { data, isLoading, error, refetch } = useProducts(projectId, {
    q: search || undefined,
    platform: platform || undefined,
    category: category || undefined,
    skip,
    limit,
  });

  const handleView = (product: { id: string }) => {
    if (onViewProduct) {
      onViewProduct(product.id);
    }
  };

  if (!projectId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Project ID is required to load products
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-destructive font-medium">
              Error loading products
            </div>
            <div className="text-sm text-muted-foreground">
              {(error as Error).message || 'Unknown error occurred'}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage and view products in this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSkip(0);
                  }}
                  className="pl-8"
                />
              </div>
              <Select value={platform || "all"} onValueChange={(value) => {
                setPlatform(value === "all" ? "" : value);
                setSkip(0);
              }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="shopee">Shopee</SelectItem>
                  <SelectItem value="lazada">Lazada</SelectItem>
                  <SelectItem value="tiki">Tiki</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category || "all"} onValueChange={(value) => {
                setCategory(value === "all" ? "" : value);
                setSkip(0);
              }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Living</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <ProductsTableSkeleton />
      ) : (
        <>
          <ProductsTable
            products={data?.items || []}
            projectId={projectId}
            onView={handleView}
          />
          {data && data.total > limit && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {skip + 1} to {Math.min(skip + limit, data.total)} of {data.total} products
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSkip(Math.max(0, skip - limit))}
                  disabled={skip === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSkip(skip + limit)}
                  disabled={skip + limit >= data.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}



