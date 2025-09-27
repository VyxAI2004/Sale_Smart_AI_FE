import type { StatusOption, SelectOption, ProjectFormData } from '../types/project.types';

export const PRODUCT_CATEGORIES: string[] = [
  'Điện thoại & Phụ kiện',
  'Laptop & Máy tính',
  'Thời trang Nam',
  'Thời trang Nữ',
  'Gia dụng & Đời sống',
  'Sức khỏe & Làm đẹp',
  'Thể thao & Du lịch',
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
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

export const PIPELINE_TYPES: SelectOption[] = [
  { value: 'standard', label: 'Tiêu chuẩn' },
  { value: 'advanced', label: 'Nâng cao' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

export const STATUS_OPTIONS: StatusOption[] = [
  { 
    value: 'draft', 
    label: 'Draft', 
    color: 'bg-yellow-100 text-yellow-800' 
  },
  { 
    value: 'active', 
    label: 'Active', 
    color: 'bg-green-100 text-green-800' 
  },
  { 
    value: 'paused', 
    label: 'Paused', 
    color: 'bg-orange-100 text-orange-800' 
  },
  { 
    value: 'completed', 
    label: 'Completed', 
    color: 'bg-blue-100 text-blue-800' 
  },
  { 
    value: 'archived', 
    label: 'Archived', 
    color: 'bg-gray-100 text-gray-800' 
  },
];

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