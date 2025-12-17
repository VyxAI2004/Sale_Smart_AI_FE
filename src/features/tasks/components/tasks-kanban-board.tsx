import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { TaskApi } from '../api/task-api'
import type { Task } from '../types/task.types'
import { TasksKanbanColumn } from './tasks-kanban-column'

interface TasksKanbanBoardProps {
  tasks: Task[]
  onTasksChange: () => void
  canCheckTask: (task: Task) => boolean
  getNextTaskOrder: () => number | null
  onDeleteTask?: (taskId: string) => void
}

export function TasksKanbanBoard({
  tasks,
  onTasksChange,
  canCheckTask,
  getNextTaskOrder,
  onDeleteTask,
}: TasksKanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  // Group tasks by status
  const tasksByStatus = {
    pending: tasks.filter((t) => t.status === 'pending'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    completed: tasks.filter((t) => t.status === 'completed'),
    cancelled: tasks.filter((t) => t.status === 'cancelled'),
  }

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetStatus: string) => {
      e.preventDefault()
      e.stopPropagation()

      if (!draggedTask) return

      // Don't update if same status
      if (draggedTask.status === targetStatus) {
        setDraggedTask(null)
        return
      }

      try {
        // If moving to completed, use complete endpoint
        if (targetStatus === 'completed') {
          // Validate task order if needed
          if (!canCheckTask(draggedTask)) {
            const nextOrder = getNextTaskOrder()
            toast.error('Không thể hoàn thành nhiệm vụ này', {
              description: `Bạn phải hoàn thành nhiệm vụ thứ ${nextOrder} trước. Nhiệm vụ hiện tại là thứ ${draggedTask.task_order}.`,
            })
            setDraggedTask(null)
            return
          }
          await TaskApi.complete(draggedTask.id)
        } else {
          // Otherwise just update status
          await TaskApi.update(draggedTask.id, { status: targetStatus })
        }

        toast.success('Cập nhật nhiệm vụ thành công')
        onTasksChange()
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.detail ||
          err.message ||
          'Không thể cập nhật nhiệm vụ'
        toast.error('Lỗi cập nhật nhiệm vụ', {
          description: errorMsg,
        })
      } finally {
        setDraggedTask(null)
      }
    },
    [draggedTask, canCheckTask, getNextTaskOrder, onTasksChange]
  )

  return (
    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <TasksKanbanColumn
        title='Chờ xử lý'
        status='pending'
        tasks={tasksByStatus.pending}
        canCheckTask={canCheckTask}
        getNextTaskOrder={getNextTaskOrder}
        onDeleteTask={onDeleteTask}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TasksKanbanColumn
        title='Đang thực hiện'
        status='in_progress'
        tasks={tasksByStatus.in_progress}
        canCheckTask={canCheckTask}
        getNextTaskOrder={getNextTaskOrder}
        onDeleteTask={onDeleteTask}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TasksKanbanColumn
        title='Hoàn thành'
        status='completed'
        tasks={tasksByStatus.completed}
        canCheckTask={canCheckTask}
        getNextTaskOrder={getNextTaskOrder}
        onDeleteTask={onDeleteTask}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TasksKanbanColumn
        title='Đã hủy'
        status='cancelled'
        tasks={tasksByStatus.cancelled}
        canCheckTask={canCheckTask}
        getNextTaskOrder={getNextTaskOrder}
        onDeleteTask={onDeleteTask}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  )
}
