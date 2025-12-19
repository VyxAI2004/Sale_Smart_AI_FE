import { useState, useCallback } from 'react'
import { aiModelApi, type AIModel } from '@/apis/aiModel.api'
import { isSuperAdmin } from '@/utils/jwt'

export type AiModel = {
  id: string
  name: string
  provider: string
  model_type: string
  is_active: boolean
}

export function useAiModels() {
  const [models, setModels] = useState<AiModel[]>([])

  const fetchMyModels = useCallback(async () => {
    try {
      const isAdmin = isSuperAdmin()
      // Super admin uses adminList, regular users use list
      const res = isAdmin
        ? await aiModelApi.adminList({ limit: 1000 })
        : await aiModelApi.list({ limit: 1000 })

      const items = res.data.items || []
      // Map to AiModel type
      const mappedModels: AiModel[] = items.map((model: AIModel) => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        model_type: model.model_type,
        is_active: model.is_active,
      }))
      setModels(mappedModels)
    } catch (error) {
      console.error('Failed to fetch AI models:', error)
      setModels([])
    }
  }, [])

  const activateModel = useCallback(
    async (id: string) => {
      await aiModelApi.activate(id)
      await fetchMyModels()
    },
    [fetchMyModels]
  )

  const deactivateModel = useCallback(
    async (id: string) => {
      await aiModelApi.deactivate(id)
      await fetchMyModels()
    },
    [fetchMyModels]
  )

  const removeModel = useCallback(
    async (id: string) => {
      await aiModelApi.delete(id)
      await fetchMyModels()
    },
    [fetchMyModels]
  )

  const createModel = useCallback(
    async (payload: {
      name: string
      model_name: string
      provider: string
      model_type: string
      base_url?: string
    }) => {
      await aiModelApi.create(payload)
      await fetchMyModels()
    },
    [fetchMyModels]
  )

  const updateModel = useCallback(
    async (
      id: string,
      payload: {
        name?: string
        model_name?: string
        provider?: string
        model_type?: string
        base_url?: string
        is_active?: boolean
      }
    ) => {
      await aiModelApi.update(id, payload)
      await fetchMyModels()
    },
    [fetchMyModels]
  )

  return {
    models,
    fetchMyModels,
    activateModel,
    deactivateModel,
    removeModel,
    createModel,
    updateModel,
  }
}
