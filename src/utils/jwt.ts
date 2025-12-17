/**
 * Utility functions for JWT token decoding and role checking
 */

interface JWTPayload {
  sub: string
  email: string
  roles: string[]
  global_permissions?: string[]
  project_permissions?: Record<string, string[]>
  exp: number
  iat?: number
  type?: string
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This does NOT verify the token signature. For production, always verify on backend.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Get user ID from access token
 */
export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('accessToken')
  if (!token) return null

  const payload = decodeJWT(token)
  return payload?.sub || null
}

/**
 * Get roles from access token
 */
export function getRolesFromToken(): string[] {
  const token = localStorage.getItem('accessToken')
  if (!token) return []

  const payload = decodeJWT(token)
  return payload?.roles || []
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(): boolean {
  const roles = getRolesFromToken()
  return roles.includes('super_admin')
}

/**
 * Check if user has specific role
 */
export function hasRole(role: string): boolean {
  const roles = getRolesFromToken()
  return roles.includes(role)
}

/**
 * Get global permissions from token
 */
export function getGlobalPermissionsFromToken(): string[] {
  const token = localStorage.getItem('accessToken')
  if (!token) return []

  const payload = decodeJWT(token)
  return payload?.global_permissions || []
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permission: string): boolean {
  const permissions = getGlobalPermissionsFromToken()
  return permissions.includes(permission)
}
