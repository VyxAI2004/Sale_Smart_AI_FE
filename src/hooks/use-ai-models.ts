import { useState, useCallback } from 'react'
import { aiModelApi } from '@/apis/aiModel.api'

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
    type ApiListResponse<T> = { data: { total?: number; items: T[] } }
    const res = (await aiModelApi.myList()) as ApiListResponse<AiModel>
    setModels(res?.data?.items || [])
  }, [])

  const activateModel = useCallback(async (id: string) => {
    await aiModelApi.activate(id)
    await fetchMyModels()
  }, [fetchMyModels])

  const deactivateModel = useCallback(async (id: string) => {
    await aiModelApi.deactivate(id)
    await fetchMyModels()
  }, [fetchMyModels])

  const removeModel = useCallback(async (id: string) => {
    await aiModelApi.delete(id)
    await fetchMyModels()
  }, [fetchMyModels])

  const createModel = useCallback(
    async (payload: { name: string; model_name: string; provider: string; model_type: string }) => {
      await aiModelApi.create(payload)
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
  }
}
