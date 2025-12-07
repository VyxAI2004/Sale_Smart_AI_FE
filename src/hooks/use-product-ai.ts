import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductAIApi } from '@/apis/product-ai.api';
import type { ProductSearchResponse, PlatformEnum } from '@/types/product-ai.types';
import { toast } from 'sonner';

/**
 * AI search products for project (query - auto fetch)
 */
export const useProductAISearch = (
  projectId: string | undefined,
  params?: {
    limit?: number;
    platform?: PlatformEnum;
  }
) => {
  return useQuery<ProductSearchResponse>({
    queryKey: ['product-ai-search', projectId, params],
    queryFn: () => ProductAIApi.search(projectId!, params),
    enabled: !!projectId,
  });
};

/**
 * AI search products mutation (for button click)
 */
export const useProductAISearchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      params,
    }: {
      projectId: string;
      params?: {
        limit?: number;
        platform?: PlatformEnum;
      };
    }) => ProductAIApi.search(projectId, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-ai-search', data.project_info.id] });
      queryClient.invalidateQueries({ queryKey: ['products', data.project_info.id] });
      toast.success(`Found ${data.total_found} products using AI`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to search products with AI');
    },
  });
};



