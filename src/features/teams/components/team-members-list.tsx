import { useTeamMembers, useRemoveTeamMember, useUpdateMemberRole } from '../hooks'
import type { ITeam, ITeamUser } from '../types'
import type { UUID } from 'crypto'

interface TeamMembersListProps {
  team: ITeam | null
  currentUserId?: string
  onInviteClick?: () => void
}

/**
 * TeamMembersList Component
 * Displays list of team members with their roles and actions
 */
export const TeamMembersList = ({ team, currentUserId, onInviteClick }: TeamMembersListProps) => {
  const { data: members = [], isLoading } = useTeamMembers(team?.id)
  const { mutate: removeMember } = useRemoveTeamMember()
  const { mutate: updateRole } = useUpdateMemberRole()

  if (!team) return null

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='text-gray-500'>Loading members...</div>
      </div>
    )
  }

  const handleRemoveMember = (userId: string | undefined) => {
    if (!userId) return
    if (!team?.id) return
    if (window.confirm('Are you sure you want to remove this member?')) {
      removeMember({ teamId: team.id as UUID, userId: userId as UUID })
    }
  }

  const handleUpdateRole = (userId: string | undefined, newRole: 'owner' | 'lead' | 'member') => {
    if (!userId) return
    if (!team?.id) return
    updateRole({ teamId: team.id as UUID, userId: userId as UUID, newRole })
  }

  const isUserOwner = members.some((m: ITeamUser) => m.user_id === currentUserId && m.role === 'owner')

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Team Members ({members?.length || 0})</h3>
        {isUserOwner && (
          <button
            onClick={onInviteClick}
            className='px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700'
          >
            + Invite Member
          </button>
        )}
      </div>

      {!members || members.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>No members yet</div>
      ) : (
        <div className='overflow-x-auto border rounded-lg'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b'>
              <tr>
                <th className='px-6 py-3 text-left text-sm font-semibold'>Name</th>
                <th className='px-6 py-3 text-left text-sm font-semibold'>Email</th>
                <th className='px-6 py-3 text-left text-sm font-semibold'>Role</th>
                <th className='px-6 py-3 text-left text-sm font-semibold'>Status</th>
                <th className='px-6 py-3 text-left text-sm font-semibold'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member: ITeamUser) => (
                <tr key={member.id} className='border-b hover:bg-gray-50'>
                  <td className='px-6 py-4 text-sm'>
                    <div className='font-medium'>Member</div>
                  </td>
                  <td className='px-6 py-4 text-sm'>{member.user_id}</td>
                  <td className='px-6 py-4 text-sm'>
                    {isUserOwner && member.user_id !== currentUserId ? (
                      <select
                        value={member.role || 'member'}
                        onChange={(e) =>
                          handleUpdateRole(member.user_id, e.target.value as 'owner' | 'lead' | 'member')
                        }
                        className='px-2 py-1 border rounded text-sm'
                      >
                        <option value='member'>Member</option>
                        <option value='lead'>Lead</option>
                        <option value='owner'>Owner</option>
                      </select>
                    ) : (
                      <span className='px-2 py-1 bg-gray-100 rounded text-sm capitalize'>
                        {member.role || 'member'}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-sm'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        member.accepted_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {member.accepted_at ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm'>
                    {isUserOwner && member.user_id !== currentUserId && (
                      <button
                        onClick={() => handleRemoveMember(member.user_id)}
                        className='text-red-600 hover:text-red-800 text-sm font-medium'
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
