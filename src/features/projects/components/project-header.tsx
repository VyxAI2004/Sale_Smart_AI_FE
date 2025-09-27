import { Button } from '@/components/ui/button';

interface ProjectHeaderProps {
  isSubmitting: boolean;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onDiscard?: () => void;
}

export const ProjectHeader = ({ 
  isSubmitting, 
  onSaveDraft, 
  onSubmit, 
  onDiscard,
}: ProjectHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Add Project</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="px-6"
            >
              Save Draft
            </Button>
            <Button 
              variant="outline" 
              className="px-6 text-gray-600 hover:text-gray-700"
              onClick={onDiscard}
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button 
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};