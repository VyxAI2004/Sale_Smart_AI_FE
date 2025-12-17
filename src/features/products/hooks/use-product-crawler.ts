import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductCrawlerApi } from '../api/product-crawler.api'
import type {
  CrawlSearchRequest,
  CrawlReviewsRequest,
} from '../types/crawler.types'

/**
 * Crawl search results mutation
 */
export const useCrawlSearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CrawlSearchRequest) =>
      ProductCrawlerApi.crawlSearch(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['products', variables.project_id],
      })
      toast.success(`Found ${data.length} product URLs`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to crawl search results')
    },
  })
}

/**
 * Crawl reviews mutation
 */
export const useCrawlReviews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CrawlReviewsRequest) =>
      ProductCrawlerApi.crawlReviews(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['product', variables.product_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['reviews', variables.product_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['products', variables.product_id],
      })

      if (data.status === 'success') {
        toast.success(
          `Crawled ${data.reviews_crawled || 0} reviews successfully`
        )
      } else {
        toast.error(data.message || 'Failed to crawl reviews')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to crawl reviews')
    },
  })
}
