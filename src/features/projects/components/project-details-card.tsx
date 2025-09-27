import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProjectFormData, ProjectFormErrors } from '../types/project.types';
import { PIPELINE_TYPES } from '../constants/project.constants';

interface ProjectDetailsCardProps {
  formData: ProjectFormData;
  errors: ProjectFormErrors;
  onInputChange: (field: keyof ProjectFormData, value: unknown) => void;
}

export const ProjectDetailsCard = ({ formData, errors, onInputChange }: ProjectDetailsCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Project Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Enter project name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_product_name" className="text-sm font-medium">
              Target Product
            </Label>
            <Input
              id="target_product_name"
              value={formData.target_product_name}
              onChange={(e) => onInputChange('target_product_name', e.target.value)}
              placeholder="Product name"
              className={errors.target_product_name ? 'border-red-500' : ''}
            />
            {errors.target_product_name && <p className="text-red-500 text-xs">{errors.target_product_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pipeline_type" className="text-sm font-medium">
              Pipeline Type
            </Label>
            <Select value={formData.pipeline_type} onValueChange={(value) => onInputChange('pipeline_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Set a description to the project for better visibility."
            rows={4}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};