import http from '@/utils/http'
import type {
  CrawlSearchRequest,
  CrawlReviewsRequest,
  CrawlReviewsResponse,
} from '../types/crawler.types'

export class ProductCrawlerApi {
  private static readonly BASE_PATH = '/products/crawler'

  /**
   * Step 1: Crawl product list from search URL
   * Returns list of product URLs found
   */
  static async crawlSearch(payload: CrawlSearchRequest): Promise<string[]> {
    const response = await http.post<string[]>(
      `${this.BASE_PATH}/search`,
      payload
    )
    return response.data
  }

  /**
   * Step 2: Crawl reviews for a specific product
   */
  static async crawlReviews(
    payload: CrawlReviewsRequest
  ): Promise<CrawlReviewsResponse> {
    const response = await http.post<CrawlReviewsResponse>(
      `${this.BASE_PATH}/reviews`,
      payload
    )
    return response.data
  }
}
