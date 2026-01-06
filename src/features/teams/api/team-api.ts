import http from '@/utils/http'
import type {
  ITeam,
  ITeamCreate,
  ITeamUpdate,
  ITeamInviteRequest,
  ITeamUser,
  IListTeamsResponse,
} from '../types'
import type { UUID } from 'crypto'

/**
 * Team API calls
 * Handles all team-related API operations
 */

export const createTeam = async (data: ITeamCreate) => {
  const response = await http.post<ITeam>('/teams', data)
  return response.data
}

export const getMyTeams = async (skip = 0, limit = 10) => {
  const response = await http.get<IListTeamsResponse>('/teams/my', {
    params: { skip, limit },
  })
  return response.data
}

export const getTeamDetails = async (teamId: UUID) => {
  const response = await http.get<ITeam>(`/teams/${teamId}`)
  return response.data
}

export const updateTeam = async (teamId: UUID, data: ITeamUpdate) => {
  const response = await http.put<ITeam>(`/teams/${teamId}`, data)
  return response.data
}

export const deleteTeam = async (teamId: UUID) => {
  const response = await http.delete(`/teams/${teamId}`)
  return response.data
}

export const createTeamUser = async (data: {
  username: string
  email: string
  full_name: string
  password: string
}) => {
  const response = await http.post<ITeamUser>('/users', {
    username: data.username,
    email: data.email,
    full_name: data.full_name,
    password_hash: data.password,
    is_active: true,
  })
  return response.data
}

export const getTeamMembers = async (teamId: UUID) => {
  const response = await http.get<ITeamUser[]>(`/teams/${teamId}/members`)
  return response.data
}

export const inviteUserToTeam = async (teamId: UUID, request: ITeamInviteRequest) => {
  const response = await http.post<ITeamUser>(`/teams/${teamId}/invite`, request)
  return response.data
}

export const updateMemberRole = async (teamId: UUID, userId: UUID, newRole: string) => {
  const response = await http.put<ITeamUser>(`/teams/${teamId}/members/${userId}`, undefined, {
    params: { new_role: newRole },
  })
  return response.data
}

export const updateTeamMember = async (teamId: UUID, userId: UUID, role: string, status: string) => {
  const response = await http.put<ITeamUser>(`/teams/${teamId}/members/${userId}`, undefined, {
    params: { new_role: role, new_status: status },
  })
  return response.data
}

export const removeTeamMember = async (teamId: UUID, userId: UUID) => {
  const response = await http.delete(`/teams/${teamId}/members/${userId}`)
  return response.data
}
