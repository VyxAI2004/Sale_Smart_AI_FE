import { useState, useEffect } from 'react'
import { Check, ChevronDown, Loader2, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProjectUsers } from '@/features/projects/hooks/use-project-users'
import { useUpdateTask } from '../hooks/use-update-task'
import { type Task } from '../types/task.types'

interface TaskAssigneeMenuProps {
  task: Task
  currentAssignee?: string | string[] | null
}

export function TaskAssigneeMenu({
  task,
  currentAssignee,
}: TaskAssigneeMenuProps) {
  const [open, setOpen] = useState(false)
  // Use assigned_to_ids from task response (from API), fallback to currentAssignee prop
  const assigneeIds =
    task.assigned_to_ids ||
    (Array.isArray(currentAssignee)
      ? currentAssignee
      : currentAssignee
        ? [currentAssignee]
        : [])
  const [selectedAssignees, setSelectedAssignees] = useState<Set<string>>(
    new Set(assigneeIds)
  )
  const updateTask = useUpdateTask()
  const { data: projectUsers = [], isLoading: isLoadingMembers } =
    useProjectUsers(task.project_id)

  // Sync selected assignees when task.assigned_to_ids changes
  useEffect(() => {
    const newAssigneeIds =
      task.assigned_to_ids ||
      (Array.isArray(currentAssignee)
        ? currentAssignee
        : currentAssignee
          ? [currentAssignee]
          : [])
    setSelectedAssignees(new Set(newAssigneeIds))
  }, [task.assigned_to_ids, currentAssignee])

  const handleToggleAssignee = async (userId: string) => {
    const newSelected = new Set(selectedAssignees)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedAssignees(newSelected)

    // Update immediately
    try {
      // Convert set to array and send to backend
      const assigneeList = Array.from(newSelected)
      const result = await updateTask.mutateAsync({
        id: task.id,
        data: {
          assigned_to: assigneeList,
        },
      })
      // Sync selected assignees with response data
      if (result.assigned_to_ids) {
        setSelectedAssignees(new Set(result.assigned_to_ids))
      }
    } catch (_error) {
      // Error handled by mutation
      // Revert selection
      setSelectedAssignees(
        new Set(
          Array.isArray(currentAssignee)
            ? currentAssignee
            : currentAssignee
              ? [currentAssignee]
              : []
        )
      )
    }
  }

  const handleUnassign = async () => {
    setSelectedAssignees(new Set())
    try {
      const result = await updateTask.mutateAsync({
        id: task.id,
        data: {
          assigned_to: [],
        },
      })
      // Sync selected assignees with response data
      if (result.assigned_to_ids) {
        setSelectedAssignees(new Set(result.assigned_to_ids))
      }
    } catch (_error) {
      // Error handled by mutation
      setSelectedAssignees(
        new Set(
          Array.isArray(currentAssignee)
            ? currentAssignee
            : currentAssignee
              ? [currentAssignee]
              : []
        )
      )
    }
  }

  const getSelectedMembers = () => {
    return Array.from(selectedAssignees)
      .map((id) => projectUsers.find((m) => m.id === id))
      .filter(Boolean) as typeof projectUsers
  }

  const selectedMembers = getSelectedMembers()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start gap-2'
        >
          {selectedMembers.length > 0 ? (
            <>
              <div className='flex -space-x-2'>
                {selectedMembers.slice(0, 2).map((member) => {
                  const initials = member.name
                    ? member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : '?'
                  return (
                    <Avatar
                      key={member.id}
                      className='border-background h-5 w-5 border'
                    >
                      <AvatarImage src={member.email} />
                      <AvatarFallback className='text-xs'>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )
                })}
                {selectedMembers.length > 2 && (
                  <Avatar className='border-background bg-muted flex h-5 w-5 items-center justify-center border'>
                    <span className='text-xs font-semibold'>
                      +{selectedMembers.length - 2}
                    </span>
                  </Avatar>
                )}
              </div>
              <span className='truncate text-xs'>
                {selectedMembers.length} assigned
              </span>
            </>
          ) : (
            <>
              <Users className='h-4 w-4' />
              <span className='text-muted-foreground text-xs'>Assign</span>
            </>
          )}
          <ChevronDown className='ml-auto h-3 w-3 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent align='start' className='w-[280px] p-0'>
        <div className='space-y-2 p-4'>
          <div className='text-sm font-semibold'>Assign members</div>

          {isLoadingMembers ? (
            <div className='flex items-center justify-center p-4'>
              <Loader2 className='h-4 w-4 animate-spin' />
            </div>
          ) : projectUsers.length === 0 ? (
            <div className='text-muted-foreground p-2 py-4 text-center text-xs'>
              No team members. Invite members to the project.
            </div>
          ) : (
            <ScrollArea className='h-[300px] w-full rounded-md border p-2'>
              <div className='space-y-2'>
                {projectUsers.map((member) => (
                  <div
                    key={member.id}
                    className='hover:bg-muted flex cursor-pointer items-center gap-2 rounded p-2 transition-colors'
                    onClick={() => handleToggleAssignee(member.id)}
                  >
                    <Checkbox
                      checked={selectedAssignees.has(member.id)}
                      onCheckedChange={() => handleToggleAssignee(member.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className='h-6 w-6'>
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
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm'>
                        {member.name || 'User'}
                      </p>
                      <p className='text-muted-foreground truncate text-xs'>
                        {member.email}
                      </p>
                    </div>
                    {selectedAssignees.has(member.id) && (
                      <Check className='text-primary h-4 w-4 flex-shrink-0' />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {selectedMembers.length > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground w-full text-xs'
              onClick={handleUnassign}
              disabled={updateTask.isPending}
            >
              Clear assignment
            </Button>
          )}

          {updateTask.isPending && (
            <div className='flex items-center justify-center p-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
