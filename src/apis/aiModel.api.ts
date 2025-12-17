import http from '@/utils/http'

export type CreateAIModelPayload = {
  name: string
  model_name: string
  provider: string
  model_type: string
  base_url?: string
  config?: Record<string, unknown>
  is_active?: boolean
}

export type UpdateAIModelPayload = Partial<CreateAIModelPayload>

export type AIModel = {
  id: string
  name: string
  model_name: string
  provider: string
  model_type: string
  base_url?: string
  config?: Record<string, unknown>
  is_active: boolean
  last_used_at?: string
  usage_count?: number
  created_at?: string
  updated_at?: string
}

export type AIModelListResponse = {
  total: number
  items: AIModel[]
}

export interface AIModelListParams {
  skip?: number
  limit?: number
  q?: string
  model_type?: string
  provider?: string
  is_active?: boolean
}

export const aiModelApi = {
  /**
   * List all AI models (public)
   */
  list: (params?: AIModelListParams) =>
    http.get<AIModelListResponse>('/ai-models', { params }),

  /**
   * Get AI model by ID
   */
  getById: (id: string) => http.get<AIModel>(`/ai-models/${id}`),

  /**
   * Create AI model (admin only)
   */
  create: (payload: CreateAIModelPayload) =>
    http.post<AIModel>('/ai-models', payload),

  /**
   * Update AI model (admin only)
   */
  update: (id: string, payload: UpdateAIModelPayload) =>
    http.patch<AIModel>(`/ai-models/${id}`, payload),

  /**
   * Activate AI model (admin only)
   */
  activate: (id: string) => http.post<AIModel>(`/ai-models/${id}/activate`),

  /**
   * Deactivate AI model (admin only)
   */
  deactivate: (id: string) => http.post<AIModel>(`/ai-models/${id}/deactivate`),

  /**
   * Increment usage count
   */
  incrementUsage: (id: string) =>
    http.post<AIModel>(`/ai-models/${id}/increment-usage`),

  /**
   * Delete AI model (admin only)
   */
  delete: (id: string) => http.delete(`/ai-models/${id}`),

  /**
   * Admin: Get all AI models (admin only)
   */
  adminList: (params?: AIModelListParams) =>
    http.get<AIModelListResponse>('/ai-models/admin/all', { params }),
}
