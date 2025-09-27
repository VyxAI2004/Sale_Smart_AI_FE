import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  FileText
} from 'lucide-react';
import type { ProjectFormData } from '../types/project.types';
import { STATUS_OPTIONS, MOCK_USERS, MOCK_AI_MODELS } from '../constants/project.constants';

interface ProjectPreviewCardProps {
  formData: ProjectFormData;
}

export const ProjectPreviewCard = ({ formData }: ProjectPreviewCardProps) => {
  const currentStatus = STATUS_OPTIONS.find(s => s.value === formData.status);
  const assignedUsers = MOCK_USERS.filter(u => formData.assigned_to?.includes(u.id));
  const assignedModel = MOCK_AI_MODELS.find(m => m.id === formData.assigned_model_id);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Project Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Images Gallery */}
        {formData.product_images && formData.product_images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-muted-foreground">Product Images</span>
              <Badge variant="secondary" className="text-xs">
                {formData.product_images.length}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {formData.product_images.slice(0, 4).map((_, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                    <div className="text-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground truncate px-1">
                        Image {index + 1}
                      </p>
                    </div>
                  </div>
                  {formData.product_images && formData.product_images.length > 4 && index === 3 && (
                    <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
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
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status</span>
          </div>
          <Badge className={currentStatus?.color || 'bg-gray-100 text-gray-800'}>
            {currentStatus?.label || 'Draft'}
          </Badge>
        </div>

        {/* Project Basic Info */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Project Information</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Project Name</p>
                <p className="text-sm font-medium bg-background border rounded-md p-2">
                  {formData.name || 'Untitled Project'}
                </p>
              </div>

              {formData.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-xs bg-background border rounded-md p-2 text-muted-foreground">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Target Product Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">Target Product</span>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Product Name</p>
              <p className="text-sm bg-background border rounded-md p-2">
                {formData.target_product_name || 'No product specified'}
              </p>
            </div>

            {formData.target_product_category && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <Badge variant="outline" className="text-xs">
                  {formData.target_product_category}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Budget & Currency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">Budget & Currency</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {formData.target_budget_range && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                <div className="bg-green-50 border border-green-200 rounded-md p-2">
                  <p className="text-sm font-semibold text-green-800">
                    {new Intl.NumberFormat('vi-VN').format(formData.target_budget_range)}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-1">Currency</p>
              <Badge variant="outline" className="text-xs">
                {formData.currency || 'VND'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Project Configuration */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Configuration</span>
          </div>

          <div className="space-y-2">
            {formData.pipeline_type && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Pipeline Type</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {formData.pipeline_type}
                </Badge>
              </div>
            )}

            {formData.crawl_schedule && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Crawl Schedule</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {formData.crawl_schedule}
                </Badge>
              </div>
            )}

            {formData.deadline && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-muted-foreground">Deadline</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-2">
                  <p className="text-xs font-medium text-red-700">
                    {formData.deadline.toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {formData.next_crawl_at && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Next Crawl</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                  <p className="text-xs font-medium text-blue-700">
                    {formData.next_crawl_at.toLocaleDateString('vi-VN')} {formData.next_crawl_at.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Team & AI Assignment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">Assignments</span>
          </div>

          <div className="space-y-3">
            {assignedUsers.length > 0 ? (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Assigned Team Members ({assignedUsers.length})
                </p>
                <div className="space-y-1">
                  {assignedUsers.map(user => (
                    <div key={user.id} className="bg-blue-50 border border-blue-200 rounded-md p-2">
                      <p className="text-sm font-medium text-blue-800">{user.name}</p>
                      <p className="text-xs text-blue-600">{user.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Team Members</span>
                <Badge variant="secondary" className="text-xs">Unassigned</Badge>
              </div>
            )}

            {assignedModel ? (
              <div>
                <p className="text-xs text-muted-foreground mb-1">AI Model</p>
                <div className="bg-purple-50 border border-purple-200 rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-800">{assignedModel.name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">AI Model</span>
                <Badge variant="secondary" className="text-xs">No Model</Badge>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Project Meta Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Project Status</span>
            <Badge variant={formData.isActive ? "default" : "secondary"} className="text-xs">
              {formData.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {formData.created_by && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Created By</span>
              <span className="text-xs font-medium">
                {MOCK_USERS.find(u => u.id === formData.created_by)?.name || 'Unknown'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Created At</span>
            <span className="text-xs font-medium">
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Preview Footer */}
        <div className="bg-muted/30 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              This is a preview of your project. All information will be saved when you publish.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};