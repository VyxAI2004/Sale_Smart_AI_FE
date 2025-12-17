import http from '@/utils/http'
import type {
  ReviewAnalysis,
  ReviewAnalysisListResponse,
  ReviewAnalysisCreate,
  ReviewAnalysisUpdate,
  AnalysisStatisticsResponse,
} from '../types/review.types'

export class ReviewAnalysisApi {
  private static readonly BASE_PATH = '/products'

  /**
   * Get all analyses for a product
   */
  static async getByProduct(
    productId: string,
    params?: {
      sentiment_label?: 'positive' | 'negative' | 'neutral'
      is_spam?: boolean
      skip?: number
      limit?: number
    }
  ): Promise<ReviewAnalysisListResponse> {
    const response = await http.get<ReviewAnalysisListResponse>(
      `${this.BASE_PATH}/${productId}/analyses`,
      { params }
    )
    return response.data
  }

  /**
   * Get analysis statistics
   */
  static async getStatistics(
    productId: string
  ): Promise<AnalysisStatisticsResponse> {
    const response = await http.get<AnalysisStatisticsResponse>(
      `${this.BASE_PATH}/${productId}/analyses/statistics`
    )
    return response.data
  }

  /**
   * Get analysis detail
   */
  static async getById(
    productId: string,
    analysisId: string
  ): Promise<ReviewAnalysis> {
    const response = await http.get<ReviewAnalysis>(
      `${this.BASE_PATH}/${productId}/analyses/${analysisId}`
    )
    return response.data
  }

  /**
   * Create analysis
   */
  static async create(
    productId: string,
    payload: ReviewAnalysisCreate
  ): Promise<ReviewAnalysis> {
    const response = await http.post<ReviewAnalysis>(
      `${this.BASE_PATH}/${productId}/analyses`,
      payload
    )
    return response.data
  }

  /**
   * Bulk create analyses
   */
  static async bulkCreate(
    productId: string,
    payload: ReviewAnalysisCreate[]
  ): Promise<{
    created: number
    items: ReviewAnalysis[]
  }> {
    const response = await http.post<{
      created: number
      items: ReviewAnalysis[]
    }>(
      `${this.BASE_PATH}/${productId}/analyses/bulk`,
      payload
    )
    return response.data
  }

  /**
   * Update analysis
   */
  static async update(
    productId: string,
    analysisId: string,
    payload: ReviewAnalysisUpdate
  ): Promise<ReviewAnalysis> {
    const response = await http.put<ReviewAnalysis>(
      `${this.BASE_PATH}/${productId}/analyses/${analysisId}`,
      payload
    )
    return response.data
  }

  /**
   * Delete analysis
   */
  static async delete(productId: string, analysisId: string): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${productId}/analyses/${analysisId}`)
  }
}
