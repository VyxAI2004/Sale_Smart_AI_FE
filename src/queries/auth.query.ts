import { queryOptions } from '@tanstack/react-query'
import { getMe } from '@/apis/auth.api'

export const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
