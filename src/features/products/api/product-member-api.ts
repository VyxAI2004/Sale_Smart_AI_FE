/**
 * Product Member API Client - handles direct API calls for product member management
 */
import http from '@/utils/http'
import type { UUID } from 'crypto'

export interface ProductMemberResponse {
  id: UUID
  product_id: UUID
  user_id: UUID
  user_name?: string
  user_email?: string
  user_avatar?: string
  role_id?: UUID
  role_name?: string
  is_active: boolean
  invited_at?: string
  invited_by_name?: string
}

export interface ProductInvitePayload {
  user_email: string
  role_id?: UUID
  permissions?: Record<string, any>
}

export interface ProductMemberUpdatePayload {
  role_id?: UUID
  permissions?: Record<string, any>
  is_active?: boolean
}

export class ProductMemberApi {
  private static readonly BASE_PATH = '/products'

  /**
   * Invite user to product
   */
  static async invite(
    productId: string,
    payload: ProductInvitePayload
  ): Promise<ProductMemberResponse> {
    const response = await http.post<ProductMemberResponse>(
      `${this.BASE_PATH}/${productId}/invite`,
      payload
    )
    return response.data
  }

  /**
   * Get product members
   */
  static async getMembers(
    productId: string,
    params?: {
      skip?: number
      limit?: number
    }
  ): Promise<ProductMemberResponse[]> {
    const response = await http.get<ProductMemberResponse[]>(
      `${this.BASE_PATH}/${productId}/members`,
      { params }
    )
    return response.data || []
  }

  /**
   * Update product member role
   */
  static async updateMemberRole(
    productId: string,
    userId: string,
    payload: ProductMemberUpdatePayload
  ): Promise<ProductMemberResponse> {
    const response = await http.patch<ProductMemberResponse>(
      `${this.BASE_PATH}/${productId}/members/${userId}/role`,
      payload
    )
    return response.data
  }

  /**
   * Remove user from product
   */
  static async removeMember(
    productId: string,
    userId: string
  ): Promise<void> {
    await http.delete(
      `${this.BASE_PATH}/${productId}/members/${userId}`
    )
  }
}
