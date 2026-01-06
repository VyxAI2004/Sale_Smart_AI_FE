import type { UUID } from 'crypto'

export interface ITeamUser {
  id: UUID
  team_id: UUID
  user_id: UUID
  role: 'owner' | 'lead' | 'member'
  status: 'active' | 'pending' | 'inactive'
  is_active: boolean
  joined_at: string
  invited_at?: string
  accepted_at?: string
}

export interface ITeam {
  id: UUID
  name: string
  description?: string
  created_by: UUID
  is_active: boolean
  created_at: string
  updated_at: string
  members?: ITeamUser[]
}

export interface ITeamCreate {
  name: string
  description?: string
}

export interface ITeamUpdate {
  name?: string
  description?: string
}

export interface ITeamInviteRequest {
  email: string
  role?: 'owner' | 'lead' | 'member'
}

export interface IListTeamsResponse {
  data: ITeam[]
  total: number
}
