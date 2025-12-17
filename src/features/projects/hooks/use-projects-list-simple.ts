/**
 * Hook for managing projects list data and operations - Simple version
 */
import { useState, useEffect } from 'react'
import type { ProjectApiResponse } from '../api/project-api'
import { ProjectService } from '../services/project-service'

export const useProjectsList = () => {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await ProjectService.listProjects({
          skip: 0,
          limit: 10,
        })
        setProjects(response.items || [])
        setTotal(response.total || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, []) // Empty dependency array - only run once

  const refresh = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await ProjectService.listProjects({ skip: 0, limit: 10 })
      setProjects(response.items || [])
      setTotal(response.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    projects,
    total,
    isLoading,
    error,
    refresh,
    currentPage: 1,
    totalPages: Math.ceil(total / 10),
  }
}
