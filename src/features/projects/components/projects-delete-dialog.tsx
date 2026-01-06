'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type ProjectApiResponse } from '../api/project-api'
import { ProjectService } from '../services/project-service'
import { useProjects } from './projects-provider'

type ProjectDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: ProjectApiResponse
}

export function ProjectDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProjectDeleteDialogProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { setOpen, setCurrentRowId } = useProjects()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return

    try {
      setIsDeleting(true)
      await ProjectService.deleteProject(currentRow.id)
      onOpenChange(false)
      setOpen(null)
      setCurrentRowId(null)
      setValue('')
    } catch (error) {
      console.error('Error deleting project:', error)
      // Handle error - maybe show error toast
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          {t('projects.delete')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('common.areYouSure')} {' '}
            <span className='font-bold'>{currentRow.name}</span>
            ?
            <br />
            {t('common.thisActionIsIrreversible')}
          </p>

          <Label className='my-2'>
            {t('projects.projectName')}:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('common.enterToConfirm')}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('common.warning')}</AlertTitle>
            <AlertDescription>
              {t('common.thisOperationCannotBeRolledBack')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? t('common.deleting') : t('projects.delete')}
      destructive
    />
  )
}
