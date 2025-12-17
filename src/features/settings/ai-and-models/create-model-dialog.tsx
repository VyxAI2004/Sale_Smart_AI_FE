import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAiModels } from '@/hooks/use-ai-models'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ClaudeIcon from '@/components/icons/claude'
import DeepseekIcon from '@/components/icons/deepseek'
import GeminiIcon from '@/components/icons/gemini'
import GrokIcon from '@/components/icons/grok'
import OpenAIIcon from '@/components/icons/openai'

const getSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('settings.aiModels.name') + ' is required'),
    model_name: z
      .string()
      .min(1, t('settings.aiModels.modelIdentifier') + ' is required'),
    provider: z
      .string()
      .min(1, t('settings.aiModels.provider') + ' is required'),
    model_type: z.string().min(1, t('settings.aiModels.type') + ' is required'),
  })

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModelDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation()
  const schema = getSchema(t)
  type FormValues = z.infer<typeof schema>

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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        form.reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('settings.aiModels.createAIModel')}</DialogTitle>
          <DialogDescription>
            {t('settings.aiModels.createAIModelDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className='h-[22rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='create-model-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.aiModels.displayName')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('settings.aiModels.myModel')}
                        {...field}
                      />
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
                    <FormLabel>
                      {t('settings.aiModels.modelIdentifier')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('settings.aiModels.gpt4')}
                        {...field}
                      />
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
                    <FormLabel>{t('settings.aiModels.provider')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('settings.aiModels.selectProvider')}
                          />
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
                    <FormLabel>{t('settings.aiModels.type')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('settings.aiModels.selectModelType')}
                          />
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
                <Button type='submit'>{t('settings.aiModels.create')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
