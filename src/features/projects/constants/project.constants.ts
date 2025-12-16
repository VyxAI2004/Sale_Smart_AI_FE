import type { StatusOption, SelectOption, ProjectFormData } from '../types/project.types';

export const PRODUCT_CATEGORIES: string[] = [
  'Điện thoại & Phụ kiện',
  'Laptop & Máy tính',
  'Thời trang Nam',
  'Thời trang Nữ',
  'Gia dụng & Đời sống',
  'Sức khỏe & Làm đẹp',
  'Thể thao & Du lịch',
  'Sách & Văn phòng phẩm',
  'Thực phẩm & Đồ uống',
  'Ô tô & Xe máy',
  'Mẹ & Bé',
  'Nhà cửa & Đời sống',
];

export const CURRENCIES: SelectOption[] = [
  { value: 'VND', label: 'VND (₫)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
];

export const CRAWL_SCHEDULES: SelectOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

export const PIPELINE_TYPES: SelectOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'custom', label: 'Custom' },
];

// Status options with translation keys
export const STATUS_OPTIONS: StatusOption[] = [
  { 
    value: 'draft', 
    label: 'Draft', // Will be replaced with translation
    color: 'bg-yellow-100 text-yellow-800' 
  },
  { 
    value: 'ready', 
    label: 'Ready', // Will be replaced with translation
    color: 'bg-blue-100 text-blue-800' 
  },
  { 
    value: 'running', 
    label: 'Running', // Will be replaced with translation
    color: 'bg-green-100 text-green-800' 
  },
  { 
    value: 'paused', 
    label: 'Paused', // Will be replaced with translation
    color: 'bg-orange-100 text-orange-800' 
  },
  { 
    value: 'completed', 
    label: 'Completed', // Will be replaced with translation
    color: 'bg-blue-100 text-blue-800' 
  },
  { 
    value: 'archived', 
    label: 'Archived', // Will be replaced with translation
    color: 'bg-gray-100 text-gray-800' 
  },
];

// Helper function to get translated status label
export const getStatusTranslationKey = (status: string): string => {
  const statusMap: Record<string, string> = {
    'draft': 'projects.statusDraft',
    'ready': 'projects.statusReady',
    'running': 'projects.statusRunning',
    'paused': 'projects.statusPaused',
    'completed': 'projects.statusCompleted',
    'archived': 'projects.statusArchived',
  }
  return statusMap[status?.toLowerCase()] || 'projects.status'
}

export const DEFAULT_FORM_DATA: ProjectFormData = {
  name: '',
  description: '',
  target_product_name: '',
  target_product_category: '',
  target_budget_range: undefined,
  currency: 'VND',
  status: 'draft',
  pipeline_type: 'standard',
  crawl_schedule: '',
  deadline: undefined,
  assigned_to: [],
  assigned_model_id: '',
  product_images: [],
  isActive: true,
};

// Mock data - trong thực tế sẽ lấy từ API
export const MOCK_USERS = [
  { id: '1', name: 'Nguyễn Văn A', email: 'nguyen.van.a@company.com', avatar: undefined },
  { id: '2', name: 'Trần Thị B', email: 'tran.thi.b@company.com', avatar: undefined },
  { id: '3', name: 'Lê Văn C', email: 'le.van.c@company.com', avatar: undefined },
];

export const MOCK_AI_MODELS = [
  { id: '1', name: 'GPT-4' },
  { id: '2', name: 'Claude-3' },
  { id: '3', name: 'Gemini Pro' },
];