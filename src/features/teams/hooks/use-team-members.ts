import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UUID } from 'crypto'
import {
  createTeamUser,
  getTeamMembers,
  inviteUserToTeam,
  removeTeamMember,
  updateMemberRole,
} from '../api'
import type { ITeamInviteRequest } from '../types'

/**
 * Hook to create new user and add to team
 */
export const useCreateTeamUser = () => {
  return useMutation({
    mutationFn: (data: {
      username: string
      email: string
      full_name: string
      password: string
    }) => createTeamUser(data),
  })
}

/**
 * Hook to fetch team members
 */
export const useTeamMembers = (teamId?: UUID | null) => {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => getTeamMembers(teamId!),
    enabled: !!teamId,
  })
}

/**
 * Hook to invite user to team
 */
export const useInviteUserToTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      teamId,
      request,
    }: {
      teamId: UUID
      request: ITeamInviteRequest
    }) => inviteUserToTeam(teamId, request),
    onSuccess: (_, { teamId }) => {
      // Invalidate team members list
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] })
    },
  })
}

/**
 * Hook to remove team member
 */
export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: UUID; userId: UUID }) =>
      removeTeamMember(teamId, userId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] })
    },
  })
}

/**
 * Hook to update member role
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      teamId,
      userId,
      newRole,
    }: {
      teamId: UUID
      userId: UUID
      newRole: string
    }) => updateMemberRole(teamId, userId, newRole),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] })
    },
  })
}
