'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type ProjectApiResponse } from '../api/project-api'
import { ProjectService } from '../services/project-service'
import { useProjects } from './projects-provider'

type ProjectArchiveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: ProjectApiResponse
}

export function ProjectArchiveDialog({
  open,
  onOpenChange,
  currentRow,
}: ProjectArchiveDialogProps) {
  const { t } = useTranslation()
  const [isArchiving, setIsArchiving] = useState(false)
  const { setOpen, setCurrentRowId } = useProjects()

  const handleArchive = async () => {
    try {
      setIsArchiving(true)
      await ProjectService.updateProjectStatus(currentRow.id, 'archived')
      onOpenChange(false)
      setOpen(null)
      setCurrentRowId(null)
    } catch (error) {
      console.error('Error archiving project:', error)
      // Handle error - maybe show error toast
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleArchive}
      disabled={isArchiving}
      title={
        <span>
          <AlertTriangle
            className='me-1 inline-block'
            size={18}
          />{' '}
          {t('projects.archive')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('common.areYouSure')} {' '}
            <span className='font-bold'>{currentRow.name}</span>
            ?
            <br />
            {t('common.youCanRestoreArchived')}
          </p>

          <Alert>
            <AlertTitle>{t('common.info')}</AlertTitle>
            <AlertDescription>
              {t('projects.settings.archiveDescription')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isArchiving ? t('common.archiving') : t('projects.archive')}
    />
  )
}
