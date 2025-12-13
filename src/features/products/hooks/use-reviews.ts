import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductReviewApi } from '../api/product-review.api';
import type {
  ProductReview,
  ProductReviewListResponse,
  ProductReviewCreate,
  ProductReviewUpdate,
  ReviewStatisticsResponse,
} from '../types/review.types';
import { toast } from 'sonner';

/**
 * Get reviews by product
 */
export const useReviews = (
  productId: string | undefined,
  params?: {
    platform?: string;
    include_analysis?: boolean;
    skip?: number;
    limit?: number;
  }
) => {
  return useQuery<ProductReviewListResponse>({
    queryKey: ['reviews', productId, params],
    queryFn: () => ProductReviewApi.getByProduct(productId!, params),
    enabled: !!productId,
  });
};

/**
 * Get review statistics
 */
export const useReviewStatistics = (productId: string | undefined) => {
  return useQuery<ReviewStatisticsResponse>({
    queryKey: ['review-statistics', productId],
    queryFn: () => ProductReviewApi.getStatistics(productId!),
    enabled: !!productId,
  });
};

/**
 * Get unanalyzed reviews
 */
export const useUnanalyzedReviews = (productId: string | undefined, limit?: number) => {
  return useQuery({
    queryKey: ['unanalyzed-reviews', productId, limit],
    queryFn: () => ProductReviewApi.getUnanalyzed(productId!, limit),
    enabled: !!productId,
  });
};

/**
 * Get review by ID
 */
export const useReview = (productId: string | undefined, reviewId: string | undefined) => {
  return useQuery<ProductReview>({
    queryKey: ['review', productId, reviewId],
    queryFn: () => ProductReviewApi.getById(productId!, reviewId!),
    enabled: !!productId && !!reviewId,
  });
};

/**
 * Analyze product reviews mutation
 */
export const useAnalyzeProductReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => ProductReviewApi.analyzeProductReviews(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['trust-score', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['trust-score-detail', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['product', data.product_id] });
      toast.success(data.message || `Analyzed ${data.analyses_created} reviews`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to analyze reviews');
    },
  });
};

/**
 * Create review mutation
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: ProductReviewCreate }) =>
      ProductReviewApi.create(productId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics', variables.productId] });
      toast.success('Review created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create review');
    },
  });
};

/**
 * Update review mutation
 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reviewId,
      payload,
    }: {
      productId: string;
      reviewId: string;
      payload: ProductReviewUpdate;
    }) => ProductReviewApi.update(productId, reviewId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['review', variables.productId, variables.reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update review');
    },
  });
};

/**
 * Delete review mutation
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewId }: { productId: string; reviewId: string }) =>
      ProductReviewApi.delete(productId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics', variables.productId] });
      toast.success('Review deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });
};


