/**
 * Project User API - handles project member invitation and management
 */
import http from '@/utils/http'

export interface ProjectUserResponse {
  id: string
  project_id: string
  user_id: string
  role: string
  status: 'pending' | 'accepted'
  invited_at: string
  invited_by: string
}

export interface InviteProjectUserPayload {
  email: string
  role?: string
}

export class ProjectUserApi {
  private static readonly BASE_PATH = '/projects'

  /**
   * Invite user to project
   */
  static async inviteUser(
    projectId: string,
    payload: InviteProjectUserPayload
  ): Promise<ProjectUserResponse> {
    const response = await http.post<ProjectUserResponse>(
      `${this.BASE_PATH}/${projectId}/invite`,
      payload
    )
    return response.data
  }

  /**
   * Get project members with invitations
   */
  static async getProjectUsers(
    projectId: string
  ): Promise<ProjectUserResponse[]> {
    const response = await http.get<ProjectUserResponse[]>(
      `${this.BASE_PATH}/${projectId}/users`
    )
    return response.data
  }

  /**
   * Remove user from project
   */
  static async removeUser(
    projectId: string,
    userId: string
  ): Promise<void> {
    await http.delete(
      `${this.BASE_PATH}/${projectId}/users/${userId}`
    )
  }

  /**
   * Update user role in project
   */
  static async updateUserRole(
    projectId: string,
    userId: string,
    role: string
  ): Promise<ProjectUserResponse> {
    const response = await http.patch<ProjectUserResponse>(
      `${this.BASE_PATH}/${projectId}/users/${userId}/role`,
      { role }
    )
    return response.data
  }
}
