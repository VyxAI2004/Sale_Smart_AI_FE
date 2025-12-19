import { useState } from 'react'
import { MoreHorizontal, Power, PowerOff, Trash2, Edit2 } from 'lucide-react'
import type { AiModel } from '@/hooks/use-ai-models'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { aiModelApi, type AIModel } from '@/apis/aiModel.api'
import ClaudeIcon from '@/components/icons/claude'
import DeepseekIcon from '@/components/icons/deepseek'
import GeminiIcon from '@/components/icons/gemini'
import GrokIcon from '@/components/icons/grok'
import OpenAIIcon from '@/components/icons/openai'

type ModelsListProps = {
  models?: AiModel[]
  onActivate: (id: string) => void
  onDeactivate: (id: string) => void
  onDelete: (id: string) => void
  onUpdate?: (id: string, payload: UpdateModelPayload) => Promise<void>
}

type UpdateModelPayload = {
  name?: string
  model_name?: string
  provider?: string
  model_type?: string
  base_url?: string
  is_active?: boolean
}

const getUpdateSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('settings.aiModels.name') + ' is required').optional(),
    model_name: z
      .string()
      .min(1, t('settings.aiModels.modelIdentifier') + ' is required')
      .optional(),
    provider: z
      .string()
      .min(1, t('settings.aiModels.provider') + ' is required')
      .optional(),
    model_type: z.string().min(1, t('settings.aiModels.type') + ' is required').optional(),
    base_url: z
      .string()
      .optional()
      .refine(
        (val) => !val || val === '' || z.string().url().safeParse(val).success,
        {
          message: t('settings.aiModels.baseUrlInvalid'),
        }
      ),
  })

export function ModelsList({
  models = [],
  onActivate,
  onDeactivate,
  onDelete,
  onUpdate,
}: ModelsListProps) {
  const { t } = useTranslation()
  const [editingModel, setEditingModel] = useState<AIModel | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateSchema = getUpdateSchema(t)
  type UpdateFormValues = z.infer<typeof updateSchema>

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: '',
      model_name: '',
      provider: '',
      model_type: '',
      base_url: '',
    },
  })

  const handleEdit = async (modelId: string) => {
    try {
      const response = await aiModelApi.getById(modelId)
      const model = response.data
      setEditingModel(model)
      form.reset({
        name: model.name,
        model_name: model.model_name,
        provider: model.provider,
        model_type: model.model_type,
        base_url: model.base_url || '',
      })
    } catch (error) {
      console.error('Failed to load model:', error)
    }
  }

  const handleUpdate = async (values: UpdateFormValues) => {
    if (!editingModel || !onUpdate) return

    setIsUpdating(true)
    try {
      await onUpdate(editingModel.id, {
        ...values,
        base_url: values.base_url || undefined,
      })
      setEditingModel(null)
      form.reset()
    } catch (error) {
      console.error('Failed to update model:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <div className='mt-3'>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('settings.aiModels.name')}</TableHead>
            <TableHead>{t('settings.aiModels.provider')}</TableHead>
            <TableHead>{t('settings.aiModels.type')}</TableHead>
            <TableHead>{t('settings.aiModels.status')}</TableHead>
            <TableHead>{t('settings.aiModels.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((m: AiModel) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  {m.provider === 'openai' && (
                    <OpenAIIcon width={18} height={18} />
                  )}
                  {m.provider === 'gemini' && (
                    <GeminiIcon width={18} height={18} />
                  )}
                  {m.provider === 'claude' && (
                    <ClaudeIcon width={18} height={18} />
                  )}
                  {m.provider === 'grok' && <GrokIcon width={18} height={18} />}
                  {m.provider === 'deepseek' && (
                    <DeepseekIcon width={18} height={18} />
                  )}
                  <span>{m.provider}</span>
                </div>
              </TableCell>
              <TableCell>{m.model_type}</TableCell>
              <TableCell>
                {m.is_active
                  ? t('settings.aiModels.active')
                  : t('settings.aiModels.inactive')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                      <span className='sr-only'>
                        {t('settings.aiModels.openMenu')}
                      </span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {onUpdate && (
                      <DropdownMenuItem onClick={() => handleEdit(m.id)}>
                        <Edit2 className='mr-2 h-4 w-4' />
                        {t('settings.aiModels.edit')}
                      </DropdownMenuItem>
                    )}
                    {m.is_active ? (
                      <DropdownMenuItem onClick={() => onDeactivate(m.id)}>
                        <PowerOff className='mr-2 h-4 w-4' />
                        {t('settings.aiModels.deactivate')}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onActivate(m.id)}>
                        <Power className='mr-2 h-4 w-4' />
                        {t('settings.aiModels.activate')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(m.id)}
                      className='text-destructive'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      {t('settings.aiModels.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      {onUpdate && (
        <Dialog
          open={!!editingModel}
          onOpenChange={(open) => !open && setEditingModel(null)}
        >
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>{t('settings.aiModels.editModel')}</DialogTitle>
              <DialogDescription>
                {t('settings.aiModels.editModelDescription')}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdate)}
                className='space-y-4'
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
                  name='base_url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('settings.aiModels.baseUrl')}</FormLabel>
                      <FormControl>
                        <Input
                          type='url'
                          placeholder={t('settings.aiModels.baseUrlPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className='text-muted-foreground text-xs'>
                        {t('settings.aiModels.baseUrlDescription')}
                      </p>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setEditingModel(null)}
                  >
                    {t('settings.aiModels.cancel')}
                  </Button>
                  <Button type='submit' disabled={isUpdating}>
                    {isUpdating
                      ? t('settings.aiModels.updating')
                      : t('settings.aiModels.update')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
