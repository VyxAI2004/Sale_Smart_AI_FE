import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Target,
  Zap,
  Activity,
  TrendingUp,
  FolderCog2Icon,
  CheckSquare,
} from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Import new product components
import { ProductsList } from '@/features/products'
import { TaskApi } from '@/features/tasks/api/task-api'
import { TasksKanbanBoard } from '@/features/tasks/components/tasks-kanban-board'
import type { Task } from '@/features/tasks/types/task.types'
import type { ProjectDetailData } from '../../types/project-detail.types'
// Import tab components
import { ProjectDetailsCard } from './project-details-card'
import { TeamManagementCard } from './team-management-card'

interface ProjectDetailTabsProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  activeTab?: string
  onTabChange?: (tab: string) => void
  onProjectUpdate?: (updates: Partial<ProjectDetailData>) => void
}

export function ProjectDetailTabs({
  project,
  isLoading = false,
  activeTab: externalActiveTab,
  onTabChange,
  onProjectUpdate,
}: ProjectDetailTabsProps) {
  const { t } = useTranslation()
  const [internalActiveTab, setInternalActiveTab] = useState('overview')
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)

  const activeTab = externalActiveTab ?? internalActiveTab
  const setActiveTab = onTabChange ?? setInternalActiveTab

  // Load tasks when Tasks tab is accessed
  const handleTasksTabActive = async () => {
    if (!project?.id) return

    try {
      setTasksLoading(true)
      const response = await TaskApi.getAll({ project_id: project.id }, 0, 1000)
      setTasks(response.data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setTasksLoading(false)
    }
  }

  const handleTabChange = (tab: string) => {
    if (tab === 'tasks' || tab === 'team') {
      handleTasksTabActive()
    }
    setActiveTab(tab)
  }

  return (
    <div className='w-full space-y-6'>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-4 flex-wrap lg:flex lg:w-fit lg:grid-cols-none'>
          <TabsTrigger value='overview' className='flex items-center gap-2'>
            <LayoutDashboard className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.overview')}</span>
          </TabsTrigger>
          <TabsTrigger value='products' className='flex items-center gap-2'>
            <ShoppingCart className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.products')}</span>
          </TabsTrigger>
          <TabsTrigger value='tasks' className='flex items-center gap-2'>
            <CheckSquare className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.tasks')}</span>
          </TabsTrigger>
          <TabsTrigger value='team' className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.team')}</span>
          </TabsTrigger>
          <TabsTrigger value='settings' className='flex items-center gap-2'>
            <FolderCog2Icon className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('projects.project')}</span>
          </TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value='overview' className='mt-6 space-y-6'>
          <div className='space-y-6'>
            {/* KPI Cards Grid - Simplified */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <Target className='h-5 w-5 text-blue-500' />
                  <span className='font-medium'>
                    {t('projects.totalProducts')}
                  </span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.total_products || 0}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.productsTracked')}
                </p>
              </div>

              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-green-500' />
                  <span className='font-medium'>{t('projects.analyzed')}</span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.analyzed_products || 0}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.analysisComplete')}
                </p>
              </div>

              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <Activity className='h-5 w-5 text-purple-500' />
                  <span className='font-medium'>
                    {t('projects.confidence')}
                  </span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.confidence_score || 0}%
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.analysisAccuracy')}
                </p>
              </div>

              <div className='space-y-2 rounded-lg border p-6'>
                <div className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5 text-orange-500' />
                  <span className='font-medium'>
                    {t('projects.marketPosition')}
                  </span>
                </div>
                <p className='text-2xl font-bold'>
                  {project?.analytics?.market_position || 0}%
                </p>
                <p className='text-muted-foreground text-sm'>
                  {t('projects.marketStrength')}
                </p>
              </div>
            </div>

            {/* Equal height cards layout */}
            <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  {t('projects.overview')}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Project summary and key metrics displayed above
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value='team' className='mt-6'>
          <TeamManagementCard
            project={project}
            isLoading={isLoading}
            tasks={tasks}
            tasksLoading={tasksLoading}
          />
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value='products' className='mt-6 space-y-6'>
          {project?.id ? (
            <ProductsList
              projectId={project.id}
              onViewProduct={(productId) => {
                // Navigate to product detail if needed
                console.log('View product:', productId)
              }}
            />
          ) : (
            <div className='text-muted-foreground py-8 text-center'>
              {isLoading ? 'Loading project...' : 'Project ID not available'}
            </div>
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value='tasks' className='mt-6'>
          {tasksLoading ? (
            <div className='text-muted-foreground py-8 text-center'>
              Loading tasks...
            </div>
          ) : tasks.length > 0 ? (
            <TasksKanbanBoard
              tasks={tasks}
              onTasksChange={handleTasksTabActive}
              canCheckTask={() => true}
              getNextTaskOrder={() => 1}
            />
          ) : (
            <div className='text-muted-foreground py-8 text-center'>
              No tasks available
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='settings' className='mt-6'>
          <ProjectDetailsCard
            project={project}
            isLoading={isLoading}
            onUpdate={(updates) => {
              // Handle project updates
              if (onProjectUpdate) {
                onProjectUpdate(updates)
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
