import { useState, useEffect, useCallback } from 'react'
import { getMyPermissions } from '@/apis/user.api'
import { getGlobalPermissionsFromToken } from '@/utils/jwt'

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true)
    try {
      // First try to get from token (faster)
      const tokenPermissions = getGlobalPermissionsFromToken()
      if (tokenPermissions.length > 0) {
        setPermissions(tokenPermissions)
        setIsLoading(false)
        return
      }

      // If not in token, fetch from API
      const response = await getMyPermissions()
      setPermissions(response.data || [])
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
      // Fallback to token permissions
      const tokenPermissions = getGlobalPermissionsFromToken()
      setPermissions(tokenPermissions)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchPermissions()
  }, [fetchPermissions])

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return permissions.includes(permission)
    },
    [permissions]
  )

  const hasAnyPermission = useCallback(
    (permissionList: string[]): boolean => {
      return permissionList.some((perm) => permissions.includes(perm))
    },
    [permissions]
  )

  return {
    permissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    refetch: fetchPermissions,
  }
}





