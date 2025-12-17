import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UserAIModel } from '@/types/user-ai-model.types'
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import { isSuperAdmin, getUserIdFromToken } from '@/utils/jwt'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import ClaudeIcon from '@/components/icons/claude'
import DeepseekIcon from '@/components/icons/deepseek'
import GeminiIcon from '@/components/icons/gemini'
import GrokIcon from '@/components/icons/grok'
import OpenAIIcon from '@/components/icons/openai'

type UserModelsListProps = {
  userModels: UserAIModel[]
  isLoading?: boolean
  onUpdate?: (modelId: string, apiKey: string) => Promise<void>
  onDelete?: (modelId: string) => Promise<void>
}

const getUpdateApiKeySchema = (t: (key: string) => string) =>
  z.object({
    api_key: z.string().min(1, t('settings.aiModels.apiKeyRequired')),
  })

export function UserModelsList({
  userModels,
  isLoading,
  onUpdate,
  onDelete,
}: UserModelsListProps) {
  const { t } = useTranslation()
  const currentUserId = getUserIdFromToken()
  const isAdmin = isSuperAdmin()
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [editingModel, setEditingModel] = useState<UserAIModel | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateApiKeySchema = getUpdateApiKeySchema(t)
  type UpdateApiKeyForm = z.infer<typeof updateApiKeySchema>

  const toggleKeyVisibility = (modelId: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      if (next.has(modelId)) {
        next.delete(modelId)
      } else {
        next.add(modelId)
      }
      return next
    })
  }

  const copyToClipboard = async (text: string, modelId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(modelId)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const maskApiKey = (key?: string): string => {
    if (!key) return t('settings.aiModels.notSet')
    if (key.length <= 8) return '••••••••'
    return `${key.substring(0, 4)}${'•'.repeat(key.length - 8)}${key.substring(key.length - 4)}`
  }

  const canViewApiKey = (model: UserAIModel): boolean => {
    // Super admin can view all API keys
    if (isAdmin) return true
    // Regular users can only view their own API keys
    return model.user_id === currentUserId
  }

  const form = useForm<UpdateApiKeyForm>({
    resolver: zodResolver(updateApiKeySchema),
    defaultValues: {
      api_key: '',
    },
  })

  const handleEdit = (model: UserAIModel) => {
    setEditingModel(model)
    form.reset({ api_key: model.api_key || '' })
  }

  const handleUpdate = async (values: UpdateApiKeyForm) => {
    if (!editingModel || !onUpdate) return

    setIsUpdating(true)
    try {
      await onUpdate(editingModel.ai_model_id, values.api_key)
      setEditingModel(null)
      form.reset()
    } catch (error) {
      console.error('Failed to update API key:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getProviderIcon = (provider?: string) => {
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

  if (isLoading) {
    return (
      <div className='text-muted-foreground py-4 text-center'>
        {t('settings.aiModels.loading')}
      </div>
    )
  }

  if (userModels.length === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center'>
        {t('settings.aiModels.noModelsConfigured')}
      </div>
    )
  }

  return (
    <>
      <div className='mt-3'>
        <Table>
          <TableHeader>
            <TableRow>
              {isAdmin && <TableHead>{t('settings.aiModels.user')}</TableHead>}
              <TableHead>{t('settings.aiModels.modelName')}</TableHead>
              <TableHead>{t('settings.aiModels.provider')}</TableHead>
              <TableHead>{t('settings.aiModels.type')}</TableHead>
              <TableHead>{t('settings.aiModels.apiKey')}</TableHead>
              <TableHead>{t('settings.aiModels.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userModels.map((model) => {
              const canView = canViewApiKey(model)
              const isVisible = visibleKeys.has(model.id)
              const apiKey = model.api_key || ''
              const displayKey =
                isVisible && canView ? apiKey : maskApiKey(apiKey)

              return (
                <TableRow key={model.id}>
                  {isAdmin && (
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {model.user_full_name || model.user_username}
                        </span>
                        <span className='text-muted-foreground text-xs'>
                          {model.user_email}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{model.ai_model_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {getProviderIcon(model.ai_model_provider)}
                      <span>{model.ai_model_provider || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{model.ai_model_type || 'N/A'}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <code className='bg-muted rounded px-2 py-1 font-mono text-xs'>
                        {displayKey}
                      </code>
                      {canView && apiKey && (
                        <>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='h-6 w-6 p-0'
                            onClick={() => toggleKeyVisibility(model.id)}
                          >
                            {isVisible ? (
                              <EyeOff className='h-3 w-3' />
                            ) : (
                              <Eye className='h-3 w-3' />
                            )}
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='h-6 w-6 p-0'
                            onClick={() => copyToClipboard(apiKey, model.id)}
                          >
                            {copiedKey === model.id ? (
                              <Check className='h-3 w-3 text-green-500' />
                            ) : (
                              <Copy className='h-3 w-3' />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {canView ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <span className='sr-only'>
                              {t('settings.aiModels.openMenu')}
                            </span>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleEdit(model)}>
                            <Edit2 className='mr-2 h-4 w-4' />
                            {t('settings.aiModels.editApiKey')}
                          </DropdownMenuItem>
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(model.ai_model_id)}
                              className='text-destructive'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              {t('settings.aiModels.delete')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className='text-muted-foreground text-sm'>-</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!editingModel}
        onOpenChange={(open) => !open && setEditingModel(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.aiModels.updateApiKey')}</DialogTitle>
            <DialogDescription>
              {t('settings.aiModels.updateApiKeyDescription')}{' '}
              {editingModel?.ai_model_name || t('settings.aiModels.aiModel')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='api_key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.aiModels.apiKey')}</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder={t('settings.aiModels.enterApiKey')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
    </>
  )
}
