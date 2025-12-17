/**
 * Dashboard Hook - Custom hook để fetch và quản lý dashboard data
 */
import { useQuery } from '@tanstack/react-query'
import { DashboardApi } from '../api/dashboard-api'
import type { DashboardResponse } from '../types/dashboard.types'

export function useDashboard() {
  const { data, isLoading, isError, error, refetch } =
    useQuery<DashboardResponse>({
      queryKey: ['dashboard'],
      queryFn: () => DashboardApi.getDashboardData(),
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: true,
      refetchInterval: 60000, // Refetch every minute
    })

  return {
    dashboard: data || null,
    isLoading,
    isError,
    error,
    refetch,
  }
}
