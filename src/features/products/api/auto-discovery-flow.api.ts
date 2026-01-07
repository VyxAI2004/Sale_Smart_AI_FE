import { getAccessTokenFromLocalStorage } from '@/utils/localStorage'
import type { ExecuteFlowRequest } from '../types/auto-discovery-flow.types'

/**
 * Auto Discovery Flow API Client
 * Handles Phase 2: Detailed product analysis with streaming
 */
export class AutoDiscoveryFlowApi {
  private static readonly BASE_PATH = '/products/auto-discovery'

  /**
   * Execute detailed flow with streaming (SSE)
   * Crawl reviews → Trust Score → Analysis → Tasks
   *
   * @param request ExecuteFlowRequest with products config
   * @param onEvent Callback for each event
   * @param onError Error handler
   * @param onComplete Completion handler
   */
  static async executeDetailedFlowStream(
    request: ExecuteFlowRequest,
    onEvent?: (event: any) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> {
    const accessToken = getAccessTokenFromLocalStorage() || ''
    const baseURL = (
      import.meta.env.VITE_API_URL || 'https://b.3aa.uk'
    ).replace(/\/+$/, '')
    const url = `${baseURL}/api/v1${this.BASE_PATH}/execute-flow`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          project_id: request.project_id,
          products: request.products,
        }),
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const clonedResponse = response.clone()
          const contentType = clonedResponse.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await clonedResponse.json()
            errorMessage = errorData.detail || errorData.message || errorMessage
          } else {
            const errorText = await clonedResponse.text()
            if (errorText) {
              errorMessage = errorText
            }
          }
        } catch (e) {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          onComplete?.()
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            if (data === '[DONE]') {
              onComplete?.()
              return
            }

            try {
              const event = JSON.parse(data)
              onEvent?.(event)
            } catch (e) {
              console.error('Failed to parse event:', e)
            }
          }
        }
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }
}
