import { useState } from 'react'
import { Calendar, Clock, EllipsisVertical, Trash2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Task } from '../types/task.types'
import { TaskDetailDialog } from './task-detail-dialog'

interface TasksKanbanCardProps {
  task: Task
  canCheck: boolean
  nextOrder: number | null
  onDelete?: (taskId: string) => void
  onDragStart?: (e: React.DragEvent, task: Task) => void
  onDragEnd?: (e: React.DragEvent) => void
}

export function TasksKanbanCard({
  task,
  canCheck,
  nextOrder,
  onDelete,
  onDragStart,
  onDragEnd,
}: TasksKanbanCardProps) {
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id)
      setShowDeleteDialog(false)
    }
  }
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getTaskTypeLabel = (taskType?: string | null) => {
    const labels: Record<string, string> = {
      marketing_research: 'Nghiên cứu Marketing',
      competitive_analysis: 'Phân tích Cạnh tranh',
      content_strategy: 'Chiến lược Nội dung',
      pricing_strategy: 'Chiến lược Giá',
      market_positioning: 'Định vị Thị trường',
    }
    return labels[taskType || ''] || taskType || 'Nhiệm vụ'
  }

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => onDragStart?.(e, task)}
        onDragEnd={onDragEnd}
        className='group cursor-move transition-all hover:shadow-lg active:opacity-50'
      >
        <CardContent className='space-y-3 px-4'>
          {/* Header: Task Order + Title + Actions */}
          <div className='flex items-start gap-2'>
            {task.task_order && (
              <div className='bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                {task.task_order}
              </div>
            )}
            <div className='min-w-0 flex-1'>
              <h4 className='text-xs leading-tight font-medium'>{task.name}</h4>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className='text-muted-foreground hover:text-foreground hover:bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded'
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisVertical className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setShowDetailDialog(true)}>
                  <Eye className='mr-2 h-4 w-4' />
                  Chi tiết
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className='text-destructive'
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Xóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags: Priority and Task Type */}
          <div className='flex flex-wrap items-center gap-1.5'>
            <Badge
              variant={getPriorityColor(task.priority) as any}
              className='text-xs'
            >
              {task.priority === 'high'
                ? 'Cao'
                : task.priority === 'medium'
                  ? 'Trung bình'
                  : 'Thấp'}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {getTaskTypeLabel(task.task_type)}
            </Badge>
          </div>

          {/* Metadata: Time and Date */}
          {(task.estimated_hours || task.due_date) && (
            <div className='text-muted-foreground flex flex-wrap items-center gap-3 text-xs'>
              {task.estimated_hours && (
                <div className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  <span>~{task.estimated_hours}h</span>
                </div>
              )}
              {task.due_date && (
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span>
                    {new Date(task.due_date).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Warning for task order */}
          {!canCheck && task.status !== 'completed' && (
            <p className='rounded bg-amber-50 p-2 text-xs text-amber-600 dark:bg-amber-950 dark:text-amber-400'>
              ! Hoàn thành nhiệm vụ thứ {nextOrder} trước
            </p>
          )}
        </CardContent>
      </Card>

      <TaskDetailDialog
        task={task}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />

      {onDelete && (
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title='Xóa nhiệm vụ'
          desc={`Bạn có chắc chắn muốn xóa nhiệm vụ "${task.name}"? Hành động này không thể hoàn tác.`}
          confirmText='Xóa'
          destructive
          handleConfirm={handleDelete}
        />
      )}
    </>
  )
}
