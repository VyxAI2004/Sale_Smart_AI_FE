import { useState } from 'react'
import { useInviteUserToTeam } from '../hooks'
import type { ITeamInviteRequest, ITeam } from '../types'

interface TeamInviteDialogProps {
  isOpen: boolean
  onClose: () => void
  team: ITeam | null
  onSuccess?: () => void
}

/**
 * TeamInviteDialog Component
 * Dialog to invite user to team
 */
export const TeamInviteDialog = ({
  isOpen,
  onClose,
  team,
  onSuccess,
}: TeamInviteDialogProps) => {
  const [formData, setFormData] = useState<ITeamInviteRequest>({
    email: '',
    role: 'member',
  })
  const { mutate: inviteUser, isPending } = useInviteUserToTeam()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!team || !formData.email.trim()) return

    inviteUser(
      { teamId: team.id, request: formData },
      {
        onSuccess: () => {
          setFormData({ email: '', role: 'member' })
          onClose()
          onSuccess?.()
        },
      }
    )
  }

  if (!isOpen || !team) return null

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-2 text-xl font-bold'>Invite to Team</h2>
        <p className='mb-4 text-sm text-gray-600'>{team.name}</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium'>
              Email Address *
            </label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder='user@example.com'
              className='w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              required
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium'>Role</label>
            <select
              value={formData.role || 'member'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'owner' | 'lead' | 'member',
                })
              }
              className='w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value='member'>Member</option>
              <option value='lead'>Lead</option>
              <option value='owner'>Owner</option>
            </select>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg border px-4 py-2 hover:bg-gray-50'
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
              disabled={isPending}
            >
              {isPending ? 'Inviting...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
