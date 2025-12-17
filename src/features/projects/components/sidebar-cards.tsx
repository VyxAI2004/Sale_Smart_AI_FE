import { Plus, X } from 'lucide-react'
import { getAvatarProps } from '@/utils/avatar-utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  STATUS_OPTIONS,
  PRODUCT_CATEGORIES,
  MOCK_USERS,
} from '../constants/project.constants'
import type { ProjectFormData } from '../types/project.types'

interface SidebarCardsProps {
  formData: ProjectFormData
  onInputChange: (field: keyof ProjectFormData, value: unknown) => void
}

export const SidebarCards = ({
  formData,
  onInputChange,
}: SidebarCardsProps) => {
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

  return (
    <div className='space-y-6'>
      {/* Status Card */}
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>Status</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Select
              value={formData.status}
              onValueChange={(value) => onInputChange('status', value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <span className='truncate'>{status.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='text-muted-foreground text-xs'>
              Set the current project status.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Categories Card */}
      <Card className='shadow-sm'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg font-semibold'>Categories</CardTitle>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => {
                // TODO: Implement add category functionality
              }}
            >
              <Plus className='h-4 w-4' />
              <span className='sr-only'>Add category</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Select
              value={formData.target_product_category}
              onValueChange={(value) =>
                onInputChange('target_product_category', value)
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    <span className='truncate'>{category}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='text-muted-foreground text-xs'>
              Choose the target product category.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Card */}
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>Assignment</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            {/* Add team member select */}
            <Select onValueChange={handleAddTeamMember} value=''>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Add team member...' />
              </SelectTrigger>
              <SelectContent>
                {getAvailableUsers().map((user) => {
                  const avatarProps = getAvatarProps(user.name)
                  return (
                    <SelectItem key={user.id} value={user.id}>
                      <div className='flex items-center space-x-2'>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${avatarProps.colorClass}`}
                        >
                          {avatarProps.initials}
                        </div>
                        <span className='truncate'>{user.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {/* Assigned team members badges */}
            {getAssignedUsers().length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {getAssignedUsers().map((user) => {
                  const avatarProps = getAvatarProps(user.name)
                  return (
                    <Badge
                      key={user.id}
                      variant='secondary'
                      className='flex items-center gap-1 pr-1'
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${avatarProps.colorClass}`}
                      >
                        {avatarProps.initials}
                      </div>
                      <span className='text-xs'>{user.name}</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='hover:bg-destructive hover:text-destructive-foreground ml-1 h-4 w-4 p-0'
                        onClick={() => handleRemoveTeamMember(user.id)}
                      >
                        <X className='h-3 w-3' />
                        <span className='sr-only'>Remove {user.name}</span>
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            )}

            <p className='text-muted-foreground text-xs'>
              {getAssignedUsers().length === 0
                ? 'No team members assigned yet.'
                : `${getAssignedUsers().length} team member${getAssignedUsers().length > 1 ? 's' : ''} assigned.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
