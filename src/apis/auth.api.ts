import type { TLoginPayload, TLoginResponse, TUser } from '@/types/auth.type'
import http from '@/utils/http'

export const login = (body: TLoginPayload) =>
  http.post<TLoginResponse>('/auth/login', body)

export const getMe = () => http.get<TUser>('/auth/me')

export const logout = () => http.post('/auth/logout')
