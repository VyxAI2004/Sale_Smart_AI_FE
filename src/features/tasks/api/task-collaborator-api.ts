/**
 * Task Collaborator API Client - handles direct API calls for task collaborator management
 */
import type { UUID } from 'crypto'
import http from '@/utils/http'

export interface TaskCollaboratorResponse {
  id: UUID
  task_id: UUID
  user_id: UUID
  user_name?: string
  user_email?: string
  user_avatar?: string
  role: string // read_only, editor, collaborator
  is_active: boolean
  invited_at?: string
  invited_by_name?: string
  can_view: boolean
  can_edit: boolean
  can_comment: boolean
}

export interface TaskInvitePayload {
  user_email: string
  role?: string // read_only, editor, collaborator
  message?: string
}

export interface TaskCollaboratorUpdatePayload {
  role?: string
  permissions?: Record<string, any>
  is_active?: boolean
}

export class TaskCollaboratorApi {
  private static readonly BASE_PATH = '/tasks'

  /**
   * Invite user as collaborator on task
   */
  static async invite(
    taskId: string,
    payload: TaskInvitePayload
  ): Promise<TaskCollaboratorResponse> {
    const response = await http.post<TaskCollaboratorResponse>(
      `${this.BASE_PATH}/${taskId}/invite`,
      payload
    )
    return response.data
  }

  /**
   * Get task collaborators
   */
  static async getCollaborators(
    taskId: string,
    params?: {
      skip?: number
      limit?: number
    }
  ): Promise<TaskCollaboratorResponse[]> {
    const response = await http.get<TaskCollaboratorResponse[]>(
      `${this.BASE_PATH}/${taskId}/collaborators`,
      { params }
    )
    return response.data || []
  }

  /**
   * Update collaborator role
   */
  static async updateCollaborator(
    taskId: string,
    userId: string,
    payload: TaskCollaboratorUpdatePayload
  ): Promise<TaskCollaboratorResponse> {
    const response = await http.patch<TaskCollaboratorResponse>(
      `${this.BASE_PATH}/${taskId}/collaborators/${userId}`,
      payload
    )
    return response.data
  }

  /**
   * Remove collaborator from task
   */
  static async removeCollaborator(
    taskId: string,
    userId: string
  ): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${taskId}/collaborators/${userId}`)
  }
}
