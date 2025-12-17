import { useState, useCallback } from 'react'
import { aiModelApi, type AIModel } from '@/apis/aiModel.api'
import { UserAIModelApi } from '@/apis/user-ai-model.api'
import type {
  UserAIModel,
  UserAIModelCreate,
} from '@/types/user-ai-model.types'

export function useUserAiModels() {
  const [userModels, setUserModels] = useState<UserAIModel[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchUserModels = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch user AI models
      const models = await UserAIModelApi.list()

      // Fetch all available AI models to get name, provider, type
      const aiModelsResponse = await aiModelApi.list({ limit: 1000 })
      const aiModelsMap = new Map<string, AIModel>()
      aiModelsResponse.data.items.forEach((model) => {
        aiModelsMap.set(model.id, model)
      })

      // Enrich user models with AI model information
      const enrichedModels: UserAIModel[] = models.map((userModel) => {
        const aiModel = aiModelsMap.get(userModel.ai_model_id)
        return {
          ...userModel,
          ai_model_name: aiModel?.name || undefined,
          ai_model_provider: aiModel?.provider || undefined,
          ai_model_type: aiModel?.model_type || undefined,
        }
      })

      setUserModels(enrichedModels)
    } catch (error) {
      console.error('Failed to fetch user AI models:', error)
      setUserModels([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createOrUpdateUserModel = useCallback(
    async (payload: UserAIModelCreate) => {
      setIsLoading(true)
      try {
        const model = await UserAIModelApi.createOrUpdate(payload)
        await fetchUserModels()
        return model
      } catch (error) {
        console.error('Failed to create/update user AI model:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUserModels]
  )

  const deleteUserModel = useCallback(
    async (aiModelId: string) => {
      setIsLoading(true)
      try {
        await UserAIModelApi.delete(aiModelId)
        await fetchUserModels()
      } catch (error) {
        console.error('Failed to delete user AI model:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUserModels]
  )

  return {
    userModels,
    isLoading,
    fetchUserModels,
    createOrUpdateUserModel,
    deleteUserModel,
  }
}
