import { useState } from 'react'
import { useUpdateTeam } from '../hooks'
import type { ITeam } from '../types'
import { TeamInviteDialog } from './team-invite-dialog'
import { TeamMembersList } from './team-members-list'

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
      <div className='flex items-center justify-center py-12'>
        <div className='text-gray-500'>No team selected</div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Team Info Section */}
      <div className='rounded-lg border bg-white p-6'>
        <div className='mb-4 flex items-start justify-between'>
          <h2 className='text-2xl font-bold'>{team.name}</h2>
          {isUserOwner && (
            <button
              onClick={handleEditClick}
              className='rounded-lg bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300'
            >
              Edit
            </button>
          )}
        </div>

        {isEditingInfo ? (
          <div className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Team Name *
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className='w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleSaveTeamInfo}
                disabled={isUpdating}
                className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditingInfo(false)}
                className='rounded-lg border px-4 py-2 hover:bg-gray-50'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {team.description && (
              <p className='mb-2 text-gray-600'>{team.description}</p>
            )}
            <div className='text-sm text-gray-500'>
              <p>Created by: {team.created_by}</p>
              <p>
                Created at:{' '}
                {new Date(team.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Members Section */}
      <div className='rounded-lg border bg-white p-6'>
        <TeamMembersList
          team={team}
          currentUserId={currentUserId}
          onInviteClick={() => setIsInviteDialogOpen(true)}
        />
      </div>

      {/* Danger Zone */}
      {isUserOwner && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
          <h3 className='mb-2 text-lg font-semibold text-red-600'>
            Danger Zone
          </h3>
          <p className='mb-4 text-sm text-gray-600'>
            Deleting this team is permanent and cannot be undone. All team data
            will be lost.
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
