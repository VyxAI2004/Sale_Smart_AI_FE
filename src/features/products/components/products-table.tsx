import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ExternalLink, Star, TrendingUp, Download } from 'lucide-react';
import type { Product } from '@/types/product.types';
import { useDeleteProduct } from '@/hooks/use-products';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';

interface ProductsTableProps {
  products: Product[];
  projectId: string;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export function ProductsTable({ products, projectId, onView, onEdit }: ProductsTableProps) {
  const deleteProduct = useDeleteProduct();
  const navigate = useNavigate();

  const handleDelete = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      await deleteProduct.mutateAsync({
        id: product.id,
        projectId: product.project_id,
      });
    }
  };

  const getPlatformBadgeVariant = (platform: string | null | undefined) => {
    if (!platform) return 'default';
    switch (platform.toLowerCase()) {
      case 'shopee':
        return 'default';
      case 'lazada':
        return 'secondary';
      case 'tiki':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Trust Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{product.name}</span>
                    {product.brand && (
                      <span className="text-xs text-muted-foreground">{product.brand}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getPlatformBadgeVariant(product.platform)}>
                    {product.platform || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {formatCurrency(product.current_price || 0, product.currency || 'VND')}
                    </span>
                    {product.original_price && product.original_price > (product.current_price || 0) && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.original_price, product.currency || 'VND')}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {product.average_rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.average_rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{product.review_count || 0}</TableCell>
                <TableCell>
                  {product.trust_score !== undefined ? (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">{product.trust_score.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(product)}>
                          View Details
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(product)}>Edit</DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => product.url && window.open(product.url, '_blank')}
                        className="flex items-center gap-2"
                        disabled={!product.url}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open on {product.platform || 'platform'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate({ 
                          to: '/products/$productId/crawl', 
                          params: { productId: product.id } 
                        })}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Crawl Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(product)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}



