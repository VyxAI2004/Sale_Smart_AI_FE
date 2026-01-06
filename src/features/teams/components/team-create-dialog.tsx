import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTeam } from '../hooks'
import type { ITeamCreate } from '../types'

interface TeamCreateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * TeamCreateDialog Component
 * Dialog to create a new team using shadcn components
 * Same pattern as ProjectService
 */
export const TeamCreateDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: TeamCreateDialogProps) => {
  const [formData, setFormData] = useState<ITeamCreate>({
    name: '',
    description: '',
  })
  const [error, setError] = useState('')
  const { mutate: createTeam, isPending } = useCreateTeam()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Team name is required')
      return
    }

    // Prepare payload same as ProjectService - let backend extract user_id from token
    const payload: ITeamCreate = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
    }

    createTeam(payload, {
      onSuccess: () => {
        setFormData({ name: '', description: '' })
        setError('')
        onClose()
        onSuccess?.()
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.detail || err.message || 'Failed to create team'
        )
      },
    })
  }

  const handleClose = () => {
    if (!isPending) {
      setFormData({ name: '', description: '' })
      setError('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to organize your projects and team members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor='team-name'>Team Name *</Label>
            <Input
              id='team-name'
              placeholder='My Awesome Team'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isPending}
              autoFocus
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='team-description'>Description</Label>
            <Textarea
              id='team-description'
              placeholder='Enter team description (optional)'
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isPending}
              className='resize-none'
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending || !formData.name.trim()}
              className='gap-2'
            >
              {isPending && <Loader2 className='h-4 w-4 animate-spin' />}
              {isPending ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
