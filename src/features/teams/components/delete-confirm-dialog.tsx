'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type DeleteConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  itemDisplayName?: string
  onConfirm: () => Promise<void>
  requireNameConfirmation?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName,
  itemDisplayName,
  onConfirm,
  requireNameConfirmation = false,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const displayName = itemDisplayName || itemName

  const isConfirmDisabled =
    requireNameConfirmation && value.trim() !== itemName

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await onConfirm()
      onOpenChange(false)
      setValue('')
    } catch (error) {
      console.error('Error deleting:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isConfirmDisabled || isLoading}
      isLoading={isLoading}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          {t('teams.deleteTeam')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('common.areYouSure')} {' '}
            <span className='font-bold'>{displayName}</span>
            ?
            <br />
            {t('common.thisActionIsIrreversible')}
          </p>

          {requireNameConfirmation && (
            <Label className='my-2'>
              {t('teams.title')}:
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t('common.enterToConfirm')}
              />
            </Label>
          )}

          <Alert variant='destructive'>
            <AlertTitle>{t('common.warning')}</AlertTitle>
            <AlertDescription>
              {t('common.thisOperationCannotBeRolledBack')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isLoading ? t('common.deleting') : t('teams.delete')}
      destructive
    />
  )
}
