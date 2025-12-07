import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { 
  DollarSign, 
  Edit3,
  Save,
  X,
  Target,
  Clock
} from 'lucide-react'
import { useState } from 'react'
import type { ProjectDetailData } from '../../types/project-detail.types'
import type { PipelineType, CrawlSchedule } from '../../types/project.types'

interface ProjectDetailsCardProps {
  project: ProjectDetailData | null
  isLoading?: boolean
  onUpdate?: (updates: Partial<ProjectDetailData>) => void
}

export function ProjectDetailsCard({ 
  project, 
  isLoading = false,
  onUpdate 
}: ProjectDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<ProjectDetailData>>({})

  const formatCurrency = (amount: number | null, currency = 'VND') => {
    if (!amount) return '--'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleStartEdit = () => {
    if (!project) return
    setEditData({
      name: project.name,
      description: project.description,
      target_product_name: project.target_product_name,
      target_product_category: project.target_product_category,
      target_budget_range: project.target_budget_range,
      currency: project.currency,
      pipeline_type: project.pipeline_type,
      crawl_schedule: project.crawl_schedule,
      deadline: project.deadline
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editData)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({})
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Budget & Finance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Schedule & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Quick Edit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No project data available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Project Details Cards - Moved to top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget & Finance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget & Finance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(project.target_budget_range ?? null, project.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Currency</p>
                <Badge variant="secondary">{project.currency || 'VND'}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{project.target_product_category || 'Not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Schedule & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Crawl Schedule</span>
                <Badge variant={project.crawl_schedule ? 'default' : 'secondary'}>
                  {project.crawl_schedule || 'Not configured'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Crawl</span>
                <span className="text-sm text-muted-foreground">
                  {project.next_crawl_at ? new Date(project.next_crawl_at).toLocaleDateString('vi-VN') : 'Not scheduled'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deadline</span>
                <span className="text-sm text-muted-foreground">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : 'Not set'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pipeline</span>
                <Badge variant="outline">
                  {project.pipeline_type || 'Standard'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Edit Panel - Moved to bottom */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Quick Edit
            </CardTitle>
            {!isEditing ? (
              <Button size="sm" onClick={handleStartEdit}>
                Edit Project
                <Edit3 className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                  <Save className="w-4 h-4 ml-1" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                  <X className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-4 pb-2 border-b">Basic Info</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Product</Label>
                    <Input
                      id="target"
                      value={editData.target_product_name || ''}
                      onChange={(e) => setEditData({...editData, target_product_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Finance */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-4 pb-2 border-b">Budget & Finance</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={editData.target_budget_range || ''}
                      onChange={(e) => setEditData({...editData, target_budget_range: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={editData.currency} onValueChange={(value) => setEditData({...editData, currency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VND">VND</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editData.target_product_category || ''}
                      onChange={(e) => setEditData({...editData, target_product_category: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-4 pb-2 border-b">Schedule & Timeline</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pipeline">Pipeline Type</Label>
                    <Select 
                      value={editData.pipeline_type} 
                      onValueChange={(value) => setEditData({...editData, pipeline_type: value as PipelineType})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pipeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Crawl Schedule</Label>
                    <Select 
                      value={editData.crawl_schedule || ''} 
                      onValueChange={(value) => setEditData({...editData, crawl_schedule: value as CrawlSchedule})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <DatePicker
                      value={editData.deadline ? new Date(editData.deadline) : undefined}
                      onChange={(date) => setEditData({...editData, deadline: date})}
                      placeholder="Select deadline"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Basic Info</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Project:</span>
                    <p className="text-sm text-muted-foreground">{project.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Target:</span>
                    <p className="text-sm text-muted-foreground">{project.target_product_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground">{project.description || 'No description'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Budget & Finance</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Budget:</span>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(project.target_budget_range ?? null, project.currency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Currency:</span>
                    <p className="text-sm text-muted-foreground">{project.currency || 'VND'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Category:</span>
                    <p className="text-sm text-muted-foreground">{project.target_product_category || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Schedule & Timeline</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Pipeline:</span>
                    <Badge variant="outline">{project.pipeline_type || 'Standard'}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Schedule:</span>
                    <p className="text-sm text-muted-foreground">{project.crawl_schedule || 'Not configured'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Deadline:</span>
                    <p className="text-sm text-muted-foreground">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}