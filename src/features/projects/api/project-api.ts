/**
 * Project API Client - handles direct API calls
 */
import http from '@/utils/http';
import type { ProjectFormData } from '../types/project.types';

// API Response Types
export interface ProjectApiResponse extends ProjectFormData {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ProjectListResponse {
  total: number;
  items: ProjectApiResponse[];
}

export type CreateProjectPayload = Omit<ProjectFormData, 'isActive'>;

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export class ProjectApi {
  private static readonly BASE_PATH = '/projects';

  /**
   * Create new project
   */
  static async create(payload: CreateProjectPayload): Promise<ProjectApiResponse> {
    const response = await http.post<ProjectApiResponse>(this.BASE_PATH, payload);
    return response.data;
  }

  /**
   * Get project by ID
   */
  static async getById(id: string): Promise<ProjectApiResponse> {
    const response = await http.get<ProjectApiResponse>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * Update project
   */
  static async update(id: string, payload: UpdateProjectPayload): Promise<ProjectApiResponse> {
    const response = await http.put<ProjectApiResponse>(`${this.BASE_PATH}/${id}`, payload);
    return response.data;
  }

  /**
   * Delete project
   */
  static async delete(id: string): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * List projects with filters
   */
  static async list(params?: {
    skip?: number;
    limit?: number;
    q?: string;
    status?: string;
    created_by?: string;
    assigned_to?: string;
    pipeline_type?: string;
    target_product_category?: string;
  }): Promise<ProjectListResponse> {
    const response = await http.get<ProjectListResponse>(this.BASE_PATH, { params });
    return response.data;
  }

  /**
   * Get my projects
   */
  static async getMyProjects(params?: { 
    skip?: number; 
    limit?: number; 
  }): Promise<ProjectListResponse> {
    const response = await http.get<ProjectListResponse>(`${this.BASE_PATH}/my`, { params });
    return response.data;
  }

  /**
   * Update project status
   */
  static async updateStatus(id: string, status: string): Promise<ProjectApiResponse> {
    const response = await http.post<ProjectApiResponse>(`${this.BASE_PATH}/${id}/status`, { status });
    return response.data;
  }

  /**
   * Assign multiple users to project
   */
  static async assignMultipleUsers(id: string, userIds: string[]): Promise<ProjectApiResponse> {
    const response = await http.post<ProjectApiResponse>(`${this.BASE_PATH}/${id}/members`, {
      user_ids: userIds
    });
    return response.data;
  }

  /**
   * Remove users from project
   */
  static async removeUsersFromProject(id: string, userIds: string[]): Promise<ProjectApiResponse> {
    const response = await http.delete<ProjectApiResponse>(`${this.BASE_PATH}/${id}/members`, {
      data: { user_ids: userIds }
    });
    return response.data;
  }

  /**
   * Get project members
   */
  static async getMembers(id: string): Promise<Array<{ id: string; name: string; email: string }>> {
    const response = await http.get<Array<{ id: string; name: string; email: string }>>(`${this.BASE_PATH}/${id}/members`);
    return response.data;
  }
}