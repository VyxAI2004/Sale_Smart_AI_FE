/**
 * Custom hooks for Task Collaborator management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TaskCollaboratorApi, type TaskCollaboratorResponse, type TaskInvitePayload } from '../api/task-collaborator-api'
import type { UUID } from 'crypto'

const TASK_COLLABORATORS_QUERY_KEY = 'task-collaborators'

/**
 * Hook to fetch task collaborators
 */
export const useTaskCollaborators = (taskId: string | undefined, options?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: [TASK_COLLABORATORS_QUERY_KEY, taskId, options],
    queryFn: async () => {
      if (!taskId) return []
      return TaskCollaboratorApi.getCollaborators(taskId, options)
    },
    enabled: !!taskId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to invite user as task collaborator
 */
export const useInviteTaskCollaborator = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      taskId,
      payload,
    }: {
      taskId: string
      payload: TaskInvitePayload
    }) => {
      return TaskCollaboratorApi.invite(taskId, payload)
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch task collaborators
      queryClient.invalidateQueries({
        queryKey: [TASK_COLLABORATORS_QUERY_KEY, variables.taskId],
      })
    },
  })
}

/**
 * Hook to update task collaborator role
 */
export const useUpdateTaskCollaborator = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      taskId,
      userId,
      role,
      permissions,
    }: {
      taskId: string
      userId: string
      role?: string
      permissions?: Record<string, any>
    }) => {
      return TaskCollaboratorApi.updateCollaborator(taskId, userId, {
        role,
        permissions,
      })
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [TASK_COLLABORATORS_QUERY_KEY, variables.taskId],
      })
    },
  })
}

/**
 * Hook to remove task collaborator
 */
export const useRemoveTaskCollaborator = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, userId }: { taskId: string; userId: string }) => {
      return TaskCollaboratorApi.removeCollaborator(taskId, userId)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [TASK_COLLABORATORS_QUERY_KEY, variables.taskId],
      })
    },
  })
}
