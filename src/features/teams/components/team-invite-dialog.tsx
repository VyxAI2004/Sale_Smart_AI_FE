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
export const TeamInviteDialog = ({ isOpen, onClose, team, onSuccess }: TeamInviteDialogProps) => {
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-bold mb-2'>Invite to Team</h2>
        <p className='text-gray-600 text-sm mb-4'>{team.name}</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Email Address *</label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder='user@example.com'
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Role</label>
            <select
              value={formData.role || 'member'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'owner' | 'lead' | 'member',
                })
              }
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='member'>Member</option>
              <option value='lead'>Lead</option>
              <option value='owner'>Owner</option>
            </select>
          </div>

          <div className='flex gap-2 justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border rounded-lg hover:bg-gray-50'
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
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
