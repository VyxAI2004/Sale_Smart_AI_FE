/**
 * Recent Activity Component - Hiển thị các hoạt động gần đây
 */
import { formatDistanceToNow } from 'date-fns'
import { Activity, Package, ListTodo, MessageSquare } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RecentActivityProps {
  activities: Array<{
    id: string
    type: 'project' | 'product' | 'task' | 'review'
    title: string
    description: string
    timestamp: string
    status?: string
  }>
}

const typeIcons = {
  project: Package,
  product: Package,
  task: ListTodo,
  review: MessageSquare,
}

const typeColors = {
  project: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  product: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  task: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  review:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='h-5 w-5' />
          {t('dashboard.recentActivity.title')}
        </CardTitle>
        <CardDescription>
          {t('dashboard.recentActivity.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px]'>
          <div className='space-y-4'>
            {activities.length === 0 ? (
              <div className='text-muted-foreground py-8 text-center'>
                {t('dashboard.recentActivity.noActivity')}
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = typeIcons[activity.type] || Activity
                return (
                  <div
                    key={activity.id}
                    className='hover:bg-muted/50 flex items-start gap-4 rounded-lg border p-3 transition-colors'
                  >
                    <div
                      className={`rounded-lg p-2 ${typeColors[activity.type] || 'bg-gray-100 text-gray-800'}`}
                    >
                      <Icon className='h-4 w-4' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='truncate text-sm font-medium'>
                          {activity.title}
                        </p>
                        {activity.status && (
                          <Badge variant='outline' className='text-xs'>
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                      <p className='text-muted-foreground mt-1 text-xs'>
                        {activity.description}
                      </p>
                      <p className='text-muted-foreground mt-1 text-xs'>
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
