import http from '@/utils/http'
import type { TUser } from '@/types/auth.type'

export const getMyPermissions = () => http.get<string[]>('/users/me/permissions')

export const getMyProfile = () => http.get<TUser>('/users/me')

export const updateMyProfile = (data: Partial<TUser>) => 
  http.patch<TUser>('/users/me', data)





