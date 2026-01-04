/**
 * Hook to update task
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskApi } from '../api/task-api'
import type { TaskUpdate } from '../types/task.types'

const TASKS_QUERY_KEY = 'tasks'

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskUpdate }) => {
      return TaskApi.update(id, data)
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY],
      })
    },
  })
}
