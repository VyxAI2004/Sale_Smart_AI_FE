import http from '@/utils/http'
import type {
  ProductReview,
  ProductReviewListResponse,
  ProductReviewCreate,
  ProductReviewUpdate,
  ReviewStatisticsResponse,
} from '../types/review.types'

export class ProductReviewApi {
  private static readonly BASE_PATH = '/products'

  /**
   * Get all reviews for a product
   */
  static async getByProduct(
    productId: string,
    params?: {
      platform?: string
      include_analysis?: boolean
      skip?: number
      limit?: number
    }
  ): Promise<ProductReviewListResponse> {
    const response = await http.get<ProductReviewListResponse>(
      `${this.BASE_PATH}/${productId}/reviews`,
      { params }
    )
    return response.data
  }

  /**
   * Get review statistics
   */
  static async getStatistics(
    productId: string
  ): Promise<ReviewStatisticsResponse> {
    const response = await http.get<ReviewStatisticsResponse>(
      `${this.BASE_PATH}/${productId}/reviews/statistics`
    )
    return response.data
  }

  /**
   * Get unanalyzed reviews
   */
  static async getUnanalyzed(
    productId: string,
    limit?: number
  ): Promise<{
    product_id: string
    unanalyzed_count: number
    reviews: ProductReview[]
  }> {
    const response = await http.get<{
      product_id: string
      unanalyzed_count: number
      reviews: ProductReview[]
    }>(
      `${this.BASE_PATH}/${productId}/reviews/unanalyzed`,
      { params: { limit } }
    )
    return response.data
  }

  /**
   * Get review detail
   */
  static async getById(
    productId: string,
    reviewId: string
  ): Promise<ProductReview> {
    const response = await http.get<ProductReview>(
      `${this.BASE_PATH}/${productId}/reviews/${reviewId}`
    )
    return response.data
  }

  /**
   * Create review
   */
  static async create(
    productId: string,
    payload: ProductReviewCreate
  ): Promise<ProductReview> {
    const response = await http.post<ProductReview>(
      `${this.BASE_PATH}/${productId}/reviews`,
      payload
    )
    return response.data
  }

  /**
   * Update review
   */
  static async update(
    productId: string,
    reviewId: string,
    payload: ProductReviewUpdate
  ): Promise<ProductReview> {
    const response = await http.put<ProductReview>(
      `${this.BASE_PATH}/${productId}/reviews/${reviewId}`,
      payload
    )
    return response.data
  }

  /**
   * Delete review
   */
  static async delete(productId: string, reviewId: string): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${productId}/reviews/${reviewId}`)
  }

  /**
   * Get review analysis
   */
  static async getAnalysis(productId: string, reviewId: string) {
    const response = await http.get(
      `${this.BASE_PATH}/${productId}/reviews/${reviewId}/analysis`
    )
    return response.data
  }

  /**
   * Analyze all reviews for a product (spam detection)
   */
  static async analyzeProductReviews(productId: string): Promise<{
    product_id: string
    analyses_created: number
    trust_score: number | null
    message: string
  }> {
    const response = await http.post<{
      product_id: string
      analyses_created: number
      trust_score: number | null
      message: string
    }>(
      `${this.BASE_PATH}/${productId}/reviews/analyze`
    )
    return response.data
  }
}
