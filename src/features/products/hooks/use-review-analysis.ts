import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewAnalysisApi } from '../api/review-analysis.api';
import type {
  ReviewAnalysis,
  ReviewAnalysisListResponse,
  ReviewAnalysisCreate,
  ReviewAnalysisUpdate,
  AnalysisStatisticsResponse,
} from '../types/review.types';
import { toast } from 'sonner';

/**
 * Get analyses by product
 */
export const useReviewAnalyses = (
  productId: string | undefined,
  params?: {
    sentiment_label?: 'positive' | 'negative' | 'neutral';
    is_spam?: boolean;
    skip?: number;
    limit?: number;
  }
) => {
  return useQuery<ReviewAnalysisListResponse>({
    queryKey: ['review-analyses', productId, params],
    queryFn: () => ReviewAnalysisApi.getByProduct(productId!, params),
    enabled: !!productId,
  });
};

/**
 * Get analysis statistics
 */
export const useAnalysisStatistics = (productId: string | undefined) => {
  return useQuery<AnalysisStatisticsResponse>({
    queryKey: ['analysis-statistics', productId],
    queryFn: () => ReviewAnalysisApi.getStatistics(productId!),
    enabled: !!productId,
  });
};

/**
 * Get analysis by ID
 */
export const useReviewAnalysis = (productId: string | undefined, analysisId: string | undefined) => {
  return useQuery<ReviewAnalysis>({
    queryKey: ['review-analysis', productId, analysisId],
    queryFn: () => ReviewAnalysisApi.getById(productId!, analysisId!),
    enabled: !!productId && !!analysisId,
  });
};

/**
 * Create analysis mutation
 */
export const useCreateAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: ReviewAnalysisCreate }) =>
      ReviewAnalysisApi.create(productId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['review-analyses', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['analysis-statistics', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Analysis created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create analysis');
    },
  });
};

/**
 * Bulk create analyses mutation
 */
export const useBulkCreateAnalyses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: ReviewAnalysisCreate[];
    }) => ReviewAnalysisApi.bulkCreate(productId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['review-analyses', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['analysis-statistics', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success(`Created ${data.created} analyses successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create analyses');
    },
  });
};

/**
 * Update analysis mutation
 */
export const useUpdateAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      analysisId,
      payload,
    }: {
      productId: string;
      analysisId: string;
      payload: ReviewAnalysisUpdate;
    }) => ReviewAnalysisApi.update(productId, analysisId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['review-analysis', variables.productId, variables.analysisId] });
      queryClient.invalidateQueries({ queryKey: ['review-analyses', variables.productId] });
      toast.success('Analysis updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update analysis');
    },
  });
};

/**
 * Delete analysis mutation
 */
export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, analysisId }: { productId: string; analysisId: string }) =>
      ReviewAnalysisApi.delete(productId, analysisId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['review-analyses', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['analysis-statistics', variables.productId] });
      toast.success('Analysis deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete analysis');
    },
  });
};

