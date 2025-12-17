import http from '@/utils/http'
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskFilters,
  TaskGenerationRequest,
  TaskGenerationResponse,
} from '../types/task.types'

export class TaskApi {
  private static readonly BASE_PATH = '/tasks'
  private static readonly PRODUCT_TASKS_PATH = '/products'

  /**
   * Get all tasks with filters
   */
  static async getAll(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams()
    if (filters?.project_id) params.append('project_id', filters.project_id)
    if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to)
    if (filters?.status) params.append('status', filters.status)

    const queryString = params.toString()
    const url = queryString
      ? `${this.BASE_PATH}?${queryString}`
      : this.BASE_PATH

    const response = await http.get<Task[]>(url)
    return response.data
  }

  /**
   * Get task by ID
   */
  static async getById(id: string): Promise<Task> {
    const response = await http.get<Task>(`${this.BASE_PATH}/${id}`)
    return response.data
  }

  /**
   * Create new task
   */
  static async create(payload: TaskCreate): Promise<Task> {
    const response = await http.post<Task>(this.BASE_PATH, payload)
    return response.data
  }

  /**
   * Update task
   */
  static async update(id: string, payload: TaskUpdate): Promise<Task> {
    const response = await http.put<Task>(`${this.BASE_PATH}/${id}`, payload)
    return response.data
  }

  /**
   * Delete task
   */
  static async delete(id: string): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${id}`)
  }

  /**
   * Mark task as completed
   */
  static async complete(id: string): Promise<Task> {
    const response = await http.patch<Task>(`${this.BASE_PATH}/${id}/complete`)
    return response.data
  }

  /**
   * Generate marketing tasks from product analytics
   */
  static async generateTasks(
    productId: string,
    request: TaskGenerationRequest = { max_tasks: 5 }
  ): Promise<TaskGenerationResponse> {
    const response = await http.post<TaskGenerationResponse>(
      `${this.PRODUCT_TASKS_PATH}/${productId}/generate-tasks`,
      request
    )
    return response.data
  }

  /**
   * Preview tasks (without saving)
   */
  static async previewTasks(
    productId: string,
    request: TaskGenerationRequest = { max_tasks: 5 }
  ): Promise<TaskGenerationResponse> {
    const response = await http.post<TaskGenerationResponse>(
      `${this.PRODUCT_TASKS_PATH}/${productId}/generate-tasks-preview`,
      request
    )
    return response.data
  }
}
