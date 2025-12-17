import { useState } from 'react'
import {
  Users,
  Crown,
  Settings,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MailPlus,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type {
  ProjectDetailData,
  ProjectTask,
} from '../../types/project-detail.types'

interface TeamManagementCardProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  onAddMember?: (email: string, role: string) => void
  onRemoveMember?: (memberId: string) => void
  onUpdateMemberRole?: (memberId: string, role: string) => void
  onAssignTask?: (taskId: string, memberId: string) => void
}

interface TeamMember {
  id: string
  name: string
  email: string
  avatar_url: string | null
  role?: string
  joined_at?: string
  last_active?: string
}

export function TeamManagementCard({
  project,
  isLoading = false,
  onAddMember,
  onRemoveMember,
  onAssignTask,
}: TeamManagementCardProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('member')

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

  const handleAddMember = () => {
    if (onAddMember && newMemberEmail) {
      onAddMember(newMemberEmail, newMemberRole)
      setNewMemberEmail('')
      setNewMemberRole('member')
      setInviteDialogOpen(false)
    }
  }

  if (isLoading) {
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

  // Mock team members if not available
  const teamMembers: TeamMember[] = project.team_members?.map((member) => ({
    ...member,
    role: 'member',
    joined_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
  })) || [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar_url: null,
      role: 'admin',
      joined_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    },
  ]

  return (
    <div className='space-y-6'>
      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Team Members ({teamMembers.length})
            </CardTitle>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm'>
                  Invite Member
                  <MailPlus className='ml-1 h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Invite a new member to join this project team.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email Address</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='member@example.com'
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='role'>Role</Label>
                    <Select
                      value={newMemberRole}
                      onValueChange={setNewMemberRole}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='member'>Member</SelectItem>
                        <SelectItem value='viewer'>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setInviteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} disabled={!newMemberEmail}>
                    Send Invitation
                    <MailPlus className='ml-1 h-4 w-4' />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className='hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-4 transition-colors'
              >
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={member.avatar_url || undefined}
                    alt={member.name}
                  />
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <p className='truncate text-sm font-medium'>
                      {member.name}
                    </p>
                    {member.role === 'admin' && (
                      <Crown className='h-3 w-3 text-yellow-500' />
                    )}
                  </div>
                  <p className='text-muted-foreground truncate text-xs'>
                    {member.email}
                  </p>
                  <div className='mt-1 flex items-center gap-2'>
                    <Badge variant='outline' className='text-xs'>
                      {member.role || 'member'}
                    </Badge>
                    <span className='text-muted-foreground text-xs'>
                      {member.last_active ? 'Active recently' : 'Never active'}
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                    <Settings className='h-3 w-3' />
                  </Button>
                  {member.role !== 'admin' && onRemoveMember && (
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-8 w-8 p-0 text-red-500 hover:text-red-700'
                      onClick={() => onRemoveMember(member.id)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Tasks Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5' />
              Team Tasks ({project.tasks?.length || 0})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!project.tasks || project.tasks.length === 0 ? (
            <div className='py-8 text-center'>
              <Calendar className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground'>
                No tasks assigned to team members
              </p>
              <p className='text-muted-foreground mt-2 text-sm'>
                Tasks will appear here once they are assigned to team members
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors'
                >
                  <div className='flex flex-1 items-center gap-3'>
                    {getTaskStatusIcon(task.status)}
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>{task.name}</p>
                      <div className='mt-2 flex items-center gap-2'>
                        {getTaskStatusBadge(task.status)}
                        {task.due_date && (
                          <span className='text-muted-foreground text-xs'>
                            Due:{' '}
                            {new Date(task.due_date).toLocaleDateString(
                              'vi-VN'
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    {task.assigned_user_name ? (
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-6 w-6'>
                          <AvatarFallback className='text-xs'>
                            {task.assigned_user_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-xs font-medium'>
                          {task.assigned_user_name}
                        </span>
                      </div>
                    ) : (
                      <Select
                        onValueChange={(memberId) =>
                          onAssignTask?.(task.id, memberId)
                        }
                      >
                        <SelectTrigger className='h-8 w-32'>
                          <SelectValue placeholder='Assign to...' />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
