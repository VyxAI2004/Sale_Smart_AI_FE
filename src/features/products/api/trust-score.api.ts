import http from '@/utils/http';
import type {
  ProductTrustScore,
  TrustScoreDetailResponse,
  TopTrustedProductsResponse,
  ProductsByScoreRangeResponse,
} from '../types/trust-score.types';

export class TrustScoreApi {
  private static readonly BASE_PATH = '/products';

  /**
   * Get trust score for a product
   */
  static async getByProduct(productId: string): Promise<ProductTrustScore> {
    const response = await http.get<ProductTrustScore>(
      `${this.BASE_PATH}/${productId}/trust-score`
    );
    return response.data;
  }

  /**
   * Get trust score detail with breakdown
   */
  static async getDetail(productId: string): Promise<TrustScoreDetailResponse> {
    const response = await http.get<TrustScoreDetailResponse>(
      `${this.BASE_PATH}/${productId}/trust-score/detail`
    );
    return response.data;
  }

  /**
   * Calculate trust score for a product
   */
  static async calculate(productId: string): Promise<ProductTrustScore> {
    const response = await http.post<ProductTrustScore>(
      `${this.BASE_PATH}/${productId}/trust-score/calculate`
    );
    return response.data;
  }

  /**
   * Delete trust score
   */
  static async delete(productId: string): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${productId}/trust-score`);
  }

  /**
   * Get top trusted products
   */
  static async getTopTrusted(params?: {
    project_id?: string;
    limit?: number;
  }): Promise<TopTrustedProductsResponse> {
    const response = await http.get<TopTrustedProductsResponse>(
      `${this.BASE_PATH}/top-trusted`,
      { params }
    );
    return response.data;
  }

  /**
   * Get products by score range
   */
  static async getByScoreRange(params: {
    min_score: number;
    max_score: number;
    project_id?: string;
    skip?: number;
    limit?: number;
  }): Promise<ProductsByScoreRangeResponse> {
    const response = await http.get<ProductsByScoreRangeResponse>(
      `${this.BASE_PATH}/by-score-range`,
      { params }
    );
    return response.data;
  }
}

