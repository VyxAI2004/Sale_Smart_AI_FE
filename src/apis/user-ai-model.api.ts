import type {
  UserAIModel,
  UserAIModelCreate,
} from '@/types/user-ai-model.types'
import http from '@/utils/http'

export class UserAIModelApi {
  private static readonly BASE_PATH = '/user-ai-models'

  /**
   * Get all user AI models
   */
  static async list(): Promise<UserAIModel[]> {
    const response = await http.get<UserAIModel[]>(this.BASE_PATH)
    return response.data
  }

  /**
   * Create or update user AI model
   */
  static async createOrUpdate(
    payload: UserAIModelCreate
  ): Promise<UserAIModel> {
    const response = await http.post<UserAIModel>(this.BASE_PATH, payload)
    return response.data
  }

  /**
   * Delete user AI model
   */
  static async delete(aiModelId: string): Promise<void> {
    await http.delete(`${this.BASE_PATH}/${aiModelId}`)
  }
}
