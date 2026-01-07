import { useState, useEffect, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import {
  Users,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  UserPlus,
} from 'lucide-react'
import { getAvatarProps } from '@/utils/avatar-utils'
import { useTranslation } from '@/hooks/use-translation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Task } from '@/features/tasks/types/task.types'
import { getTeamMembers } from '@/features/teams/api'
import { useTeams } from '@/features/teams/hooks/use-teams'
import type { ITeamUser } from '@/features/teams/types'
import {
  useInviteProjectUser,
  useProjectUsers,
  useRemoveProjectUser,
  useUpdateProjectUserRole,
} from '../../hooks/use-project-users'
import type {
  ProjectDetailData,
  ProjectTask,
} from '../../types/project-detail.types'
import { RemoveProjectUserDialog } from './remove-project-user-dialog'

interface TeamManagementCardProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  tasks?: Task[]
  tasksLoading?: boolean
}

const PROJECT_ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

export function TeamManagementCard({
  project,
  isLoading = false,
  tasks = [],
  tasksLoading = false,
}: TeamManagementCardProps) {
  const { t } = useTranslation()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTeamIds, setSelectedTeamIds] = useState<Set<string>>(new Set())
  const [selectedMemberId, setSelectedMemberId] = useState<string>('')
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedUserToRemove, setSelectedUserToRemove] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<string>('member')

  // Use real API hooks
  const { data: projectUsers = [], isLoading: usersLoading } = useProjectUsers(
    project?.id
  )
  const { data: teams = [] } = useTeams(0, 100)

  // Use useQueries to fetch members for all selected teams in parallel
  const teamMembersResults = useQueries({
    queries: Array.from(selectedTeamIds).map((teamId) => ({
      queryKey: ['team-members', teamId],
      queryFn: () => getTeamMembers(teamId as any),
      enabled: selectedTeamIds.size > 0,
    })),
  })

  // Extract data array to use as stable dependency
  const teamMembersData = teamMembersResults.map((r) => r.data)

  const inviteUserMutation = useInviteProjectUser()
  const removeUserMutation = useRemoveProjectUser()
  const updateRoleUserMutation = useUpdateProjectUserRole()

  // Set all teams as selected by default
  useEffect(() => {
    if (teams.length > 0 && selectedTeamIds.size === 0) {
      setSelectedTeamIds(new Set(teams.map((t) => t.id as string)))
    }
  }, [teams])

  // Get filtered members based on selected teams
  const allFilteredMembers = useMemo(() => {
    if (selectedTeamIds.size === 0) return []

    // Combine members from all selected teams
    const memberMap = new Map<string, ITeamUser & { teamIds: Set<string> }>()

    const selectedTeamIdsArray = Array.from(selectedTeamIds)
    teamMembersResults.forEach((result, index) => {
      if (result.data && Array.isArray(result.data)) {
        const teamId = selectedTeamIdsArray[index]
        result.data.forEach((member: ITeamUser) => {
          if (!memberMap.has(member.user_id as string)) {
            memberMap.set(member.user_id as string, {
              ...member,
              teamIds: new Set(),
            })
          }
          memberMap.get(member.user_id as string)!.teamIds.add(teamId)
        })
      }
    })

    return Array.from(memberMap.values())
  }, [teamMembersData, selectedTeamIds])

  // Get available members (not already invited to project)
  const getAvailableMembers = () => {
    const projectUserIds = projectUsers.map((u) => u.user_id)
    return allFilteredMembers.filter(
      (member) => !projectUserIds.includes(member.user_id as string)
    )
  }

  const toggleTeam = (teamId: string) => {
    const newSelectedTeamIds = new Set(selectedTeamIds)
    if (newSelectedTeamIds.has(teamId)) {
      newSelectedTeamIds.delete(teamId)
    } else {
      newSelectedTeamIds.add(teamId)
    }
    setSelectedTeamIds(newSelectedTeamIds)
    setSelectedMemberId('')
  }

  const handleCloseDialog = () => {
    setInviteDialogOpen(false)
    setSelectedMemberId('')
    setSelectedRole('member')
  }

  const getTaskStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className='h-4 w-4 text-green-500' />
      case 'in_progress':
        return <Clock className='h-4 w-4 text-blue-500' />
      case 'pending':
        return <Clock className='h-4 w-4 text-yellow-500' />
      case 'failed':
        return <AlertCircle className='h-4 w-4 text-red-500' />
      default:
        return <Clock className='h-4 w-4 text-gray-400' />
    }
  }

  const getTaskStatusBadge = (status: ProjectTask['status']) => {
    const variants = {
      completed: 'default',
      in_progress: 'secondary',
      pending: 'outline',
      failed: 'destructive',
    } as const

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const handleAddMember = async () => {
    if (!project?.id || !selectedMemberId) return

    // Find the selected member from filtered members
    const selectedMember = allFilteredMembers.find(
      (m) => m.user_id === selectedMemberId
    )
    if (!selectedMember?.email) return

    try {
      await inviteUserMutation.mutateAsync({
        projectId: project.id,
        payload: {
          email: selectedMember.email,
          role: selectedRole,
        },
      })
      setSelectedMemberId('')
      setSelectedRole('member')
      setInviteDialogOpen(false)
    } catch (error) {
      console.error('Failed to invite member:', error)
      // Error is handled by mutation toast
    }
  }

  const handleConfirmRemove = async () => {
    if (!project?.id || !selectedUserToRemove) return

    try {
      await removeUserMutation.mutateAsync({
        projectId: project.id,
        userId: selectedUserToRemove.id,
      })
      setRemoveDialogOpen(false)
      setSelectedUserToRemove(null)
    } catch (error) {
      console.error('Failed to remove member:', error)
      // Error is handled by mutation toast
    }
  }

  const handleRemoveFromEdit = (member: any) => {
    setSelectedUserToRemove(member)
    setRemoveDialogOpen(true)
  }

  if (isLoading || usersLoading) {
    return (
      <div className='space-y-6'>
        {/* Team Members Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex items-center space-x-3 rounded-lg border p-3'
                >
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <div className='flex-1'>
                    <Skeleton className='mb-1 h-4 w-24' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Team Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div className='flex-1'>
                    <Skeleton className='mb-2 h-4 w-48' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                  <Skeleton className='h-6 w-20' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='py-8 text-center'>
        <Users className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
        <p className='text-muted-foreground'>No project data available</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              {t('teamManagement.teamMembers')} ({projectUsers.length})
            </CardTitle>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant={isEditMode ? 'default' : 'outline'}
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {t('teamManagement.settings')}
              </Button>
              <Dialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size='sm'>
                    {t('teamManagement.inviteMember')}
                    <UserPlus className='ml-1 h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t('teamManagement.addTeamMemberTitle')}
                    </DialogTitle>
                    <DialogDescription>
                      {t('teamManagement.addTeamMemberDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                    {/* Team Filter */}
                    <div className='space-y-3'>
                      <Label>{t('teamManagement.filterByTeams')}</Label>
                      <div className='max-h-[200px] space-y-2 overflow-y-auto rounded-lg border p-3'>
                        {teams.length === 0 ? (
                          <p className='text-muted-foreground text-sm'>
                            {t('common.noData')}
                          </p>
                        ) : (
                          teams.map((team) => (
                            <div
                              key={team.id}
                              className='flex items-center space-x-2'
                            >
                              <Checkbox
                                id={`team-${team.id}`}
                                checked={selectedTeamIds.has(team.id as string)}
                                onCheckedChange={() =>
                                  toggleTeam(team.id as string)
                                }
                              />
                              <Label
                                htmlFor={`team-${team.id}`}
                                className='cursor-pointer font-normal'
                              >
                                {team.name}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Member & Role Selectors */}
                    <div className='grid grid-cols-2 gap-3'>
                      {/* Member Selector */}
                      <div className='space-y-2'>
                        <Label htmlFor='member-select'>
                          {t('teamManagement.member')}
                        </Label>
                        <Select
                          value={selectedMemberId}
                          onValueChange={setSelectedMemberId}
                        >
                          <SelectTrigger
                            id='member-select'
                            disabled={
                              inviteUserMutation.isPending ||
                              getAvailableMembers().length === 0
                            }
                          >
                            <SelectValue
                              placeholder={
                                selectedTeamIds.size === 0
                                  ? t('teamManagement.selectTeamsFirst')
                                  : t('teamManagement.selectMember')
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableMembers().map((member: any) => {
                              const avatarProps = getAvatarProps(
                                member.full_name
                              )
                              const teamNames = Array.from(member.teamIds)
                                .map(
                                  (tid) => teams.find((t) => t.id === tid)?.name
                                )
                                .filter(Boolean)

                              return (
                                <SelectItem
                                  key={member.user_id}
                                  value={member.user_id as string}
                                >
                                  <div className='flex items-center gap-2'>
                                    <div
                                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${avatarProps.colorClass}`}
                                    >
                                      {avatarProps.initials}
                                    </div>
                                    <div className='flex flex-col'>
                                      <span>{member.full_name}</span>
                                      <span className='text-muted-foreground text-xs'>
                                        {teamNames.join(', ')}
                                      </span>
                                    </div>
                                  </div>
                                </SelectItem>
                              )
                            })}
                            {getAvailableMembers().length === 0 &&
                              selectedTeamIds.size > 0 && (
                                <div className='px-2 py-1.5 text-sm text-gray-500'>
                                  {t(
                                    'teamManagement.allTeamMembersAlreadyInvited'
                                  )}
                                </div>
                              )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Role Selector */}
                      <div className='space-y-2'>
                        <Label htmlFor='role-select'>
                          {t('teamManagement.role')}
                        </Label>
                        <Select
                          value={selectedRole}
                          onValueChange={setSelectedRole}
                        >
                          <SelectTrigger
                            id='role-select'
                            disabled={inviteUserMutation.isPending}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={handleCloseDialog}
                      disabled={inviteUserMutation.isPending}
                    >
                      {t('teamManagement.cancel')}
                    </Button>
                    <Button
                      onClick={handleAddMember}
                      disabled={
                        !selectedMemberId ||
                        inviteUserMutation.isPending ||
                        selectedTeamIds.size === 0
                      }
                    >
                      {inviteUserMutation.isPending && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      {t('teamManagement.addMember')}
                      {!inviteUserMutation.isPending && (
                        <UserPlus className='ml-1 h-4 w-4' />
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {projectUsers.length === 0 ? (
            <div className='py-8 text-center'>
              <Users className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground mb-4'>
                {t('teamManagement.noTeamMembers')}
              </p>
              <p className='text-muted-foreground text-sm'>
                {t('teamManagement.noTeamMembersDescription')}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {projectUsers.map((member) => (
                <div
                  key={member.id}
                  className='hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-4 transition-colors'
                >
                  <Avatar className='mt-0.5 h-10 w-10 flex-shrink-0'>
                    <AvatarFallback>
                      {(member.name || 'User')
                        .split(' ')
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>
                      {member.name || 'Unknown User'}
                    </p>
                    <p className='text-muted-foreground truncate text-xs'>
                      {member.email || 'No email'}
                    </p>
                    <div className='mt-2 flex items-center gap-2'>
                      {isEditMode ? (
                        <Select
                          value={member.role || 'member'}
                          onValueChange={(newRole) => {
                            updateRoleUserMutation.mutateAsync({
                              projectId: project!.id,
                              userId: member.id,
                              role: newRole,
                            })
                          }}
                        >
                          <SelectTrigger className='-my-2 h-6 w-24 px-2 py-0 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <>
                          <Badge variant='outline' className='text-xs'>
                            {(member.role || 'member').charAt(0).toUpperCase() +
                              (member.role || 'member').slice(1)}
                          </Badge>
                          <Badge
                            variant={
                              member.status === 'accepted'
                                ? 'default'
                                : 'secondary'
                            }
                            className='text-xs'
                          >
                            {member.status}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  {isEditMode && (
                    <Button
                      size='sm'
                      variant='ghost'
                      className='flex-shrink-0'
                      onClick={() => handleRemoveFromEdit(member)}
                      disabled={removeUserMutation.isPending}
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Tasks Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5' />
              {t('teamManagement.teamTasks')} ({tasks?.length || 0})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span className='text-muted-foreground ml-2 text-sm'>
                Loading tasks...
              </span>
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className='py-8 text-center'>
              <Calendar className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground'>
                {t('teamManagement.noTasks')}
              </p>
              <p className='text-muted-foreground mt-2 text-sm'>
                {t('teamManagement.noTasksDescription')}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
              {tasks.map((task: Task) => {
                // Get assigned member names
                const assignedMembers = projectUsers.filter(
                  (m: any) =>
                    task.assigned_to_ids?.includes(m.id) ||
                    task.assigned_to?.includes(m.id)
                )

                return (
                  <div
                    key={task.id}
                    className='group flex flex-col rounded-lg border p-4 transition-all hover:shadow-md'
                  >
                    {/* Task Header */}
                    <div className='mb-3 flex items-start justify-between gap-2'>
                      <h4 className='line-clamp-2 text-sm font-semibold'>
                        {task.name}
                      </h4>
                    </div>

                    {/* Task Info */}
                    <div className='flex flex-1 flex-col gap-3'>
                      {/* Status Badge */}
                      <div className='flex items-center gap-2'>
                        {task.status && getTaskStatusIcon(task.status as any)}
                        {task.status && getTaskStatusBadge(task.status as any)}
                      </div>

                      {/* Due Date */}
                      {task.due_date && (
                        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                          <Calendar className='h-3 w-3' />
                          {new Date(task.due_date).toLocaleDateString('vi-VN')}
                        </div>
                      )}

                      {/* Assigned Members */}
                      {assignedMembers.length > 0 && (
                        <div className='mt-2 flex w-full flex-wrap items-center gap-2'>
                          <span className='text-muted-foreground text-xs'>
                            Assigned:
                          </span>
                          <TooltipProvider>
                            <div className='flex flex-wrap gap-2'>
                              {assignedMembers.map((member: any) => (
                                <Tooltip key={member.id}>
                                  <TooltipTrigger asChild>
                                    <div className='border-background bg-primary text-primary-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 text-xs font-semibold transition-transform hover:scale-110'>
                                      {member.name
                                        ?.split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side='top'
                                    className='bg-gray-900 text-xs text-white'
                                  >
                                    <p className='font-medium'>{member.name}</p>
                                    <p className='text-gray-300'>
                                      {member.email}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove User Dialog */}
      <RemoveProjectUserDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        userName={selectedUserToRemove?.name || ''}
        userDisplayName={selectedUserToRemove?.name || ''}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
