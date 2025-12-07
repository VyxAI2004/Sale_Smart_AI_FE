import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductApi } from '@/apis/product.api';
import type { Product, ProductCreate, ProductUpdate, ProductListResponse } from '@/types/product.types';
import { toast } from 'sonner';

/**
 * Get products by project
 */
export const useProducts = (
  projectId: string | undefined,
  params?: {
    q?: string;
    platform?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    skip?: number;
    limit?: number;
  }
) => {
  return useQuery<ProductListResponse>({
    queryKey: ['products', projectId, params],
    queryFn: () => ProductApi.getByProject(projectId!, params),
    enabled: !!projectId,
  });
};

/**
 * Get product by ID
 */
export const useProduct = (productId: string | undefined) => {
  return useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => ProductApi.getById(productId!),
    enabled: !!productId,
  });
};

/**
 * Create product mutation
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductCreate) => ProductApi.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products', data.project_id] });
      toast.success('Product created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

/**
 * Update product mutation
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductUpdate }) =>
      ProductApi.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      queryClient.invalidateQueries({ queryKey: ['products', data.project_id] });
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

/**
 * Delete product mutation
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      ProductApi.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.projectId] });
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
};



