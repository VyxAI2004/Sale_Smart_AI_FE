import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { aiModelApi } from '@/apis/aiModel.api'
import type { AIModel } from '@/apis/aiModel.api'
import OpenAIIcon from '@/components/icons/openai'
import GeminiIcon from '@/components/icons/gemini'
import ClaudeIcon from '@/components/icons/claude'
import GrokIcon from '@/components/icons/grok'
import DeepseekIcon from '@/components/icons/deepseek'

const schema = z.object({
  ai_model_id: z.string().min(1, 'AI Model is required'),
  api_key: z.string().min(1, 'API key is required'),
})

type FormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => Promise<void>
}

export function AddUserModelDialog({ open, onOpenChange, onSubmit }: Props) {
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ai_model_id: '',
      api_key: '',
    },
  })

  useEffect(() => {
    if (open) {
      loadAvailableModels()
    }
  }, [open])

  const loadAvailableModels = async () => {
    setIsLoadingModels(true)
    try {
      const response = await aiModelApi.list({ is_active: true, limit: 100 })
      setAvailableModels(response.data.items || [])
    } catch (error) {
      console.error('Failed to load AI models:', error)
      setAvailableModels([])
    } finally {
      setIsLoadingModels(false)
    }
  }

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values)
    form.reset()
    onOpenChange(false)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case 'openai':
        return <OpenAIIcon width={18} height={18} />
      case 'gemini':
        return <GeminiIcon width={18} height={18} />
      case 'claude':
        return <ClaudeIcon width={18} height={18} />
      case 'grok':
        return <GrokIcon width={18} height={18} />
      case 'deepseek':
        return <DeepseekIcon width={18} height={18} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { form.reset(); onOpenChange(v) }}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add AI Model Configuration</DialogTitle>
          <DialogDescription>
            Select an AI model and provide your API key to use it.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='add-user-model-form' onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='ai_model_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingModels}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingModels ? 'Loading models...' : 'Select AI model'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className='flex items-center gap-2'>
                              {getProviderIcon(model.provider)}
                              <span>{model.name}</span>
                              <span className='text-xs text-muted-foreground'>({model.provider})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='api_key'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='Enter your API key' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoadingModels}>
                Add Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

