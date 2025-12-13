import http from '@/utils/http';
import type {
  Product,
  ProductListResponse,
  ProductCreate,
  ProductUpdate,
} from '../types/product.types';

export class ProductApi {
  private static readonly BASE_PATH = '/products';

  /**
   * Get product by ID
   */
  static async getById(id: string): Promise<Product> {
    const response = await http.get<Product>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * Create new product
   */
  static async create(payload: ProductCreate): Promise<Product> {
    const response = await http.post<Product>(this.BASE_PATH, payload);
    return response.data;
  }

  /**
   * Update product
   */
  static async update(id: string, payload: ProductUpdate): Promise<Product> {
    const response = await http.put<Product>(`${this.BASE_PATH}/${id}`, payload);
    return response.data;
  }

  /**
   * Delete product
   */
  static async delete(id: string): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Get all products in a project
   */
  static async getByProject(
    projectId: string,
    params?: {
      q?: string;
      platform?: string;
      category?: string;
      min_price?: number;
      max_price?: number;
      skip?: number;
      limit?: number;
    }
  ): Promise<ProductListResponse> {
    const response = await http.get<ProductListResponse>(
      `${this.BASE_PATH}/project/${projectId}`,
      { params }
    );
    return response.data;
  }
}

