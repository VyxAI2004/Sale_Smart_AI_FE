/**
 * Hook for managing projects list data and operations
 */
import { useState, useEffect, useCallback } from 'react'
import type { ProjectApiResponse } from '../api/project-api'
import { ProjectService } from '../services/project-service'

export interface ProjectsListState {
  projects: ProjectApiResponse[]
  total: number
  isLoading: boolean
  error: string | null
}

export interface ProjectsListFilters {
  skip?: number
  limit?: number
  q?: string
  status?: string
  created_by?: string
  assigned_to?: string
  pipeline_type?: string
  target_product_category?: string
}

export const useProjectsList = () => {
  const [state, setState] = useState<ProjectsListState>({
    projects: [],
    total: 0,
    isLoading: true,
    error: null,
  })

  const [filters, setFilters] = useState<ProjectsListFilters>({
    skip: 0,
    limit: 10,
  })

  // Fetch projects data
  const fetchProjects = useCallback(
    async (currentFilters?: ProjectsListFilters) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const filtersToUse = currentFilters || { skip: 0, limit: 10 }
        const response = await ProjectService.listProjects(filtersToUse)

        setState((prev) => ({
          ...prev,
          projects: response.items || [],
          total: response.total || 0,
          isLoading: false,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Failed to load projects',
        }))
      }
    },
    []
  )

  // Initialize data on mount
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Update filters and refetch
  const updateFilters = useCallback(
    (newFilters: Partial<ProjectsListFilters>) => {
      const updatedFilters = { ...filters, ...newFilters }
      setFilters(updatedFilters)
      fetchProjects(updatedFilters)
    },
    [filters, fetchProjects]
  )

  // Refresh data
  const refresh = useCallback(() => {
    fetchProjects()
  }, [fetchProjects])

  // Pagination helpers
  const goToPage = useCallback(
    (page: number) => {
      const skip = (page - 1) * (filters.limit || 10)
      updateFilters({ skip })
    },
    [updateFilters, filters.limit]
  )

  const changePageSize = useCallback(
    (limit: number) => {
      updateFilters({ limit, skip: 0 })
    },
    [updateFilters]
  )

  // Search
  const search = useCallback(
    (q: string) => {
      updateFilters({ q, skip: 0 })
    },
    [updateFilters]
  )

  // Filter by status
  const filterByStatus = useCallback(
    (status: string | undefined) => {
      updateFilters({ status, skip: 0 })
    },
    [updateFilters]
  )

  // Filter by category
  const filterByCategory = useCallback(
    (category: string | undefined) => {
      updateFilters({ target_product_category: category, skip: 0 })
    },
    [updateFilters]
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    const newFilters = { skip: 0, limit: filters.limit }
    setFilters(newFilters)
    fetchProjects(newFilters)
  }, [filters.limit, fetchProjects])

  // Delete project and refresh list
  const deleteProject = useCallback(
    async (id: string) => {
      try {
        await ProjectService.deleteProject(id)
        // Refresh the list after deletion
        refresh()
        return true
      } catch (_error) {
        return false
      }
    },
    [refresh]
  )

  // Update project status and refresh list
  const updateProjectStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await ProjectService.updateProjectStatus(id, status)
        // Refresh the list after update
        refresh()
        return true
      } catch (_error) {
        return false
      }
    },
    [refresh]
  )

  // Computed values
  const currentPage =
    Math.floor((filters.skip || 0) / (filters.limit || 10)) + 1
  const totalPages = Math.ceil(state.total / (filters.limit || 10))
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  return {
    // State
    ...state,
    filters,

    // Pagination info
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,

    // Actions
    refresh,
    updateFilters,
    goToPage,
    changePageSize,
    search,
    filterByStatus,
    filterByCategory,
    clearFilters,
    deleteProject,
    updateProjectStatus,
  }
}
