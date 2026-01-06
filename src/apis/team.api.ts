import http from '@/utils/http'
import type {
  ITeam,
  ITeamCreate,
  ITeamUpdate,
  ITeamInviteRequest,
  ITeamUser,
  IListTeamsResponse,
} from '@/types/team.types'
import type { UUID } from 'crypto'

// Create a new team
export const createTeam = (data: ITeamCreate) =>
  http.post<ITeam>('/teams', data)

// Get all teams for current user
export const getMyTeams = (skip = 0, limit = 10) =>
  http.get<IListTeamsResponse>('/teams/my', {
    params: { skip, limit },
  })

// Get team details
export const getTeamDetails = (teamId: UUID) =>
  http.get<ITeam>(`/teams/${teamId}`)

// Update team
export const updateTeam = (teamId: UUID, data: ITeamUpdate) =>
  http.put<ITeam>(`/teams/${teamId}`, data)

// Delete team
export const deleteTeam = (teamId: UUID) =>
  http.delete(`/teams/${teamId}`)

// Get team members
export const getTeamMembers = (teamId: UUID) =>
  http.get<ITeamUser[]>(`/teams/${teamId}/members`)

// Invite user to team
export const inviteUserToTeam = (teamId: UUID, request: ITeamInviteRequest) =>
  http.post<ITeamUser>(`/teams/${teamId}/invite`, request)

// Update member role
export const updateMemberRole = (teamId: UUID, userId: UUID, newRole: string) =>
  http.put<ITeamUser>(`/teams/${teamId}/members/${userId}`, undefined, {
    params: { new_role: newRole },
  })

// Remove team member
export const removeTeamMember = (teamId: UUID, userId: UUID) =>
  http.delete(`/teams/${teamId}/members/${userId}`)
