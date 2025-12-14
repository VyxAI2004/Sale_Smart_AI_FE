import http from '@/utils/http';
import { getAccessTokenFromLocalStorage } from '@/utils/localStorage';
import type { AutoDiscoveryRequest } from '../types/auto-discovery.types';

export class AutoDiscoveryApi {
  private static readonly BASE_PATH = '/products/auto-discovery';

  /**
   * Execute auto-discovery with streaming (SSE)
   * Returns a ReadableStream for handling Server-Sent Events
   */
  static async executeStream(
    request: AutoDiscoveryRequest,
    onEvent?: (event: any) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> {
    const accessToken = getAccessTokenFromLocalStorage() || '';
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const url = `${baseURL}/api/v1${this.BASE_PATH}/execute-stream`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          project_id: request.project_id,
          user_input: request.user_input,
          // Only include optional fields if they are provided
          ...(request.filter_criteria !== undefined && { filter_criteria: request.filter_criteria }),
          ...(request.max_products !== undefined && { max_products: request.max_products }),
        }),
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          // Clone response to read body without consuming the stream
          const clonedResponse = response.clone();
          const contentType = clonedResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await clonedResponse.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } else {
            const errorText = await clonedResponse.text();
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (e) {
          // If response is not readable, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              onComplete?.();
              return;
            }

            try {
              const event = JSON.parse(data);
              onEvent?.(event);
            } catch (e) {
              console.error('Failed to parse event:', e);
              onError?.(new Error('Failed to parse stream event'));
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
      } else {
        onError?.(new Error('Unknown error occurred'));
      }
      throw error;
    }
  }

  /**
   * Execute auto-discovery without streaming (non-streaming endpoint)
   * Returns the final result after completion
   */
  static async execute(
    request: AutoDiscoveryRequest
  ): Promise<any> {
    const response = await http.post(
      `${this.BASE_PATH}/execute`,
      {
        project_id: request.project_id,
        user_input: request.user_input,
        filter_criteria: request.filter_criteria,
        max_products: request.max_products,
      }
    );
    return response.data;
  }
}

