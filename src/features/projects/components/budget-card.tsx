import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { ProjectFormData, ProjectFormErrors } from '../types/project.types';
import { CURRENCIES } from '../constants/project.constants';

interface BudgetCardProps {
  formData: ProjectFormData;
  errors: ProjectFormErrors;
  onInputChange: (field: keyof ProjectFormData, value: unknown) => void;
}

export const BudgetCard = ({ formData, errors, onInputChange }: BudgetCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget & Currency</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_budget_range" className="text-sm font-medium">
              Budget Range
            </Label>
            <Input
              id="target_budget_range"
              type="number"
              value={formData.target_budget_range || ''}
              onChange={(e) => onInputChange('target_budget_range', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0.00"
              className={errors.target_budget_range ? 'border-red-500' : ''}
            />
            {errors.target_budget_range && <p className="text-red-500 text-xs">{errors.target_budget_range}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-medium">
              Currency
            </Label>
            <Select value={formData.currency} onValueChange={(value) => onInputChange('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Active Project</Label>
            <p className="text-xs text-gray-500">Enable project for data collection</p>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => onInputChange('isActive', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};