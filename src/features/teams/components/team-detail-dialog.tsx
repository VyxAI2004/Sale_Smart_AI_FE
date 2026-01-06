import { useState, useEffect } from 'react'
import { Edit2, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/use-translation'
import { Separator } from '@/components/ui/separator'
import type { ITeam, ITeamUser } from '../types'
import { EditMemberDialog } from './edit-member-dialog'

interface TeamDetailDialogProps {
  team: ITeam | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddMember?: () => void
}

export const TeamDetailDialog = ({
  team,
  isOpen,
  onOpenChange,
  onAddMember,
}: TeamDetailDialogProps) => {
  const { t } = useTranslation()
  const [selectedMember, setSelectedMember] = useState<ITeamUser | null>(null)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)

  // Sync selected member when team changes (for updated data)
  useEffect(() => {
    if (selectedMember && team?.members) {
      const updatedMember = team.members.find(m => m.id === selectedMember.id)
      if (updatedMember) {
        setSelectedMember(updatedMember)
      }
    }
  }, [team])

  if (!team) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{team.name}</DialogTitle>
            <DialogDescription>
              {t('teams.teamDetails')}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
          {/* Description */}
          <div>
            <h4 className='text-sm font-semibold'>{t('teams.description')}</h4>
            <p className='text-sm text-muted-foreground mt-1'>
              {team.description || t('teams.noDescription')}
            </p>
          </div>

          <Separator />

          {/* Created info */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-xs font-semibold text-muted-foreground uppercase'>
                {t('teams.created')}
              </h4>
              <p className='text-sm mt-1'>
                {new Date(team.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className='text-xs font-semibold text-muted-foreground uppercase'>
                {t('teams.status')}
              </h4>
              <p className='text-sm mt-1'>
                {team.is_active ? t('teams.active') : t('teams.inactive')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Members */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-sm font-semibold'>
                {t('teams.members')} ({team.members?.length || 0})
              </h4>
              {onAddMember && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={onAddMember}
                  className='h-8'
                >
                  <UserPlus className='mr-1 h-4 w-4' />
                  {t('teams.addMember')}
                </Button>
              )}
            </div>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {team.members && team.members.length > 0 ? (
                team.members.map((member) => (
                  <div
                    key={member.id}
                    className='flex items-center justify-between rounded-lg bg-muted p-2'
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        {member.full_name}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {member.email}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 ml-2'>
                      <span className='text-xs bg-background px-2 py-1 rounded'>
                        {member.role}
                      </span>
                      <span className='text-xs bg-background px-2 py-1 rounded'>
                        {member.status}
                      </span>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => {
                          setSelectedMember(member)
                          setIsEditMemberOpen(true)
                        }}
                        className='h-6 w-6 p-0'
                      >
                        <Edit2 className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-xs text-muted-foreground'>
                  {t('teams.noMembers')}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <EditMemberDialog
      member={selectedMember}
      teamId={team?.id || null}
      isOpen={isEditMemberOpen}
      onOpenChange={setIsEditMemberOpen}
      onSuccess={() => {
        setIsEditMemberOpen(false)
      }}
    />
    </>
  )
}
