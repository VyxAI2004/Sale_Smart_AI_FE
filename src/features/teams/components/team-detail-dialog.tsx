import { useState, useEffect } from 'react'
import { Edit2, UserPlus } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
      const updatedMember = team.members.find((m) => m.id === selectedMember.id)
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
            <DialogDescription>{t('teams.teamDetails')}</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Description */}
            <div>
              <h4 className='text-sm font-semibold'>
                {t('teams.description')}
              </h4>
              <p className='text-muted-foreground mt-1 text-sm'>
                {team.description || t('teams.noDescription')}
              </p>
            </div>

            <Separator />

            {/* Created info */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h4 className='text-muted-foreground text-xs font-semibold uppercase'>
                  {t('teams.created')}
                </h4>
                <p className='mt-1 text-sm'>
                  {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className='text-muted-foreground text-xs font-semibold uppercase'>
                  {t('teams.status')}
                </h4>
                <p className='mt-1 text-sm'>
                  {team.is_active ? t('teams.active') : t('teams.inactive')}
                </p>
              </div>
            </div>

            <Separator />

            {/* Members */}
            <div>
              <div className='mb-3 flex items-center justify-between'>
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
              <div className='max-h-64 space-y-2 overflow-y-auto'>
                {team.members && team.members.length > 0 ? (
                  team.members.map((member) => (
                    <div
                      key={member.id}
                      className='bg-muted flex items-center justify-between rounded-lg p-2'
                    >
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium'>
                          {member.full_name}
                        </p>
                        <p className='text-muted-foreground truncate text-xs'>
                          {member.email}
                        </p>
                      </div>
                      <div className='ml-2 flex items-center gap-2'>
                        <span className='bg-background rounded px-2 py-1 text-xs'>
                          {member.role}
                        </span>
                        <span className='bg-background rounded px-2 py-1 text-xs'>
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
                  <p className='text-muted-foreground text-xs'>
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
