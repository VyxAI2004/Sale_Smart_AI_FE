import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  DollarSign,
  Edit3,
  Save,
  X,
  Target,
  Clock,
  Settings,
  Bell,
  Cpu,
  Trash2,
  Archive,
  Copy,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ProjectApi } from '../../api/project-api'
import type { ProjectDetailData } from '../../types/project-detail.types'
import type { PipelineType, CrawlSchedule } from '../../types/project.types'

interface ProjectDetailsCardProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  onUpdate?: (updates: Partial<ProjectDetailData>) => void
}

export function ProjectDetailsCard({
  project,
  isLoading = false,
  onUpdate,
}: ProjectDetailsCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [editData, setEditData] = useState<Partial<ProjectDetailData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCurrency = (amount: number | null, currency = 'VND') => {
    if (!amount) return '--'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!editData.name || editData.name.trim() === '') {
      newErrors.name = t('projects.settings.projectName') + ' is required'
    }

    if (
      editData.target_budget_range !== undefined &&
      editData.target_budget_range < 0
    ) {
      newErrors.budget = 'Budget must be positive'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStartEdit = () => {
    if (!project) return
    setEditData({
      name: project.name,
      description: project.description,
      target_product_name: project.target_product_name,
      target_product_category: project.target_product_category,
      target_budget_range: project.target_budget_range,
      currency: project.currency,
      pipeline_type: project.pipeline_type,
      crawl_schedule: project.crawl_schedule,
      deadline: project.deadline,
    })
    setErrors({})
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!project || !validateForm()) {
      toast.error(t('projects.settings.updateError'))
      return
    }

    try {
      setIsSaving(true)
      await ProjectApi.update(project.id, editData)

      if (onUpdate) {
        onUpdate(editData)
      }

      toast.success(t('projects.settings.updateSuccess'))
      setIsEditing(false)
      setEditData({})
    } catch (error) {
      console.error('Failed to update project:', error)
      toast.error(t('projects.settings.updateError'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({})
    setErrors({})
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!project) return

    try {
      setIsDeleting(true)
      await ProjectApi.delete(project.id)
      toast.success(t('projects.settings.deleteSuccess'))
      navigate({ to: '/projects' })
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error(t('projects.settings.deleteError'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleArchive = async () => {
    if (!project) return

    try {
      setIsArchiving(true)
      await ProjectApi.updateStatus(project.id, 'archived')
      toast.success(t('projects.settings.archiveSuccess'))
      if (onUpdate) {
        onUpdate({ status: 'archived' })
      }
    } catch (error) {
      console.error('Failed to archive project:', error)
      toast.error(t('projects.settings.archiveError'))
    } finally {
      setIsArchiving(false)
    }
  }

  const handleDuplicate = async () => {
    if (!project) return

    try {
      setIsDuplicating(true)
      const duplicateData = {
        name: `${project.name} (Copy)`,
        description: project.description,
        target_product_name: project.target_product_name,
        target_product_category: project.target_product_category,
        target_budget_range: project.target_budget_range,
        currency: project.currency,
        pipeline_type: project.pipeline_type,
        crawl_schedule: project.crawl_schedule,
        deadline: project.deadline,
      }
      const newProject = await ProjectApi.create(duplicateData)
      toast.success(t('projects.settings.duplicateSuccess'))
      navigate({ to: `/projects/${newProject.id}` })
    } catch (error) {
      console.error('Failed to duplicate project:', error)
      toast.error(t('projects.settings.duplicateError'))
    } finally {
      setIsDuplicating(false)
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <DollarSign className='h-5 w-5' />
                {t('projects.settings.budgetFinance')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-6 w-24' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-6 w-16' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                {t('projects.settings.scheduleTimeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Edit3 className='h-5 w-5' />
              {t('projects.settings.quickEdit')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className='h-32 w-full' />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Card>
            <CardContent className='flex items-center justify-center py-8'>
              <p className='text-muted-foreground'>
                {t('projects.projectNotFound')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Project Details Cards */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Budget & Finance */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='h-5 w-5' />
              {t('projects.settings.budgetFinance')}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  {t('projects.budget')}
                </p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(
                    project.target_budget_range ?? null,
                    project.currency
                  )}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  {t('projects.settings.currency')}
                </p>
                <Badge variant='secondary'>{project.currency || 'VND'}</Badge>
              </div>
            </div>
            <div>
              <p className='text-muted-foreground mb-2 text-sm font-medium'>
                {t('projects.settings.category')}
              </p>
              <div className='flex items-center gap-2'>
                <Target className='text-muted-foreground h-4 w-4' />
                <span className='text-sm'>
                  {project.target_product_category ||
                    t('projects.settings.notSpecified')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              {t('projects.settings.scheduleTimeline')}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  {t('projects.settings.crawlSchedule')}
                </span>
                <Badge
                  variant={project.crawl_schedule ? 'default' : 'secondary'}
                >
                  {project.crawl_schedule ||
                    t('projects.settings.notConfigured')}
                </Badge>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  {t('projects.nextCrawl')}
                </span>
                <span className='text-muted-foreground text-sm'>
                  {project.next_crawl_at
                    ? new Date(project.next_crawl_at).toLocaleDateString(
                        'vi-VN'
                      )
                    : t('projects.settings.notScheduled')}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  {t('projects.deadline')}
                </span>
                <span className='text-muted-foreground text-sm'>
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString('vi-VN')
                    : t('projects.settings.notSet')}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  {t('projects.pipelineType')}
                </span>
                <Badge variant='outline'>
                  {project.pipeline_type || 'Standard'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Edit Panel */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Edit3 className='h-5 w-5' />
              {t('projects.settings.quickEdit')}
            </CardTitle>
            {!isEditing ? (
              <Button size='sm' onClick={handleStartEdit}>
                {t('projects.settings.editProject')}
                <Edit3 className='ml-1 h-4 w-4' />
              </Button>
            ) : (
              <div className='flex gap-2'>
                <Button size='sm' onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className='ml-1 h-4 w-4 animate-spin' />
                      {t('projects.saving')}
                    </>
                  ) : (
                    <>
                      {t('projects.settings.save')}
                      <Save className='ml-1 h-4 w-4' />
                    </>
                  )}
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  {t('projects.settings.cancel')}
                  <X className='ml-1 h-4 w-4' />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {/* Basic Info */}
              <div className='space-y-4'>
                <h4 className='text-muted-foreground mb-4 border-b pb-2 text-sm font-medium'>
                  {t('projects.settings.basicInfo')}
                </h4>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>
                      {t('projects.settings.projectName')}
                    </Label>
                    <Input
                      id='name'
                      value={editData.name || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className='text-destructive text-xs'>{errors.name}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='target'>
                      {t('projects.settings.targetProduct')}
                    </Label>
                    <Input
                      id='target'
                      value={editData.target_product_name || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          target_product_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='description'>
                      {t('projects.description')}
                    </Label>
                    <Textarea
                      id='description'
                      value={editData.description || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Finance */}
              <div className='space-y-4'>
                <h4 className='text-muted-foreground mb-4 border-b pb-2 text-sm font-medium'>
                  {t('projects.settings.budgetFinance')}
                </h4>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='budget'>{t('projects.budget')}</Label>
                    <Input
                      id='budget'
                      type='number'
                      value={editData.target_budget_range ?? ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          target_budget_range: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className={errors.budget ? 'border-destructive' : ''}
                    />
                    {errors.budget && (
                      <p className='text-destructive text-xs'>
                        {errors.budget}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='currency'>
                      {t('projects.settings.currency')}
                    </Label>
                    <Select
                      value={editData.currency}
                      onValueChange={(value) =>
                        setEditData({ ...editData, currency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('projects.settings.selectCurrency')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='VND'>VND</SelectItem>
                        <SelectItem value='USD'>USD</SelectItem>
                        <SelectItem value='EUR'>EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='category'>
                      {t('projects.settings.category')}
                    </Label>
                    <Input
                      id='category'
                      value={editData.target_product_category || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          target_product_category: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Timeline */}
              <div className='space-y-4'>
                <h4 className='text-muted-foreground mb-4 border-b pb-2 text-sm font-medium'>
                  {t('projects.settings.scheduleTimeline')}
                </h4>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='pipeline'>
                      {t('projects.pipelineType')}
                    </Label>
                    <Select
                      value={editData.pipeline_type}
                      onValueChange={(value) =>
                        setEditData({
                          ...editData,
                          pipeline_type: value as PipelineType,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('projects.settings.selectPipeline')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='standard'>Standard</SelectItem>
                        <SelectItem value='advanced'>Advanced</SelectItem>
                        <SelectItem value='custom'>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='schedule'>
                      {t('projects.settings.crawlSchedule')}
                    </Label>
                    <Select
                      value={editData.crawl_schedule || ''}
                      onValueChange={(value) =>
                        setEditData({
                          ...editData,
                          crawl_schedule: value as CrawlSchedule,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('projects.settings.selectSchedule')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='daily'>Daily</SelectItem>
                        <SelectItem value='weekly'>Weekly</SelectItem>
                        <SelectItem value='monthly'>Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='deadline'>{t('projects.deadline')}</Label>
                    <DatePicker
                      value={
                        editData.deadline
                          ? new Date(editData.deadline)
                          : undefined
                      }
                      onChange={(date) =>
                        setEditData({
                          ...editData,
                          deadline: date ?? undefined,
                        })
                      }
                      placeholder={t('projects.settings.selectDeadline')}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-3'>
                <h4 className='text-muted-foreground text-sm font-medium'>
                  {t('projects.settings.basicInfo')}
                </h4>
                <div className='space-y-2'>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.settings.project')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {project.name}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.settings.target')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {project.target_product_name}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.description')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {project.description ||
                        t('projects.settings.noDescription')}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <h4 className='text-muted-foreground text-sm font-medium'>
                  {t('projects.settings.budgetFinance')}
                </h4>
                <div className='space-y-2'>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.budget')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {formatCurrency(
                        project.target_budget_range ?? null,
                        project.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.settings.currency')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {project.currency || 'VND'}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.settings.category')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {project.target_product_category ||
                        t('projects.settings.notSpecified')}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <h4 className='text-muted-foreground text-sm font-medium'>
                  {t('projects.settings.scheduleTimeline')}
                </h4>
                <div className='space-y-2'>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.pipelineType')}:
                    </span>
                    <Badge variant='outline' className='ml-2'>
                      {project.pipeline_type || 'Standard'}
                    </Badge>
                  </div>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.schedule')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {project.crawl_schedule ||
                        t('projects.settings.notConfigured')}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm font-medium'>
                      {t('projects.deadline')}:
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString('vi-VN')
                        : t('projects.settings.notSet')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            {t('projects.settings.advancedSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* AI Model Selection */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Cpu className='text-muted-foreground h-4 w-4' />
              <Label className='text-base font-medium'>
                {t('projects.settings.aiModel')}
              </Label>
            </div>
            <Select defaultValue='gpt-4'>
              <SelectTrigger className='w-full max-w-md'>
                <SelectValue
                  placeholder={t('projects.settings.selectAIModel')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='gpt-4'>GPT-4</SelectItem>
                <SelectItem value='gpt-3.5'>GPT-3.5</SelectItem>
                <SelectItem value='claude'>Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Notifications Settings */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Bell className='text-muted-foreground h-4 w-4' />
              <Label className='text-base font-medium'>
                {t('projects.settings.notifications')}
              </Label>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>{t('projects.settings.enableEmailAlerts')}</Label>
                  <p className='text-muted-foreground text-sm'>
                    {t('projects.settings.emailNotifications')}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>{t('projects.settings.crawlAlerts')}</Label>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>{t('projects.settings.priceAlerts')}</Label>
                </div>
                <Switch />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>{t('projects.settings.analysisAlerts')}</Label>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='text-destructive flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' />
            {t('projects.settings.dangerZone')}
          </CardTitle>
          <p className='text-muted-foreground mt-2 text-sm'>
            {t('projects.settings.dangerZoneDescription')}
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Duplicate Project */}
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <div className='flex items-center gap-2'>
                <Copy className='h-4 w-4' />
                <Label className='font-medium'>
                  {t('projects.settings.duplicateProject')}
                </Label>
              </div>
              <p className='text-muted-foreground text-sm'>
                {t('projects.settings.duplicateDescription')}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='outline' disabled={isDuplicating}>
                  {isDuplicating ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {t('projects.settings.duplicating')}
                    </>
                  ) : (
                    <>
                      <Copy className='mr-2 h-4 w-4' />
                      {t('projects.settings.duplicate')}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('projects.settings.duplicateProject')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('projects.settings.confirmDuplicate')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('projects.settings.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDuplicate}>
                    {t('projects.settings.duplicate')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Archive Project */}
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <div className='flex items-center gap-2'>
                <Archive className='h-4 w-4' />
                <Label className='font-medium'>
                  {t('projects.settings.archiveProject')}
                </Label>
              </div>
              <p className='text-muted-foreground text-sm'>
                {t('projects.settings.archiveDescription')}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='outline' disabled={isArchiving}>
                  {isArchiving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {t('projects.settings.archiving')}
                    </>
                  ) : (
                    <>
                      <Archive className='mr-2 h-4 w-4' />
                      {t('projects.settings.archive')}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('projects.settings.archiveProject')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('projects.settings.confirmArchive')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('projects.settings.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive}>
                    {t('projects.settings.archive')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Delete Project */}
          <div className='border-destructive bg-destructive/5 flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <div className='flex items-center gap-2'>
                <Trash2 className='text-destructive h-4 w-4' />
                <Label className='text-destructive font-medium'>
                  {t('projects.settings.deleteProject')}
                </Label>
              </div>
              <p className='text-muted-foreground text-sm'>
                {t('projects.settings.deleteDescription')}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {t('projects.settings.deleting')}
                    </>
                  ) : (
                    <>
                      <Trash2 className='mr-2 h-4 w-4' />
                      {t('projects.settings.delete')}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('projects.settings.deleteProject')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('projects.settings.confirmDelete')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('projects.settings.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  >
                    {t('projects.settings.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
