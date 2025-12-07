import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrustScoreApi } from '@/apis/trust-score.api';
import type {
  ProductTrustScore,
  TrustScoreDetailResponse,
  TopTrustedProductsResponse,
  ProductsByScoreRangeResponse,
} from '@/types/trust-score.types';
import { toast } from 'sonner';

/**
 * Get trust score by product
 */
export const useTrustScore = (productId: string | undefined) => {
  return useQuery<ProductTrustScore>({
    queryKey: ['trust-score', productId],
    queryFn: () => TrustScoreApi.getByProduct(productId!),
    enabled: !!productId,
  });
};

/**
 * Get trust score detail with breakdown
 */
export const useTrustScoreDetail = (productId: string | undefined) => {
  return useQuery<TrustScoreDetailResponse>({
    queryKey: ['trust-score-detail', productId],
    queryFn: () => TrustScoreApi.getDetail(productId!),
    enabled: !!productId,
  });
};

/**
 * Calculate trust score mutation
 */
export const useCalculateTrustScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => TrustScoreApi.calculate(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trust-score', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['trust-score-detail', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['product', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Trust score calculated: ${data.trust_score.toFixed(2)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to calculate trust score');
    },
  });
};

/**
 * Delete trust score mutation
 */
export const useDeleteTrustScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => TrustScoreApi.delete(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['trust-score', productId] });
      queryClient.invalidateQueries({ queryKey: ['trust-score-detail', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success('Trust score deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete trust score');
    },
  });
};

/**
 * Get top trusted products
 */
export const useTopTrustedProducts = (params?: { project_id?: string; limit?: number }) => {
  return useQuery<TopTrustedProductsResponse>({
    queryKey: ['top-trusted-products', params],
    queryFn: () => TrustScoreApi.getTopTrusted(params),
  });
};

/**
 * Get products by score range
 */
export const useProductsByScoreRange = (params: {
  min_score: number;
  max_score: number;
  project_id?: string;
  skip?: number;
  limit?: number;
}) => {
  return useQuery<ProductsByScoreRangeResponse>({
    queryKey: ['products-by-score-range', params],
    queryFn: () => TrustScoreApi.getByScoreRange(params),
  });
};



