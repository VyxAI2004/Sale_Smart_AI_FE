/**
 * Hook to fetch project members
 */
import { useQuery } from '@tanstack/react-query'
import { ProjectApi } from '../api/project-api'

const PROJECT_MEMBERS_QUERY_KEY = 'project-members'

export const useProjectMembers = (projectId: string | undefined) => {
  return useQuery({
    queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
    queryFn: async () => {
      if (!projectId) return []
      return ProjectApi.getMembers(projectId)
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
