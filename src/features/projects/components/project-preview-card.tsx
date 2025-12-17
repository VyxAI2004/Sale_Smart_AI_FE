import {
  Calendar,
  Target,
  DollarSign,
  Bot,
  Users,
  Settings,
  Clock,
  Tag,
  Image as ImageIcon,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  STATUS_OPTIONS,
  MOCK_USERS,
  MOCK_AI_MODELS,
} from '../constants/project.constants'
import type { ProjectFormData } from '../types/project.types'

interface ProjectPreviewCardProps {
  formData: ProjectFormData
}

export const ProjectPreviewCard = ({ formData }: ProjectPreviewCardProps) => {
  const currentStatus = STATUS_OPTIONS.find((s) => s.value === formData.status)
  const assignedUsers = MOCK_USERS.filter((u) =>
    formData.assigned_to?.includes(u.id)
  )
  const assignedModel = MOCK_AI_MODELS.find(
    (m) => m.id === formData.assigned_model_id
  )

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
          <FileText className='h-5 w-5' />
          Project Preview
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Product Images Gallery */}
        {formData.product_images && formData.product_images.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <ImageIcon className='h-4 w-4 text-pink-500' />
              <span className='text-muted-foreground text-sm font-medium'>
                Product Images
              </span>
              <Badge variant='secondary' className='text-xs'>
                {formData.product_images.length}
              </Badge>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {formData.product_images.slice(0, 4).map((_, index) => (
                <div key={index} className='group relative'>
                  <div className='bg-muted border-muted-foreground/25 flex aspect-square items-center justify-center rounded-md border-2 border-dashed'>
                    <div className='text-center'>
                      <ImageIcon className='text-muted-foreground mx-auto mb-1 h-6 w-6' />
                      <p className='text-muted-foreground truncate px-1 text-xs'>
                        Image {index + 1}
                      </p>
                    </div>
                  </div>
                  {formData.product_images &&
                    formData.product_images.length > 4 &&
                    index === 3 && (
                      <div className='absolute inset-0 flex items-center justify-center rounded-md bg-black/50'>
                        <span className='text-sm font-medium text-white'>
                          +{formData.product_images.length - 4} more
                        </span>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Status */}
        <div className='bg-muted/50 flex items-center justify-between rounded-lg p-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Status</span>
          </div>
          <Badge
            className={currentStatus?.color || 'bg-gray-100 text-gray-800'}
          >
            {currentStatus?.label || 'Draft'}
          </Badge>
        </div>

        {/* Project Basic Info */}
        <div className='space-y-3'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <Target className='h-4 w-4 text-blue-500' />
              <span className='text-muted-foreground text-sm font-medium'>
                Project Information
              </span>
            </div>
            <div className='space-y-2'>
              <div>
                <p className='text-muted-foreground mb-1 text-xs'>
                  Project Name
                </p>
                <p className='bg-background rounded-md border p-2 text-sm font-medium'>
                  {formData.name || 'Untitled Project'}
                </p>
              </div>

              {formData.description && (
                <div>
                  <p className='text-muted-foreground mb-1 text-xs'>
                    Description
                  </p>
                  <p className='bg-background text-muted-foreground rounded-md border p-2 text-xs'>
                    {formData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Target Product Information */}
        <div className='space-y-3'>
          <div className='mb-2 flex items-center gap-2'>
            <Tag className='h-4 w-4 text-orange-500' />
            <span className='text-muted-foreground text-sm font-medium'>
              Target Product
            </span>
          </div>

          <div className='space-y-2'>
            <div>
              <p className='text-muted-foreground mb-1 text-xs'>Product Name</p>
              <p className='bg-background rounded-md border p-2 text-sm'>
                {formData.target_product_name || 'No product specified'}
              </p>
            </div>

            {formData.target_product_category && (
              <div>
                <p className='text-muted-foreground mb-1 text-xs'>Category</p>
                <Badge variant='outline' className='text-xs'>
                  {formData.target_product_category}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Budget & Currency */}
        <div className='space-y-3'>
          <div className='mb-2 flex items-center gap-2'>
            <DollarSign className='h-4 w-4 text-green-600' />
            <span className='text-muted-foreground text-sm font-medium'>
              Budget & Currency
            </span>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            {formData.target_budget_range && (
              <div>
                <p className='text-muted-foreground mb-1 text-xs'>
                  Budget Range
                </p>
                <div className='rounded-md border border-green-200 bg-green-50 p-2'>
                  <p className='text-sm font-semibold text-green-800'>
                    {new Intl.NumberFormat('vi-VN').format(
                      formData.target_budget_range
                    )}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className='text-muted-foreground mb-1 text-xs'>Currency</p>
              <Badge variant='outline' className='text-xs'>
                {formData.currency || 'VND'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Project Configuration */}
        <div className='space-y-3'>
          <div className='mb-2 flex items-center gap-2'>
            <Settings className='h-4 w-4 text-blue-500' />
            <span className='text-muted-foreground text-sm font-medium'>
              Configuration
            </span>
          </div>

          <div className='space-y-2'>
            {formData.pipeline_type && (
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-xs'>
                  Pipeline Type
                </span>
                <Badge variant='outline' className='text-xs capitalize'>
                  {formData.pipeline_type}
                </Badge>
              </div>
            )}

            {formData.crawl_schedule && (
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-xs'>
                  Crawl Schedule
                </span>
                <Badge variant='outline' className='text-xs capitalize'>
                  {formData.crawl_schedule}
                </Badge>
              </div>
            )}

            {formData.deadline && (
              <div>
                <div className='mb-1 flex items-center gap-2'>
                  <Calendar className='h-3 w-3 text-red-500' />
                  <span className='text-muted-foreground text-xs'>
                    Deadline
                  </span>
                </div>
                <div className='rounded-md border border-red-200 bg-red-50 p-2'>
                  <p className='text-xs font-medium text-red-700'>
                    {formData.deadline.toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {formData.next_crawl_at && (
              <div>
                <div className='mb-1 flex items-center gap-2'>
                  <Clock className='h-3 w-3 text-blue-500' />
                  <span className='text-muted-foreground text-xs'>
                    Next Crawl
                  </span>
                </div>
                <div className='rounded-md border border-blue-200 bg-blue-50 p-2'>
                  <p className='text-xs font-medium text-blue-700'>
                    {formData.next_crawl_at.toLocaleDateString('vi-VN')}{' '}
                    {formData.next_crawl_at.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Team & AI Assignment */}
        <div className='space-y-3'>
          <div className='mb-2 flex items-center gap-2'>
            <Users className='h-4 w-4 text-purple-600' />
            <span className='text-muted-foreground text-sm font-medium'>
              Assignments
            </span>
          </div>

          <div className='space-y-3'>
            {assignedUsers.length > 0 ? (
              <div>
                <p className='text-muted-foreground mb-1 text-xs'>
                  Assigned Team Members ({assignedUsers.length})
                </p>
                <div className='space-y-1'>
                  {assignedUsers.map((user) => (
                    <div
                      key={user.id}
                      className='rounded-md border border-blue-200 bg-blue-50 p-2'
                    >
                      <p className='text-sm font-medium text-blue-800'>
                        {user.name}
                      </p>
                      <p className='text-xs text-blue-600'>{user.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-xs'>
                  Team Members
                </span>
                <Badge variant='secondary' className='text-xs'>
                  Unassigned
                </Badge>
              </div>
            )}

            {assignedModel ? (
              <div>
                <p className='text-muted-foreground mb-1 text-xs'>AI Model</p>
                <div className='rounded-md border border-purple-200 bg-purple-50 p-2'>
                  <div className='flex items-center gap-2'>
                    <Bot className='h-4 w-4 text-purple-600' />
                    <p className='text-sm font-medium text-purple-800'>
                      {assignedModel.name}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-xs'>AI Model</span>
                <Badge variant='secondary' className='text-xs'>
                  No Model
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Project Meta Information */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs font-medium'>
              Project Status
            </span>
            <Badge
              variant={formData.isActive ? 'default' : 'secondary'}
              className='text-xs'
            >
              {formData.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {formData.created_by && (
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-xs'>Created By</span>
              <span className='text-xs font-medium'>
                {MOCK_USERS.find((u) => u.id === formData.created_by)?.name ||
                  'Unknown'}
              </span>
            </div>
          )}

          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs'>Created At</span>
            <span className='text-xs font-medium'>
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Preview Footer */}
        <div className='bg-muted/30 mt-4 rounded-lg p-3'>
          <div className='flex items-center gap-2'>
            <FileText className='text-muted-foreground h-4 w-4' />
            <span className='text-muted-foreground text-xs'>
              This is a preview of your project. All information will be saved
              when you publish.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
