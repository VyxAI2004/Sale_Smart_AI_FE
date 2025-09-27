import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Bot, Brain, Zap } from 'lucide-react'
import type { ProjectFormData } from '../types/project.types'
import { MOCK_AI_MODELS } from '../constants/project.constants'

interface AIModelCardProps {
  formData: ProjectFormData
  onInputChange: (field: keyof ProjectFormData, value: unknown) => void
}

export function AIModelCard({ formData, onInputChange }: AIModelCardProps) {
  const selectedModel = MOCK_AI_MODELS.find(model => model.id === formData.assigned_model_id)

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          AI Model Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="assigned_model_id" className="text-sm font-medium">
            Assigned AI Model
          </Label>
          <Select
            value={formData.assigned_model_id || ''}
            onValueChange={(value) => onInputChange('assigned_model_id', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an AI model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                <span className="text-muted-foreground">No model assigned</span>
              </SelectItem>
              {MOCK_AI_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    {model.name.includes('GPT') && <Bot className="h-4 w-4 text-green-500" />}
                    {model.name.includes('Claude') && <Brain className="h-4 w-4 text-orange-500" />}
                    {model.name.includes('Gemini') && <Zap className="h-4 w-4 text-blue-500" />}
                    <span>{model.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedModel && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Assigned Model
              </Badge>
              <span className="font-medium text-sm">{selectedModel.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This AI model will be used for product analysis and insights generation for this project.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Bot className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">AI Model Integration</p>
              <p className="mt-1">
                Assigning an AI model will enable automated product analysis, 
                price monitoring, and market insights for this project.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}