import { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Task } from '../types/task.types'
import { TasksKanbanCard } from './tasks-kanban-card'

interface TasksKanbanColumnProps {
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  tasks: Task[]
  canCheckTask: (task: Task) => boolean
  getNextTaskOrder: () => number | null
  onDeleteTask?: (taskId: string) => void
  onDragStart?: (e: React.DragEvent, task: Task) => void
  onDragEnd?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, targetStatus: string) => void
  onDragOver?: (e: React.DragEvent) => void
}

export function TasksKanbanColumn({
  title,
  status,
  tasks,
  canCheckTask,
  getNextTaskOrder,
  onDeleteTask,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOver,
}: TasksKanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null)

  const getHeaderColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300'
      default:
        return 'bg-muted'
    }
  }

  const getBadgeBgColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-600 dark:bg-amber-500'
      case 'in_progress':
        return 'bg-blue-600 dark:bg-blue-500'
      case 'completed':
        return 'bg-green-600 dark:bg-green-500'
      case 'cancelled':
        return 'bg-gray-600 dark:bg-gray-500'
      default:
        return ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragOver?.(e)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDrop?.(e, status)
  }

  return (
    <div
      ref={columnRef}
      className='flex h-full max-h-[calc(100vh-250px)] min-h-[600px] flex-col gap-3'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header Card */}
      <div className={`shrink-0 rounded-xl border-0 ${getHeaderColor(status)}`}>
        <div className='flex items-center justify-between gap-2 px-3 py-1.5'>
          <h3 className='text-sm leading-tight font-bold'>{title}</h3>
          <Badge
            variant='secondary'
            className={`flex min-h-[24px] min-w-[24px] shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getBadgeBgColor(status)}`}
          >
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Content Card */}
      <Card className='flex min-h-0 flex-1 flex-col'>
        <CardContent className='min-h-0 flex-1 space-y-3 overflow-y-auto p-4'>
          {tasks.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Không có nhiệm vụ
            </div>
          ) : (
            tasks.map((task) => {
              const canCheck = canCheckTask(task)
              const nextOrder = getNextTaskOrder()
              return (
                <TasksKanbanCard
                  key={task.id}
                  task={task}
                  canCheck={canCheck}
                  nextOrder={nextOrder}
                  onDelete={onDeleteTask}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
