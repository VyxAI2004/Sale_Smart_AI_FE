'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'

type RemoveProjectUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  userDisplayName?: string
  onConfirm: () => Promise<void>
}

export function RemoveProjectUserDialog({
  open,
  onOpenChange,
  userName,
  userDisplayName,
  onConfirm,
}: RemoveProjectUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const displayName = userDisplayName || userName

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Error removing user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isLoading}
      isLoading={isLoading}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Remove Member
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to remove{' '}
            <span className='font-bold'>{displayName}</span>
            from this project?
            <br />
            This action cannot be undone.
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isLoading ? 'Removing...' : 'Remove'}
      destructive
    />
  )
}
