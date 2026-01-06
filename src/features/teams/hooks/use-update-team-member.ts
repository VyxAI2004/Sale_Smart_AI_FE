import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTeamMember } from '../api/team-api'
import { TEAMS_QUERY_KEY } from './use-teams'
import type { UUID } from 'crypto'

interface UpdateMemberParams {
  teamId: UUID
  userId: UUID
  role: string
  status: string
}

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ teamId, userId, role, status }: UpdateMemberParams) => {
      return await updateTeamMember(teamId, userId, role, status)
    },
    onSuccess: () => {
      // Invalidate ALL teams queries (matches all skip/limit combinations)
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY })
    },
  })
}
