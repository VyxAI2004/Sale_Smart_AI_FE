/**
 * Hook for project user management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProjectUserApi, type InviteProjectUserPayload } from '../api/project-user-api'
import { toast } from 'sonner'

const PROJECT_USERS_QUERY_KEY = 'project-users'

/**
 * Hook to fetch project users with invitations
 */
export const useProjectUsers = (projectId: string | undefined) => {
  return useQuery({
    queryKey: [PROJECT_USERS_QUERY_KEY, projectId],
    queryFn: async () => {
      if (!projectId) return []
      return ProjectUserApi.getProjectUsers(projectId)
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to invite user to project
 */
export const useInviteProjectUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      payload,
    }: {
      projectId: string
      payload: InviteProjectUserPayload
    }) => {
      return ProjectUserApi.inviteUser(projectId, payload)
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch project users
      queryClient.invalidateQueries({
        queryKey: [PROJECT_USERS_QUERY_KEY, variables.projectId],
      })
      // Also invalidate project members to refresh TaskAssigneeMenu
      queryClient.invalidateQueries({
        queryKey: ['project-members', variables.projectId],
      })
      toast.success('User invited successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to invite user'
      toast.error('Failed to invite user', {
        description: message,
      })
    },
  })
}

/**
 * Hook to remove user from project
 */
export const useRemoveProjectUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      userId,
    }: {
      projectId: string
      userId: string
    }) => {
      return ProjectUserApi.removeUser(projectId, userId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT_USERS_QUERY_KEY, variables.projectId],
      })
      toast.success('User removed successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.message || 'Failed to remove user'
      toast.error('Failed to remove user', {
        description: message,
      })
    },
  })
}
