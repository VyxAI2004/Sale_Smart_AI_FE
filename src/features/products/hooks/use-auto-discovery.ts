import { useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AutoDiscoveryApi } from '../api/auto-discovery.api';
import type {
  AutoDiscoveryState,
  StreamEvent,
  AutoDiscoveryStepProgress,
  AutoDiscoveryFinalResult,
} from '../types/auto-discovery.types';
import { toast } from 'sonner';

export const useAutoDiscovery = (projectId: string) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AutoDiscoveryState>({
    currentStep: '',
    stepStatus: {},
    aiThinking: '',
    progress: {},
    finalResult: null,
    error: null,
    isStreaming: false,
  });

  const aiThinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEvent = useCallback((event: StreamEvent) => {
    console.log('Received event:', event);

    switch (event.type) {
      case 'step_start':
        setState((prev) => ({
          ...prev,
          currentStep: event.step,
          stepStatus: { ...prev.stepStatus, [event.step]: 'active' },
          aiThinking: '', // Clear previous thinking
        }));
        break;

      case 'ai_thinking':
        setState((prev) => ({
          ...prev,
          aiThinking: event.message,
        }));
        // Auto-clear thinking after 5 seconds if no new thinking
        if (aiThinkingTimeoutRef.current) {
          clearTimeout(aiThinkingTimeoutRef.current);
        }
        aiThinkingTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, aiThinking: '' }));
        }, 5000);
        break;

      case 'step_progress':
        setState((prev) => ({
          ...prev,
          progress: {
            ...prev.progress,
            [event.step]: event.data as AutoDiscoveryStepProgress,
          },
        }));
        break;

      case 'step_complete':
        setState((prev) => ({
          ...prev,
          stepStatus: { ...prev.stepStatus, [event.step]: 'complete' },
          aiThinking: '', // Clear thinking when step completes
          progress: {
            ...prev.progress,
            [event.step]: event.data as AutoDiscoveryStepProgress,
          },
        }));
        break;

      case 'step_error':
        setState((prev) => ({
          ...prev,
          stepStatus: { ...prev.stepStatus, [event.step]: 'error' },
          error: event.message,
          isStreaming: false,
        }));
        toast.error(event.message);
        break;

      case 'final_result': {
        setState((prev) => ({
          ...prev,
          finalResult: event.data as AutoDiscoveryFinalResult,
          stepStatus: { ...prev.stepStatus, '6': 'complete' },
          isStreaming: false,
        }));
        const result = event.data as AutoDiscoveryFinalResult;
        if (result.status === 'success') {
          toast.success(result.message || 'Đã tìm và lưu sản phẩm thành công');
          // Invalidate products query to refresh the list
          queryClient.invalidateQueries({ queryKey: ['products', projectId] });
        } else {
          toast.error(result.error_message || result.message || 'Có lỗi xảy ra');
        }
        break;
      }
    }
  }, [projectId, queryClient]);

  const startDiscovery = useCallback(
    async (request: { user_input: string }) => {
      setState({
        currentStep: '',
        stepStatus: {},
        aiThinking: '',
        progress: {},
        finalResult: null,
        error: null,
        isStreaming: true,
      });

      try {
        await AutoDiscoveryApi.executeStream(
          {
            project_id: projectId,
            user_input: request.user_input,
          },
          handleEvent,
          (error) => {
            setState((prev) => ({
              ...prev,
              error: error.message,
              isStreaming: false,
            }));
            toast.error(error.message || 'Lỗi kết nối với server');
          },
          () => {
            setState((prev) => ({
              ...prev,
              isStreaming: false,
            }));
          }
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Lỗi không xác định';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isStreaming: false,
        }));
        toast.error(errorMessage);
      }
    },
    [projectId, handleEvent]
  );

  const reset = useCallback(() => {
    if (aiThinkingTimeoutRef.current) {
      clearTimeout(aiThinkingTimeoutRef.current);
    }
    setState({
      currentStep: '',
      stepStatus: {},
      aiThinking: '',
      progress: {},
      finalResult: null,
      error: null,
      isStreaming: false,
    });
  }, []);

  return {
    ...state,
    startDiscovery,
    reset,
  };
};

