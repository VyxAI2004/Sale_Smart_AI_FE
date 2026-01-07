import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AutoDiscoveryFlowApi } from '../api/auto-discovery-flow.api'
import type {
  DiscoveryFlowState,
  DiscoveryPhase,
  FlowEvent,
  ImportedProduct,
  ReviewCountInput,
} from '../types/auto-discovery-flow.types'

const initialState: DiscoveryFlowState = {
  phase: 'search',
  searchResults: null,
  passedProducts: [],
  rejectedProducts: [],
  userConfirmContinue: null,
  reviewCounts: {},
  processingStatus: 'idle',
  productProgress: {},
  productResults: {},
  isStreaming: false,
}

/**
 * Hook to manage discovery flow state and events
 * Handles all 4 phases: search → confirm → review_form → processing
 */
export const useDiscoveryFlow = (projectId: string) => {
  const queryClient = useQueryClient()
  const [state, setState] = useState<DiscoveryFlowState>(initialState)

  // ========== Event Handlers ==========

  const handleFlowEvent = useCallback(
    (event: FlowEvent) => {
      console.log('Flow Event:', event)

      switch (event.type) {
        // Flow Start
        case 'flow_start':
          setState((prev) => ({
            ...prev,
            phase: 'processing',
            processingStatus: 'running',
            isStreaming: true,
          }))
          break

        // Review Crawl
        case 'review_crawl_progress':
          if (event.product_id) {
            const productId = String(event.product_id)
            setState((prev) => ({
              ...prev,
              productProgress: {
                ...prev.productProgress,
                [productId]: event.percentage || 0,
              },
            }))
          }
          break

        case 'review_crawl_complete':
          if (event.product_id) {
            const productId = String(event.product_id)
            setState((prev) => ({
              ...prev,
              productResults: {
                ...prev.productResults,
                [productId]: {
                  ...prev.productResults[productId],
                  total_analyzed: event.total_reviews_crawled || 0,
                },
              },
            }))
          }
          break

        // Trust Score
        case 'trust_score_progress':
          if (event.product_id) {
            const productId = String(event.product_id)
            setState((prev) => ({
              ...prev,
              productResults: {
                ...prev.productResults,
                [productId]: {
                  ...prev.productResults[productId],
                  trust_score: event.trust_score || 0,
                  trust_score_breakdown: event.breakdown,
                },
              },
            }))
          }
          break

        // Analysis
        case 'analysis_progress':
          if (event.product_id) {
            const productId = String(event.product_id)
            setState((prev) => ({
              ...prev,
              productResults: {
                ...prev.productResults,
                [productId]: {
                  ...prev.productResults[productId],
                  sentiment_distribution: event.sentiment_distribution,
                  key_insights: event.key_insights || [],
                },
              },
            }))
          }
          break

        // Task Generation
        case 'task_generation_progress':
          if (event.product_id) {
            const productId = String(event.product_id)
            setState((prev) => ({
              ...prev,
              productResults: {
                ...prev.productResults,
                [productId]: {
                  ...prev.productResults[productId],
                  tasks: event.tasks || [],
                  tasks_count: event.tasks_count || 0,
                },
              },
            }))
          }
          break

        // Flow Complete
        case 'flow_complete':
          setState((prev) => ({
            ...prev,
            processingStatus: 'complete',
            isStreaming: false,
            phase: 'complete',
          }))
          toast.success('Phân tích hoàn thành!')
          queryClient.invalidateQueries({ queryKey: ['products', projectId] })
          break

        // Error
        case 'error':
        case 'product_error':
        case 'review_crawl_error':
        case 'trust_score_error':
        case 'analysis_error':
        case 'task_generation_error':
          setState((prev) => ({
            ...prev,
            error: event.message,
            isStreaming: false,
            processingStatus: 'error',
          }))
          toast.error(event.message || 'Có lỗi xảy ra')
          break
      }
    },
    [projectId, queryClient]
  )

  // ========== Flow Control Methods ==========

  const setPhase = useCallback((phase: DiscoveryPhase) => {
    setState((prev) => ({ ...prev, phase }))
  }, [])

  const setPassedProducts = useCallback((products: ImportedProduct[]) => {
    setState((prev) => ({ ...prev, passedProducts: products }))
  }, [])

  const setRejectedProducts = useCallback((products: ImportedProduct[]) => {
    setState((prev) => ({ ...prev, rejectedProducts: products }))
  }, [])

  const confirmContinue = useCallback((shouldContinue: boolean) => {
    setState((prev) => ({
      ...prev,
      userConfirmContinue: shouldContinue,
      phase: shouldContinue ? 'review_form' : 'search',
    }))
  }, [])

  const setReviewCounts = useCallback((inputs: ReviewCountInput[]) => {
    const counts = inputs.reduce(
      (acc, input) => {
        acc[input.product_id] = input.review_count
        return acc
      },
      {} as { [productId: string]: number }
    )
    setState((prev) => ({ ...prev, reviewCounts: counts }))
  }, [])

  // ========== Start Phase 4: Processing ==========

  const startDetailedFlow = useCallback(async () => {
    if (!state.passedProducts.length) {
      toast.error('Không có sản phẩm để phân tích')
      return
    }

    const productsConfig = state.passedProducts.map((product) => ({
      product_id: product.id,
      review_count: state.reviewCounts[product.id] || 50,
    }))

    try {
      await AutoDiscoveryFlowApi.executeDetailedFlowStream(
        {
          project_id: projectId,
          products: productsConfig,
        },
        handleFlowEvent,
        (error) => {
          setState((prev) => ({
            ...prev,
            error: error.message,
            isStreaming: false,
            processingStatus: 'error',
          }))
          toast.error(error.message)
        },
        () => {
          setState((prev) => ({
            ...prev,
            isStreaming: false,
          }))
        }
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Lỗi không xác định'
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isStreaming: false,
      }))
      toast.error(errorMessage)
    }
  }, [projectId, state.passedProducts, state.reviewCounts, handleFlowEvent])

  // ========== Reset ==========

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    // State
    ...state,

    // Phase management
    setPhase,
    setPassedProducts,
    setRejectedProducts,
    confirmContinue,
    setReviewCounts,

    // Flow execution
    startDetailedFlow,

    // Reset
    reset,
  }
}
