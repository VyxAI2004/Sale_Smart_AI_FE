import { useState } from 'react'
import { Check, ChevronDown, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdateTask } from '../hooks/use-update-task'
import { useProjectMembers } from '@/features/projects/hooks/use-project-members'
import { type Task } from '../types/task.types'

interface TaskAssigneeMenuProps {
  task: Task
  currentAssignee?: string | null
}

export function TaskAssigneeMenu({
  task,
  currentAssignee,
}: TaskAssigneeMenuProps) {
  const [open, setOpen] = useState(false)
  const updateTask = useUpdateTask()
  const { data: projectMembers = [], isLoading: isLoadingMembers } = useProjectMembers(task.project_id)

  const handleAssign = async (userId: string) => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          assigned_to: userId,
        },
      })
      setOpen(false)
    } catch (_error) {
      // Assignment failed - error handled by mutation
    }
  }

  const handleUnassign = async () => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          assigned_to: '',
        },
      })
      setOpen(false)
    } catch (_error) {
      // Unassignment failed - error handled by mutation
    }
  }

  const currentMember = projectMembers.find((m) => m.id === currentAssignee)
  const initials = currentMember
    ? currentMember.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?'

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='w-full justify-start gap-2'>
          {currentAssignee && currentMember ? (
            <>
              <Avatar className='h-5 w-5'>
                <AvatarImage src={currentMember.email} />
                <AvatarFallback className='text-xs'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className='truncate text-xs'>
                {currentMember.name.split(' ')[0]}
              </span>
            </>
          ) : (
            <>
              <Users className='h-4 w-4' />
              <span className='text-xs text-muted-foreground'>Assign</span>
            </>
          )}
          <ChevronDown className='ml-auto h-3 w-3 opacity-50' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='w-[200px]'>
        <DropdownMenuLabel className='text-xs'>Assign to</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoadingMembers ? (
          <div className='flex items-center justify-center p-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
          </div>
        ) : projectMembers.length === 0 ? (
          <div className='p-2 text-xs text-muted-foreground'>
            No team members. Invite members to the project.
          </div>
        ) : (
          <>
            {projectMembers.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onClick={() => handleAssign(member.id)}
                className='cursor-pointer'
              >
                <Avatar className='mr-2 h-5 w-5'>
                  <AvatarImage src={member.email} />
                  <AvatarFallback className='text-xs'>
                    {(member.name || member.email || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className='flex-1 text-sm'>{member.name || 'User'}</span>
                {currentAssignee === member.id && (
                  <Check className='h-4 w-4 text-primary' />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {currentAssignee && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleUnassign}
              className='text-xs text-muted-foreground cursor-pointer'
            >
              Unassign
            </DropdownMenuItem>
          </>
        )}

        {updateTask.isPending && (
          <div className='flex items-center justify-center p-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
