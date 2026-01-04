/**
 * Custom hooks for Product Member management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductMemberApi, type ProductMemberResponse, type ProductInvitePayload } from '../api/product-member-api'
import type { UUID } from 'crypto'

const PRODUCT_MEMBERS_QUERY_KEY = 'product-members'

/**
 * Hook to fetch product members
 */
export const useProductMembers = (productId: string | undefined, options?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: [PRODUCT_MEMBERS_QUERY_KEY, productId, options],
    queryFn: async () => {
      if (!productId) return []
      return ProductMemberApi.getMembers(productId, options)
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to invite user to product
 */
export const useInviteToProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      payload,
    }: {
      productId: string
      payload: ProductInvitePayload
    }) => {
      return ProductMemberApi.invite(productId, payload)
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch product members
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_MEMBERS_QUERY_KEY, variables.productId],
      })
    },
  })
}

/**
 * Hook to update product member role
 */
export const useUpdateProductMemberRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      userId,
      role_id,
      permissions,
    }: {
      productId: string
      userId: string
      role_id?: UUID
      permissions?: Record<string, any>
    }) => {
      return ProductMemberApi.updateMemberRole(productId, userId, {
        role_id,
        permissions,
      })
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_MEMBERS_QUERY_KEY, variables.productId],
      })
    },
  })
}

/**
 * Hook to remove product member
 */
export const useRemoveProductMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, userId }: { productId: string; userId: string }) => {
      return ProductMemberApi.removeMember(productId, userId)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_MEMBERS_QUERY_KEY, variables.productId],
      })
    },
  })
}
