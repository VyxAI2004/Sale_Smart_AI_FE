/**
 * Types for Product Member Management
 */
import type { UUID } from 'crypto'

export interface ProductMember {
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

export interface ProductInvite {
  user_email: string
  role_id?: UUID
  permissions?: Record<string, any>
}

export type ProductMemberRole = 'owner' | 'editor' | 'viewer'
