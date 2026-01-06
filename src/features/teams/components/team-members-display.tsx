import { useState } from 'react'
import type { UUID } from 'crypto'
import { AlertCircle, Trash2, UserPlus, Loader2 } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useTeamMembers,
  useUpdateMemberRole,
  useRemoveTeamMember,
} from '../hooks'
import type { ITeamUser } from '../types'

interface TeamMembersDisplayProps {
  teamId?: UUID | null
  onAddMemberClick?: () => void
  isLoadingTeams?: boolean
}

type RoleType = 'owner' | 'lead' | 'member'

export const TeamMembersDisplay = ({
  teamId,
  onAddMemberClick,
  isLoadingTeams = false,
}: TeamMembersDisplayProps) => {
  const { t } = useTranslation()
  const [updatingRoleId, setUpdatingRoleId] = useState<UUID | null>(null)
  const [removingId, setRemovingId] = useState<UUID | null>(null)

  const { data: rawMembers = [], isLoading: isLoadingMembers } =
    useTeamMembers(teamId)
  const { mutate: updateRole } = useUpdateMemberRole()
  const { mutate: removeMember } = useRemoveTeamMember()

  // Ensure members is always an array
  const members = Array.isArray(rawMembers) ? rawMembers : []

  const handleRoleChange = (member: ITeamUser, newRole: RoleType) => {
    setUpdatingRoleId(member.id)
    updateRole(
      {
        teamId: member.team_id,
        userId: member.user_id,
        newRole,
      },
      {
        onSettled: () => {
          setUpdatingRoleId(null)
        },
      }
    )
  }

  const handleRemoveMember = (member: ITeamUser) => {
    if (confirm(t('teams.confirmRemoveMember'))) {
      setRemovingId(member.id)
      removeMember(
        {
          teamId: member.team_id,
          userId: member.user_id,
        },
        {
          onSettled: () => {
            setRemovingId(null)
          },
        }
      )
    }
  }

  const isLoading = isLoadingTeams || isLoadingMembers

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <Button disabled>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            {t('common.loading')}
          </Button>
        </div>
      </div>
    )
  }

  if (!teamId) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>{t('teams.errors.noTeamSelected')}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button onClick={onAddMemberClick}>
          <UserPlus className='mr-2 h-4 w-4' />
          {t('teams.addMember')}
        </Button>
      </div>

      {members.length === 0 ? (
        <div className='rounded-lg border border-dashed p-8 text-center'>
          <p className='text-muted-foreground'>{t('teams.noMembers')}</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {members.map((member: ITeamUser) => (
            <div
              key={member.id}
              className='flex items-center justify-between rounded-lg border p-4'
            >
              <div className='flex-1'>
                <p className='font-medium'>
                  {member.full_name || member.username}
                </p>
                <p className='text-muted-foreground text-sm'>{member.email}</p>
              </div>

              <div className='flex items-center gap-2'>
                <Select
                  value={member.role}
                  onValueChange={(newRole) =>
                    handleRoleChange(member, newRole as RoleType)
                  }
                  disabled={updatingRoleId === member.id}
                >
                  <SelectTrigger
                    className='w-[120px]'
                    disabled={updatingRoleId === member.id}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='member'>
                      {t('teams.roles.member')}
                    </SelectItem>
                    <SelectItem value='lead'>
                      {t('teams.roles.lead')}
                    </SelectItem>
                    <SelectItem value='owner'>
                      {t('teams.roles.owner')}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemoveMember(member)}
                  disabled={removingId === member.id}
                >
                  {removingId === member.id ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Trash2 className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
