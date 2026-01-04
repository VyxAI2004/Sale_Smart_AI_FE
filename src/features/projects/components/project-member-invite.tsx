import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInviteProjectUser } from '@/features/projects/hooks/use-project-users'
import { useProjectMembers } from '@/features/projects/hooks/use-project-members'

interface ProjectMemberInviteProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectMemberInvite({
  projectId,
  open,
  onOpenChange,
}: ProjectMemberInviteProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  
  const { data: projectMembers = [] } = useProjectMembers(projectId)
  const inviteUser = useInviteProjectUser()

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      await inviteUser.mutateAsync({
        projectId,
        payload: { email: email.trim(), role },
      })
      setEmail('')
      setRole('member')
    } catch (_error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite team members to this project so they can be assigned to tasks.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Invite Form */}
          <form onSubmit={handleInvite} className='space-y-3'>
            <div>
              <label className='text-sm font-medium'>Email Address</label>
              <Input
                type='email'
                placeholder='member@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={inviteUser.isPending}
              />
            </div>

            <div>
              <label className='text-sm font-medium'>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={inviteUser.isPending}
                className='w-full px-3 py-2 border rounded-md text-sm'
              >
                <option value='member'>Member</option>
                <option value='admin'>Admin</option>
              </select>
            </div>

            <Button
              type='submit'
              disabled={inviteUser.isPending || !email.trim()}
              className='w-full'
            >
              {inviteUser.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Inviting...
                </>
              ) : (
                <>
                  <Plus className='mr-2 h-4 w-4' />
                  Send Invite
                </>
              )}
            </Button>
          </form>

          {/* Current Members List */}
          <div className='space-y-2'>
            <h3 className='text-sm font-semibold'>Current Members</h3>
            <div className='max-h-[300px] space-y-2 overflow-y-auto'>
              {projectMembers.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  No members yet. Invite someone to get started.
                </p>
              ) : (
                projectMembers.map((member: any) => (
                  <div
                    key={member.id}
                    className='flex items-center justify-between rounded-lg border p-2'
                  >
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={member.email} />
                        <AvatarFallback>
                          {(member.name || member.email || 'U')
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium'>{member.name || 'User'}</p>
                        <p className='text-xs text-muted-foreground'>
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant='outline' className='text-xs'>
                      {member.role || 'Pending'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
