import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useLocation } from '@tanstack/react-router'
import { ProjectApi, type ProjectApiResponse } from '@/features/projects/api/project-api'

interface ProjectContextType {
  activeProject: ProjectApiResponse | null
  isLoading: boolean
  setActiveProject: (project: ProjectApiResponse | null) => void
}

const ProjectContext = createContext<ProjectContextType | null>(null)

const STORAGE_KEY = 'active_project_id'

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [activeProject, setActiveProjectState] = useState<ProjectApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<ProjectApiResponse[]>([])

  // Save to localStorage when activeProject changes
  const setActiveProject = useCallback((project: ProjectApiResponse | null) => {
    setActiveProjectState(project)
    if (project) {
      localStorage.setItem(STORAGE_KEY, project.id)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await ProjectApi.getMyProjects({ limit: 20 })

        if (cancelled) return

        const fetchedProjects = response.items || []
        setProjects(fetchedProjects)

        if (fetchedProjects.length > 0) {
          // Get current project from URL first
          const projectIdFromUrl = location.pathname.match(/\/projects\/([^/]+)/)?.[1]
          
          let current: ProjectApiResponse | null = null
          
          if (projectIdFromUrl) {
            // If URL has project ID, use it
            current = fetchedProjects.find((p) => p.id === projectIdFromUrl) || null
          } else {
            // If no project in URL, try to get from localStorage
            const savedProjectId = localStorage.getItem(STORAGE_KEY)
            if (savedProjectId) {
              current = fetchedProjects.find((p) => p.id === savedProjectId) || null
            }
            // If no saved project, use first project
            if (!current) {
              current = fetchedProjects[0]
            }
          }

          if (current) {
            setActiveProject(current)
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        if (!cancelled) {
          setProjects([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchProjects()

    return () => {
      cancelled = true
    }
  }, [location.pathname, setActiveProject])

  // Update active project when URL changes
  useEffect(() => {
    const projectIdFromUrl = location.pathname.match(/\/projects\/([^/]+)/)?.[1]
    
    if (projectIdFromUrl && projects.length > 0) {
      // URL has project ID - use it
      const current = projects.find((p) => p.id === projectIdFromUrl)
      if (current && current.id !== activeProject?.id) {
        setActiveProject(current)
      }
    } else if (!projectIdFromUrl && projects.length > 0) {
      // No project in URL - check if we have a saved project
      const savedProjectId = localStorage.getItem(STORAGE_KEY)
      if (savedProjectId) {
        const savedProject = projects.find((p) => p.id === savedProjectId)
        if (savedProject && savedProject.id !== activeProject?.id) {
          setActiveProject(savedProject)
          return
        }
      }
      // If no saved project and no active project, use first project
      if (!activeProject) {
        setActiveProject(projects[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, projects])

  return (
    <ProjectContext.Provider value={{ activeProject, isLoading, setActiveProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider')
  }
  return context
}
