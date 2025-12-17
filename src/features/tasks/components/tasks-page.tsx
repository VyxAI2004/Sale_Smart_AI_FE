import { useState, useEffect } from 'react'
import { useProjectContext } from '@/contexts/project-context'
import { Loader2, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TaskApi } from '../api/task-api'
import type { Task } from '../types/task.types'
import { TasksKanbanBoard } from './tasks-kanban-board'

export function TasksPage() {
  const { activeProject } = useProjectContext()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>('all')

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const filters: any = {}
      if (activeProject?.id) {
        filters.project_id = activeProject.id
      }
      const allTasks = await TaskApi.getAll(filters)
      setTasks(allTasks)
    } catch (err: any) {
      toast.error('Lỗi tải nhiệm vụ', {
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [activeProject?.id])

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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false
    if (priorityFilter !== 'all' && task.priority !== priorityFilter)
      return false
    if (taskTypeFilter !== 'all' && task.task_type !== taskTypeFilter)
      return false
    return true
  })

  const completedCount = filteredTasks.filter(
    (t) => t.status === 'completed'
  ).length
  const progress =
    filteredTasks.length > 0 ? (completedCount / filteredTasks.length) * 100 : 0

  const uniqueTaskTypes = Array.from(
    new Set(tasks.map((t) => t.task_type).filter(Boolean))
  )

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitcher />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Nhiệm vụ</h2>
            <p className='text-muted-foreground'>
              {activeProject
                ? `Quản lý tất cả nhiệm vụ của project: ${activeProject.name}`
                : 'Quản lý tất cả nhiệm vụ'}
            </p>
          </div>
        </div>

        {/* View Mode Toggle and Filters */}
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Filter className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>Lọc:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                <SelectItem value='pending'>Chờ xử lý</SelectItem>
                <SelectItem value='in_progress'>Đang thực hiện</SelectItem>
                <SelectItem value='completed'>Hoàn thành</SelectItem>
                <SelectItem value='cancelled'>Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Độ ưu tiên' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả độ ưu tiên</SelectItem>
                <SelectItem value='high'>Cao</SelectItem>
                <SelectItem value='medium'>Trung bình</SelectItem>
                <SelectItem value='low'>Thấp</SelectItem>
              </SelectContent>
            </Select>

            {uniqueTaskTypes.length > 0 && (
              <Select value={taskTypeFilter} onValueChange={setTaskTypeFilter}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Loại nhiệm vụ' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả loại</SelectItem>
                  {uniqueTaskTypes.map((type) => (
                    <SelectItem key={type || ''} value={type || ''}>
                      {getTaskTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant='outline' size='sm' onClick={loadTasks}>
              Làm mới
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        {filteredTasks.length > 0 && (
          <Card className='mb-6'>
            <CardContent className='pt-0'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>
                    Tiến độ hoàn thành
                  </span>
                  <span className='font-medium'>
                    {completedCount} / {filteredTasks.length} nhiệm vụ
                  </span>
                </div>
                <Progress value={progress} className='h-2' />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks View */}
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-muted-foreground'>
                {tasks.length === 0
                  ? 'Chưa có nhiệm vụ nào. Tạo nhiệm vụ từ tab "Nhiệm vụ" trong chi tiết sản phẩm.'
                  : 'Không có nhiệm vụ nào khớp với bộ lọc.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <TasksKanbanBoard
            tasks={filteredTasks}
            onTasksChange={loadTasks}
            canCheckTask={canCheckTask}
            getNextTaskOrder={getNextTaskOrder}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </Main>
    </>
  )
}
