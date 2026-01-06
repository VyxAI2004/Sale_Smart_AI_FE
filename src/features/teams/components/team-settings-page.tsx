import { useState } from 'react'
import { useUpdateTeam } from '../hooks'
import { TeamMembersList } from './team-members-list'
import { TeamInviteDialog } from './team-invite-dialog'
import type { ITeam } from '../types'

interface TeamSettingsPageProps {
  team: ITeam | null
  currentUserId?: string
  onTeamUpdated?: () => void
}

/**
 * TeamSettingsPage Component
 * Full team management page with settings, members, invite, and delete
 */
export const TeamSettingsPage = ({
  team,
  currentUserId,
  onTeamUpdated,
}: TeamSettingsPageProps) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam()

  const isUserOwner = team?.created_by === currentUserId

  const handleEditClick = () => {
    setFormData({
      name: team?.name || '',
      description: team?.description || '',
    })
    setIsEditingInfo(true)
  }

  const handleSaveTeamInfo = () => {
    if (!team || !formData.name.trim()) return

    updateTeam(
      { teamId: team.id, data: formData },
      {
        onSuccess: () => {
          setIsEditingInfo(false)
          onTeamUpdated?.()
        },
      }
    )
  }

  if (!team) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='text-gray-500'>No team selected</div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Team Info Section */}
      <div className='bg-white rounded-lg border p-6'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-2xl font-bold'>{team.name}</h2>
          {isUserOwner && (
            <button
              onClick={handleEditClick}
              className='px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg'
            >
              Edit
            </button>
          )}
        </div>

        {isEditingInfo ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Team Name *</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleSaveTeamInfo}
                disabled={isUpdating}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditingInfo(false)}
                className='px-4 py-2 border rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {team.description && (
              <p className='text-gray-600 mb-2'>{team.description}</p>
            )}
            <div className='text-sm text-gray-500'>
              <p>Created by: {team.created_by}</p>
              <p>Created at: {new Date(team.created_at || '').toLocaleDateString()}</p>
            </div>
          </>
        )}
      </div>

      {/* Members Section */}
      <div className='bg-white rounded-lg border p-6'>
        <TeamMembersList
          team={team}
          currentUserId={currentUserId}
          onInviteClick={() => setIsInviteDialogOpen(true)}
        />
      </div>

      {/* Danger Zone */}
      {isUserOwner && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-red-600 mb-2'>Danger Zone</h3>
          <p className='text-sm text-gray-600 mb-4'>
            Deleting this team is permanent and cannot be undone. All team data will be lost.
          </p>
          {/* TODO: Implement delete team functionality with DeleteConfirmDialog */}
        </div>
      )}

      {/* Dialogs */}
      <TeamInviteDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        team={team}
        onSuccess={() => {}}
      />
    </div>
  )
}
