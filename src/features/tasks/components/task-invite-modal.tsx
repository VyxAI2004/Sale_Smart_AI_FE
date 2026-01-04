/**
 * Task Collaborators Invite Modal Component
 */
'use client'

import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useInviteTaskCollaborator } from '../hooks/use-task-collaborators'
import { TASK_COLLABORATOR_ROLES } from '../types/task-collaborator.types'

interface TaskInviteModalProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
}

export function TaskInviteModal({ taskId, isOpen, onClose }: TaskInviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>('collaborator')
  const [message, setMessage] = useState('')
  const inviteMutation = useInviteTaskCollaborator()

  const handleInvite = async () => {
    if (!email) return

    try {
      await inviteMutation.mutateAsync({
        taskId,
        payload: {
          user_email: email,
          role,
          message: message || undefined,
        },
      })

      setEmail('')
      setRole('collaborator')
      setMessage('')
      onClose()
    } catch (error) {
      console.error('Failed to invite collaborator:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
          <DialogDescription>
            Invite a user to collaborate on this task
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
              <Input
                id='email'
                type='email'
                placeholder='user@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id='role'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_COLLABORATOR_ROLES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className='flex items-center gap-2'>
                      <span>{value.label}</span>
                      <span className='text-xs text-gray-500'>({value.description})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message'>Message (Optional)</Label>
            <Textarea
              id='message'
              placeholder='Add a message to the invitation...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='h-24'
            />
          </div>

          <div className='flex gap-2 pt-4'>
            <Button variant='outline' onClick={onClose} className='flex-1'>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!email || inviteMutation.isPending}
              className='flex-1'
            >
              {inviteMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Invite
            </Button>
          </div>

          {inviteMutation.isError && (
            <div className='rounded-md bg-red-50 p-3 text-sm text-red-700'>
              Failed to invite. Please try again.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
