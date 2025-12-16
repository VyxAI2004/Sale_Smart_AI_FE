import http from '@/utils/http';
import type { ProductAnalyticsResponse } from '../types/analytics.types';

export class ProductAnalyticsApi {
  private static readonly BASE_PATH = '/products';

  /**
   * Get analytics for a product (LLM analysis based on reviews and trust score)
   */
  static async getByProduct(productId: string): Promise<ProductAnalyticsResponse> {
    const response = await http.get<ProductAnalyticsResponse>(
      `${this.BASE_PATH}/${productId}/analytics`
    );
    return response.data;
  }
}
