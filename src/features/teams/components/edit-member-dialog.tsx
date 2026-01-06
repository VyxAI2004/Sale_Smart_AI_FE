'use client'

import { useState, useEffect } from 'react'
import type { UUID } from 'crypto'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateTeamMember } from '../hooks'
import type { ITeamUser } from '../types'

interface EditMemberDialogProps {
  member: ITeamUser | null
  teamId: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const ROLES = ['member', 'lead', 'owner'] as const
const STATUSES = ['active', 'inactive', 'pending'] as const

export const EditMemberDialog = ({
  member,
  teamId,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditMemberDialogProps) => {
  const { t } = useTranslation()
  const [role, setRole] = useState<string>('member')
  const [status, setStatus] = useState<string>('active')
  const { mutate: updateMember, isPending: isUpdating } = useUpdateTeamMember()

  // Update local state when member changes or dialog opens
  useEffect(() => {
    if (member && isOpen) {
      setRole(member.role)
      setStatus(member.status)
    }
  }, [member, isOpen])

  const handleUpdate = async () => {
    if (!member || !teamId) return

    updateMember(
      {
        teamId: teamId as UUID,
        userId: member.user_id as UUID,
        role,
        status,
      },
      {
        onSuccess: () => {
          toast.success(t('teams.memberUpdated'))
          onOpenChange(false)
          onSuccess?.()
        },
        onError: (error) => {
          toast.error(t('teams.updateError'))
          console.error('Error updating member:', error)
        },
      }
    )
  }

  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{t('teams.editMember')}</DialogTitle>
          <DialogDescription>
            {member.full_name} ({member.username})
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Role */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('teams.role')}</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`teams.roles.${r}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('teams.status')}</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className='flex gap-2 pt-4'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
              className='flex-1'
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className='flex-1'
            >
              {isUpdating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {t('common.updating')}
                </>
              ) : (
                <>{t('teams.update')}</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
