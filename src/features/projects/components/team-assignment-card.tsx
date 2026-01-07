import { useEffect, useState } from 'react'
import { Users, UserCheck, X } from 'lucide-react'
import { useTeams } from '@/features/teams/hooks/use-teams'
import { useTeamMembers } from '@/features/teams/hooks/use-team-members'
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
import type { ProjectFormData } from '../types/project.types'
import type { ITeamUser } from '@/features/teams/types'

interface TeamAssignmentCardProps {
  formData: ProjectFormData
  onInputChange: (field: keyof ProjectFormData, value: unknown) => void
}

export function TeamAssignmentCard({
  formData,
  onInputChange,
}: TeamAssignmentCardProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const { data: teams = [] } = useTeams(0, 100)
  const { data: teamMembers = [] } = useTeamMembers(
    selectedTeamId ? (selectedTeamId as any) : null
  )

  useEffect(() => {
    // Set first team as default
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id as string)
    }
  }, [teams, selectedTeamId])

  // Get assigned users for display
  const getAssignedUsers = () => {
    const assignedIds = formData.assigned_to || []
    return teamMembers.filter((user: ITeamUser) =>
      assignedIds.includes(user.user_id as string)
    )
  }

  // Get available users (not yet assigned)
  const getAvailableUsers = () => {
    const assignedIds = formData.assigned_to || []
    return teamMembers.filter(
      (user: ITeamUser) => !assignedIds.includes(user.user_id as string)
    )
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
        {/* Team Selector */}
        <div className='space-y-2'>
          <Label htmlFor='team_select' className='text-sm font-medium'>
            Select Team
          </Label>
          <Select value={selectedTeamId || ''} onValueChange={setSelectedTeamId}>
            <SelectTrigger id='team_select'>
              <SelectValue placeholder='Select a team...' />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id as string}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Member Assignment */}
        <div className='space-y-2'>
          <Label htmlFor='assigned_to' className='text-sm font-medium'>
            Assign Members To
          </Label>
          <Select onValueChange={handleAddTeamMember} value=''>
            <SelectTrigger>
              <SelectValue placeholder='Add team member...' />
            </SelectTrigger>
            <SelectContent>
              {getAvailableUsers().map((user: ITeamUser) => {
                const avatarProps = getAvatarProps(user.full_name)
                return (
                  <SelectItem key={user.user_id} value={user.user_id as string}>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${avatarProps.colorClass}`}
                      >
                        {avatarProps.initials}
                      </div>
                      <span>{user.full_name}</span>
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
              {assignedUsers.map((user: ITeamUser) => {
                const avatarProps = getAvatarProps(user.full_name)
                return (
                  <div
                    key={user.user_id}
                    className='bg-background flex items-center justify-between rounded-md p-2'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${avatarProps.colorClass}`}
                      >
                        {avatarProps.initials}
                      </div>
                      <div>
                        <p className='text-sm font-medium'>{user.full_name}</p>
                        <p className='text-muted-foreground text-xs'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='hover:bg-destructive hover:text-destructive-foreground h-6 w-6 p-0'
                      onClick={() =>
                        handleRemoveTeamMember(user.user_id as string)
                      }
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
                Assign this project to team members who will be responsible for
                monitoring progress and managing project tasks.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
