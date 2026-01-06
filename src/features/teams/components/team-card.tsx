import { useState } from 'react'
import { toast } from 'sonner'
import { MoreVertical, Users, Trash2, UserPlus, Info } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/use-translation'
import type { ITeam, ITeamUser } from '../types'
import { DeleteConfirmDialog } from './delete-confirm-dialog'

interface TeamCardProps {
  team: ITeam
  onAddMember?: () => void
  onDelete?: (teamId: string) => Promise<void>
  onDetail?: () => void
  isDeleting?: boolean
}

const AvatarInitials = ({ name, index }: { name: string; index: number }) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-indigo-500',
  ]
  const color = colors[index % colors.length]
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={`${color} flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white`}
    >
      {initials}
    </div>
  )
}

export const TeamCard = ({
  team,
  onAddMember,
  onDelete,
  onDetail,
  isDeleting,
}: TeamCardProps) => {
  const { t } = useTranslation()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const members = team.members || []
  const visibleMembers = members.slice(0, 3)
  const extraCount = Math.max(0, members.length - 3)

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(team.id as string)
      toast.success(`${t('teams.team')} "${team.name}" ${t('teams.deleted')}`)
    }
  }

  return (
    <div className='rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow'>
      {/* Header with title and menu */}
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-base truncate'>{team.name}</h3>
          {team.description && (
            <p className='text-xs text-muted-foreground line-clamp-2'>
              {team.description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              disabled={isDeleting}
            >
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={onDetail}>
              <Info className='mr-2 h-4 w-4' />
              {t('teams.detail')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddMember}>
              <UserPlus className='mr-2 h-4 w-4' />
              {t('teams.addMember')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className='text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {t('teams.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemName={team.name}
        itemDisplayName={team.name}
        onConfirm={handleDelete}
        requireNameConfirmation={false}
      />

      {/* Members section */}
      <div className='mt-4 flex items-center gap-2'>
        <Users className='h-4 w-4 text-muted-foreground' />
        <span className='text-xs text-muted-foreground'>
          {members.length}{' '}
          {members.length !== 1
            ? t('teams.content.membersPlural')
            : t('teams.content.memberSingular')}
        </span>
      </div>

      {/* Avatar stack */}
      <div className='mt-3 flex items-center'>
        <div className='flex -space-x-2'>
          {visibleMembers.map((member: ITeamUser, index: number) => (
            <div
              key={member.id}
              title={`${member.full_name} (${member.username})`}
              className='relative'
            >
              <AvatarInitials name={member.full_name} index={index} />
            </div>
          ))}
          {extraCount > 0 && (
            <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-white'>
              +{extraCount}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className='mt-4 text-xs text-muted-foreground'>
        {t('teams.created')}: {new Date(team.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}
