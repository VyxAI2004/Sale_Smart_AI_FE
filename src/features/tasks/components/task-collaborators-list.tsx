/**
 * Task Collaborators List Component
 */
'use client'

import { Trash2, Users, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAvatarProps } from '@/utils/avatar-utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTaskCollaborators, useRemoveTaskCollaborator } from '../hooks/use-task-collaborators'
import { TASK_COLLABORATOR_ROLES } from '../types/task-collaborator.types'

interface TaskCollaboratorsListProps {
  taskId: string
  onInviteClick?: () => void
}

export function TaskCollaboratorsList({
  taskId,
  onInviteClick,
}: TaskCollaboratorsListProps) {
  const { data: collaborators, isLoading, error } = useTaskCollaborators(taskId)
  const removeMutation = useRemoveTaskCollaborator()

  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this collaborator?')) return

    try {
      await removeMutation.mutateAsync({ taskId, userId })
    } catch (error) {
      console.error('Failed to remove collaborator:', error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[1, 2].map((i) => (
              <div key={i} className='h-12 bg-gray-200 rounded animate-pulse' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='rounded-md bg-red-50 p-4 text-sm text-red-700'>
            Failed to load collaborators
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          Collaborators ({collaborators?.length || 0})
        </CardTitle>
        <Button size='sm' onClick={onInviteClick} variant='outline'>
          <UserPlus className='h-4 w-4 mr-1' />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {!collaborators || collaborators.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <Users className='h-12 w-12 mx-auto mb-2 opacity-50' />
            <p>No collaborators yet</p>
            <Button variant='outline' size='sm' className='mt-4' onClick={onInviteClick}>
              Add collaborator
            </Button>
          </div>
        ) : (
          <div className='space-y-3'>
            {collaborators.map((collaborator) => {
              const avatarProps = getAvatarProps(collaborator.user_name || 'User')
              const roleInfo = TASK_COLLABORATOR_ROLES[collaborator.role as keyof typeof TASK_COLLABORATOR_ROLES]

              return (
                <div
                  key={collaborator.id}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'
                >
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className={avatarProps.colorClass}>
                        {avatarProps.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{collaborator.user_name}</p>
                      <p className='text-xs text-gray-500 truncate'>{collaborator.user_email}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    {roleInfo && (
                      <Badge variant='secondary' className='ml-2 whitespace-nowrap'>
                        {roleInfo.label}
                      </Badge>
                    )}
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleRemoveCollaborator(collaborator.user_id as string)}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className='h-4 w-4 text-red-500 hover:text-red-700' />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
