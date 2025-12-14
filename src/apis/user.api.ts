import http from '@/utils/http'

export const getMyPermissions = () => http.get<string[]>('/users/me/permissions')





