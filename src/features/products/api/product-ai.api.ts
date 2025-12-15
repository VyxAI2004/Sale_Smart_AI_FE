import http from '@/utils/http';
import type { ProductSearchResponse, PlatformEnum } from '../types/product-ai.types';

export class ProductAIApi {
  private static readonly BASE_PATH = '/products/ai';

  /**
   * AI search products for project
   */
  static async search(
    projectId: string,
    params?: {
      limit?: number;
      platform?: PlatformEnum;
    }
  ): Promise<ProductSearchResponse> {
    const response = await http.get<ProductSearchResponse>(
      `${this.BASE_PATH}/search/${projectId}`,
      { params }
    );
    return response.data;
  }
}
