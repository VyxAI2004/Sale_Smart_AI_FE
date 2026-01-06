import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyTeams, createTeam, deleteTeam, updateTeam } from '../api'
import type { ITeamCreate, ITeamUpdate } from '../types'

export const TEAMS_QUERY_KEY = ['teams']

/**
 * Hook to fetch user's teams
 */
export const useTeams = (skip = 0, limit = 10) => {
  return useQuery({
    queryKey: [...TEAMS_QUERY_KEY, skip, limit],
    queryFn: () => getMyTeams(skip, limit),
    select: (response) => response.items,
  })
}

/**
 * Hook to create a new team
 */
export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ITeamCreate) => createTeam(data),
    onSuccess: () => {
      // Invalidate teams list to refetch
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY })
    },
  })
}

/**
 * Hook to update team
 */
export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: ITeamUpdate }) =>
      updateTeam(teamId as any, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY })
    },
  })
}

/**
 * Hook to delete team
 */
export const useDeleteTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY })
    },
  })
}
