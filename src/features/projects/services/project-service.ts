/**
 * Project Service - business logic layer
 */
import { toast } from 'sonner'
import {
  ProjectApi,
  type ProjectApiResponse,
  type CreateProjectPayload,
  type UpdateProjectPayload,
} from '../api/project-api'
import type { ProjectFormData } from '../types/project.types'

export class ProjectService {
  /**
   * Create a new project
   */
  static async createProject(
    formData: ProjectFormData
  ): Promise<ProjectApiResponse> {
    try {
      // Remove UI-only fields and prepare data for API
      const { isActive, ...projectData } = formData

      // Convert empty strings to null for API
      const payload: CreateProjectPayload = {
        ...projectData,
        crawl_schedule: projectData.crawl_schedule || undefined,
        assigned_model_id: projectData.assigned_model_id || undefined,
        target_product_category:
          projectData.target_product_category || undefined,
        // Ensure assigned_to is never empty array
        assigned_to:
          projectData.assigned_to && projectData.assigned_to.length > 0
            ? projectData.assigned_to
            : undefined,
      }

      const project = await ProjectApi.create(payload)

      toast.success('Project created successfully!', {
        description: `Project "${project.name}" has been created.`,
      })

      return project
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to create project', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Create a draft project
   */
  static async createDraftProject(
    formData: ProjectFormData
  ): Promise<ProjectApiResponse> {
    try {
      // Remove UI-only fields and set status to draft
      const { isActive, ...projectData } = formData

      const payload: CreateProjectPayload = {
        ...projectData,
        status: 'draft',
        // Keep dates as they are since they're already Date objects from form
      }

      const project = await ProjectApi.create(payload)

      toast.success('Draft saved successfully!', {
        description: `Draft "${project.name}" has been saved.`,
      })

      return project
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to save draft', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Update existing project
   */
  static async updateProject(
    id: string,
    formData: Partial<ProjectFormData>
  ): Promise<ProjectApiResponse> {
    try {
      // Remove UI-only fields
      const { isActive, ...projectData } = formData

      const payload: UpdateProjectPayload = {
        ...projectData,
        // Keep dates as they are since they're already Date objects from form
      }

      const project = await ProjectApi.update(id, payload)

      toast.success('Project updated successfully!', {
        description: `Project "${project.name}" has been updated.`,
      })

      return project
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to update project', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Delete project
   */
  static async deleteProject(id: string): Promise<void> {
    try {
      await ProjectApi.delete(id)

      toast.success('Project deleted successfully!')
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to delete project', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Get project by ID with error handling
   */
  static async getProject(id: string): Promise<ProjectApiResponse> {
    try {
      return await ProjectApi.getById(id)
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to load project', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * List projects with error handling
   */
  static async listProjects(params?: {
    skip?: number
    limit?: number
    q?: string
    status?: string
    created_by?: string
    assigned_to?: string
    pipeline_type?: string
    target_product_category?: string
  }) {
    try {
      const response = await ProjectApi.list(params)
      return response
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to load projects', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Get my projects with error handling
   */
  static async getMyProjects(params?: { skip?: number; limit?: number }) {
    try {
      return await ProjectApi.getMyProjects(params)
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to load your projects', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Update project status
   */
  static async updateProjectStatus(
    id: string,
    status: string
  ): Promise<ProjectApiResponse> {
    try {
      const project = await ProjectApi.updateStatus(id, status)

      toast.success('Project status updated!', {
        description: `Status changed to ${status}`,
      })

      return project
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to update status', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Assign multiple users to project
   */
  static async assignUsersToProject(
    id: string,
    userIds: string[]
  ): Promise<ProjectApiResponse> {
    try {
      const project = await ProjectApi.assignMultipleUsers(id, userIds)

      toast.success('Users assigned successfully!', {
        description: `${userIds.length} users assigned to project`,
      })

      return project
    } catch (error) {
      const message = this.getErrorMessage(error)
      toast.error('Failed to assign users', {
        description: message,
      })
      throw new Error(message)
    }
  }

  /**
   * Validate form data before submission
   */
  static validateProjectData(data: ProjectFormData): string[] {
    const errors: string[] = []

    if (!data.name.trim()) {
      errors.push('Project name is required')
    }

    if (!data.target_product_name.trim()) {
      errors.push('Target product name is required')
    }

    if (data.target_budget_range !== undefined) {
      const budget = Number(data.target_budget_range)
      if (isNaN(budget) || budget < 0) {
        errors.push('Budget must be a valid positive number')
      }
    }

    if (data.assigned_to && data.assigned_to.length > 5) {
      errors.push('Cannot assign more than 5 team members')
    }

    return errors
  }

  /**
   * Extract user-friendly error message
   */
  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }

    if (typeof error === 'object' && error !== null) {
      // Handle axios error format
      const axiosError = error as { response?: { data?: { detail?: string } } }
      if (axiosError.response?.data?.detail) {
        return axiosError.response.data.detail
      }
    }

    return 'An unexpected error occurred'
  }
}
