import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useAiModels } from '@/hooks/use-ai-models'
import OpenAIIcon from '@/components/icons/openai'
import GeminiIcon from '@/components/icons/gemini'
import ClaudeIcon from '@/components/icons/claude'
import GrokIcon from '@/components/icons/grok'
import DeepseekIcon from '@/components/icons/deepseek'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  model_name: z.string().min(1, 'Model identifier is required'),
  provider: z.string().min(1, 'Provider is required'),
  model_type: z.string().min(1, 'Type is required'),
})

type FormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModelDialog({ open, onOpenChange }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      model_name: '',
      provider: '',
      model_type: 'llm',
    },
  })

  const { createModel } = useAiModels()

  const onSubmit = async (values: FormValues) => {
    await createModel(values)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { form.reset(); onOpenChange(v) }}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Create AI Model</DialogTitle>
          <DialogDescription>Create a new AI model for your account.</DialogDescription>
        </DialogHeader>

        <div className='h-[22rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form id='create-model-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-0.5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input placeholder='My Model' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='model_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model identifier</FormLabel>
                    <FormControl>
                      <Input placeholder='gpt-4' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='provider'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select provider' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='openai'>
                            <div className='flex items-center gap-2'>
                              <OpenAIIcon width={20} height={20} />
                              <span>OpenAI</span>
                            </div>
                          </SelectItem>
                          <SelectItem value='gemini'>
                            <div className='flex items-center gap-2'>
                              <GeminiIcon width={20} height={20} />
                              <span>Gemini</span>
                            </div>
                          </SelectItem>
                          <SelectItem value='claude'>
                            <div className='flex items-center gap-2'>
                              <ClaudeIcon width={20} height={20} />
                              <span>Claude</span>
                            </div>
                          </SelectItem>
                          <SelectItem value='grok'>
                            <div className='flex items-center gap-2'>
                              <GrokIcon width={20} height={20} />
                              <span>Grok</span>
                            </div>
                          </SelectItem>
                          <SelectItem value='deepseek'>
                            <div className='flex items-center gap-2'>
                              <DeepseekIcon width={20} height={20} />
                              <span>Deepseek</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='model_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select model type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='llm'>LLM</SelectItem>
                          <SelectItem value='crawler'>Crawler</SelectItem>
                          <SelectItem value='analyzer'>Analyzer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type='submit'>Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
