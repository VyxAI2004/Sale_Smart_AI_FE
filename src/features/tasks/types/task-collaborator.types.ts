/**
 * Types for Task Collaborator Management
 */
import type { UUID } from 'crypto'

export interface TaskCollaborator {
  id: UUID
  task_id: UUID
  user_id: UUID
  user_name?: string
  user_email?: string
  user_avatar?: string
  role: string // read_only, editor, collaborator
  is_active: boolean
  invited_at?: string
  invited_by_name?: string
  can_view: boolean
  can_edit: boolean
  can_comment: boolean
}

export interface TaskInvite {
  user_email: string
  role?: string // read_only, editor, collaborator
  message?: string
}

export type TaskCollaboratorRole = 'read_only' | 'editor' | 'collaborator'

export const TASK_COLLABORATOR_ROLES: Record<
  TaskCollaboratorRole,
  { label: string; icon: string; description: string }
> = {
  read_only: {
    label: 'View Only',
    icon: 'Eye',
    description: 'Can view task and comments',
  },
  editor: {
    label: 'Editor',
    icon: 'Edit',
    description: 'Can view and edit task details',
  },
  collaborator: {
    label: 'Collaborator',
    icon: 'Users',
    description: 'Can edit, comment, and manage',
  },
}
