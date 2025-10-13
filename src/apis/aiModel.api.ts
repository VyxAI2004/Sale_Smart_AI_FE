import http from '@/utils/http'

export type CreateAIModelPayload = {
  name: string
  model_name: string
  provider: string
  model_type: string
  is_active?: boolean
}

export type AIModel = {
  id: string
  name: string
  model_name: string
  provider: string
  model_type: string
  is_active: boolean
  user_id?: string
}

export const aiModelApi = {
  list: (params?: Record<string, unknown>) => http.get('/ai-models', { params }),
  myList: (params?: Record<string, unknown>) => http.get('/ai-models/my', { params }),
  create: (payload: CreateAIModelPayload) => http.post<AIModel>('/ai-models', payload),
  activate: (id: string) => http.post<AIModel>(`/ai-models/${id}/activate`),
  deactivate: (id: string) => http.post<AIModel>(`/ai-models/${id}/deactivate`),
  delete: (id: string) => http.delete(`/ai-models/${id}`),
}
