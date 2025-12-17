import { useState, useEffect } from 'react'
import { Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TaskApi } from '@/features/tasks/api/task-api'
import { TasksKanbanBoard } from '@/features/tasks/components/tasks-kanban-board'
import type { Task } from '@/features/tasks/types/task.types'

interface ProductTasksProps {
  productId: string
  projectId?: string
}

export function ProductTasks({ productId, projectId }: ProductTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const allTasks = await TaskApi.getAll({ project_id: projectId })
      // Filter tasks for this product (check stage_metadata)
      const productTasks = allTasks.filter(
        (task) => task.stage_metadata?.product_id === productId
      )
      setTasks(productTasks)
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách nhiệm vụ')
      console.error('Error loading tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadTasks()
    }
  }, [productId, projectId])

  const handleGenerateTasks = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      const result = await TaskApi.generateTasks(productId, { max_tasks: 5 })
      toast.success('Tạo nhiệm vụ thành công', {
        description: `Đã tạo ${result.tasks_generated} nhiệm vụ marketing`,
      })
      await loadTasks()
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.message || 'Không thể tạo nhiệm vụ'
      setError(errorMsg)
      toast.error('Lỗi tạo nhiệm vụ', {
        description: errorMsg,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Tính toán task tiếp theo cần làm (có task_order nhỏ nhất chưa completed)
  const getNextTaskOrder = () => {
    const tasksWithOrder = tasks.filter(
      (t) => t.task_order !== null && t.task_order !== undefined
    )
    const pendingTasks = tasksWithOrder.filter((t) => t.status !== 'completed')
    if (pendingTasks.length === 0) return null
    return Math.min(...pendingTasks.map((t) => t.task_order!))
  }

  const canCheckTask = (task: Task) => {
    // Nếu task đã completed, có thể uncheck
    if (task.status === 'completed') return true
    // Nếu task không có task_order, cho phép check tự do
    if (task.task_order === null || task.task_order === undefined) return true
    // Chỉ cho phép check task có order = nextTaskOrder
    const nextOrder = getNextTaskOrder()
    return nextOrder !== null && task.task_order === nextOrder
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskApi.delete(taskId)
      await loadTasks()
      toast.success('Xóa nhiệm vụ thành công')
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.message || 'Không thể xóa nhiệm vụ'
      toast.error('Lỗi xóa nhiệm vụ', {
        description: errorMsg,
      })
    }
  }

  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header with Generate Button and View Toggle */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h3 className='text-lg font-semibold'>Nhiệm vụ Marketing</h3>
          <p className='text-muted-foreground text-sm'>
            Tự động tạo nhiệm vụ từ phân tích sản phẩm
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            onClick={handleGenerateTasks}
            disabled={isGenerating || !projectId}
            className='gap-2'
          >
            {isGenerating ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles className='h-4 w-4' />
                Tạo Nhiệm vụ AI
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Progress Overview */}
      {tasks.length > 0 && (
        <Card className='pt-4'>
          <CardHeader>
            <CardTitle className='text-base'>Tiến độ hoàn thành</CardTitle>
            <CardDescription>
              {completedCount} / {tasks.length} nhiệm vụ đã hoàn thành
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className='h-2' />
          </CardContent>
        </Card>
      )}

      {/* Tasks View */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <Sparkles className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h4 className='mb-2 text-lg font-semibold'>Chưa có nhiệm vụ</h4>
            <p className='text-muted-foreground mb-4 text-sm'>
              Nhấn "Tạo Nhiệm vụ AI" để tự động tạo các nhiệm vụ marketing từ
              phân tích sản phẩm
            </p>
            <Button
              onClick={handleGenerateTasks}
              disabled={isGenerating || !projectId}
            >
              <Sparkles className='mr-2 h-4 w-4' />
              Tạo Nhiệm vụ AI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TasksKanbanBoard
          tasks={tasks}
          onTasksChange={loadTasks}
          canCheckTask={canCheckTask}
          getNextTaskOrder={getNextTaskOrder}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  )
}
