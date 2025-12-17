import { Users, UserCheck, X } from 'lucide-react'
import { getAvatarProps } from '@/utils/avatar-utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MOCK_USERS } from '../constants/project.constants'
import type { ProjectFormData } from '../types/project.types'

interface TeamAssignmentCardProps {
  formData: ProjectFormData
  onInputChange: (field: keyof ProjectFormData, value: unknown) => void
}

export function TeamAssignmentCard({
  formData,
  onInputChange,
}: TeamAssignmentCardProps) {
  // Get assigned users for display
  const getAssignedUsers = () => {
    const assignedIds = formData.assigned_to || []
    return MOCK_USERS.filter((user) => assignedIds.includes(user.id))
  }

  // Get available users (not yet assigned)
  const getAvailableUsers = () => {
    const assignedIds = formData.assigned_to || []
    return MOCK_USERS.filter((user) => !assignedIds.includes(user.id))
  }

  // Handle adding team member
  const handleAddTeamMember = (userId: string) => {
    const currentAssignedTo = formData.assigned_to || []
    if (!currentAssignedTo.includes(userId)) {
      onInputChange('assigned_to', [...currentAssignedTo, userId])
    }
  }

  // Handle removing team member
  const handleRemoveTeamMember = (userId: string) => {
    const currentAssignedTo = formData.assigned_to || []
    onInputChange(
      'assigned_to',
      currentAssignedTo.filter((id) => id !== userId)
    )
  }

  const assignedUsers = getAssignedUsers()

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
          <Users className='h-5 w-5 text-green-500' />
          Team Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='assigned_to' className='text-sm font-medium'>
            Assigned To
          </Label>
          <Select onValueChange={handleAddTeamMember} value=''>
            <SelectTrigger>
              <SelectValue placeholder='Add team member...' />
            </SelectTrigger>
            <SelectContent>
              {getAvailableUsers().map((user) => {
                const avatarProps = getAvatarProps(user.name)
                return (
                  <SelectItem key={user.id} value={user.id}>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${avatarProps.colorClass}`}
                      >
                        {avatarProps.initials}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {assignedUsers.length > 0 && (
          <div className='bg-muted/50 space-y-3 rounded-lg p-3'>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-xs'>
                <UserCheck className='mr-1 h-3 w-3' />
                {assignedUsers.length} Assigned
              </Badge>
            </div>

            <div className='space-y-2'>
              {assignedUsers.map((user) => {
                const avatarProps = getAvatarProps(user.name)
                return (
                  <div
                    key={user.id}
                    className='bg-background flex items-center justify-between rounded-md p-2'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${avatarProps.colorClass}`}
                      >
                        {avatarProps.initials}
                      </div>
                      <div>
                        <p className='text-sm font-medium'>{user.name}</p>
                        <p className='text-muted-foreground text-xs'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='hover:bg-destructive hover:text-destructive-foreground h-6 w-6 p-0'
                      onClick={() => handleRemoveTeamMember(user.id)}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className='rounded-lg border border-green-200 bg-green-50 p-3'>
          <div className='flex items-start gap-2'>
            <Users className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
            <div className='text-xs text-green-700'>
              <p className='font-medium'>Team Collaboration</p>
              <p className='mt-1'>
                Assign this project to a team member who will be responsible for
                monitoring progress and managing project tasks.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
