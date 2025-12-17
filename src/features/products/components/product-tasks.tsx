import { useState, useEffect } from 'react'
import {
  Loader2,
  CheckCircle2,
  Circle,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { TaskApi } from '@/features/tasks/api/task-api'
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

  const handleToggleTask = async (
    taskId: string,
    currentStatus: string,
    task: Task
  ) => {
    try {
      const newStatus =
        currentStatus === 'completed' ? 'in_progress' : 'completed'

      // Validate thứ tự nếu đang mark as completed
      if (newStatus === 'completed' && !canCheckTask(task)) {
        const nextOrder = getNextTaskOrder()
        toast.error('Không thể hoàn thành nhiệm vụ này', {
          description: `Bạn phải hoàn thành nhiệm vụ thứ ${nextOrder} trước. Nhiệm vụ hiện tại là thứ ${task.task_order}.`,
        })
        return
      }

      // Nếu đang mark as completed, dùng complete endpoint (có thể set completed_at)
      // Nếu đang uncheck, chỉ cần update status
      if (newStatus === 'completed') {
        await TaskApi.complete(taskId)
      } else {
        await TaskApi.update(taskId, { status: newStatus })
      }

      await loadTasks()
      toast.success('Cập nhật nhiệm vụ thành công')
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        'Không thể cập nhật nhiệm vụ'
      toast.error('Lỗi cập nhật nhiệm vụ', {
        description: errorMsg,
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className='h-4 w-4 text-green-500' />
      case 'in_progress':
        return <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
      default:
        return <Circle className='h-4 w-4 text-gray-400' />
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
      {/* Header with Generate Button */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Nhiệm vụ Marketing</h3>
          <p className='text-muted-foreground text-sm'>
            Tự động tạo nhiệm vụ từ phân tích sản phẩm
          </p>
        </div>
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

      {/* Error Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Progress Overview */}
      {tasks.length > 0 && (
        <Card>
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

      {/* Tasks List */}
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
        <div className='space-y-3'>
          {[...tasks]
            .sort((a, b) => {
              // Sắp xếp theo task_order, nếu không có thì theo created_at
              if (
                a.task_order !== null &&
                a.task_order !== undefined &&
                b.task_order !== null &&
                b.task_order !== undefined
              ) {
                return a.task_order - b.task_order
              }
              if (a.task_order !== null && a.task_order !== undefined) return -1
              if (b.task_order !== null && b.task_order !== undefined) return 1
              return (
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
              )
            })
            .map((task) => {
              const canCheck = canCheckTask(task)
              const nextOrder = getNextTaskOrder()
              return (
                <Card
                  key={task.id}
                  className={`transition-shadow hover:shadow-md ${!canCheck && task.status !== 'completed' ? 'opacity-60' : ''}`}
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-4'>
                      {/* Checkbox */}
                      <div className='pt-1'>
                        <Checkbox
                          checked={task.status === 'completed'}
                          disabled={!canCheck}
                          onCheckedChange={() =>
                            handleToggleTask(task.id, task.status, task)
                          }
                          className='h-5 w-5'
                          title={
                            !canCheck && task.status !== 'completed'
                              ? `Bạn phải hoàn thành nhiệm vụ thứ ${nextOrder} trước`
                              : ''
                          }
                        />
                      </div>

                      {/* Task Content */}
                      <div className='flex-1 space-y-2'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex-1'>
                            <div className='mb-1 flex items-center gap-2'>
                              {getStatusIcon(task.status)}
                              <h4
                                className={`font-medium ${
                                  task.status === 'completed'
                                    ? 'text-muted-foreground line-through'
                                    : ''
                                }`}
                              >
                                {task.name}
                              </h4>
                            </div>
                            {task.description && (
                              <p className='text-muted-foreground mt-1 text-sm'>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Tags and Metadata */}
                        <div className='flex flex-wrap items-center gap-2'>
                          <Badge variant='outline' className='text-xs'>
                            {getTaskTypeLabel(task.task_type)}
                          </Badge>
                          <Badge
                            variant={getPriorityColor(task.priority)}
                            className='text-xs'
                          >
                            {task.priority === 'high'
                              ? 'Cao'
                              : task.priority === 'medium'
                                ? 'Trung bình'
                                : 'Thấp'}
                          </Badge>
                          {task.estimated_hours && (
                            <Badge variant='secondary' className='text-xs'>
                              ~{task.estimated_hours}h
                            </Badge>
                          )}
                          {task.due_date && (
                            <Badge variant='outline' className='text-xs'>
                              Hạn:{' '}
                              {new Date(task.due_date).toLocaleDateString(
                                'vi-VN'
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}
