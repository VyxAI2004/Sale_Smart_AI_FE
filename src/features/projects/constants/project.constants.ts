/**
 * Project constants
 */

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'ready', label: 'Ready', color: 'bg-blue-100 text-blue-800' },
  { value: 'running', label: 'Running', color: 'bg-green-100 text-green-800' },
  { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Completed', color: 'bg-purple-100 text-purple-800' },
  { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-800' },
]

export const PIPELINE_TYPES = [
  { value: 'standard', label: 'Standard Pipeline' },
  { value: 'advanced', label: 'Advanced Pipeline' },
  { value: 'custom', label: 'Custom Pipeline' },
]

export const PRODUCT_CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
  { value: 'books', label: 'Books' },
  { value: 'other', label: 'Other' },
]

export const CURRENCIES = [
  { value: 'VND', code: 'VND', symbol: '₫', label: 'Vietnamese Dong' },
  { value: 'USD', code: 'USD', symbol: '$', label: 'US Dollar' },
  { value: 'EUR', code: 'EUR', symbol: '€', label: 'Euro' },
  { value: 'GBP', code: 'GBP', symbol: '£', label: 'British Pound' },
  { value: 'JPY', code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
]

export const CRAWL_SCHEDULES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
]

export const MOCK_AI_MODELS = [
  { id: '1', name: 'GPT-4', provider: 'OpenAI', version: '4.0' },
  { id: '2', name: 'Claude 3', provider: 'Anthropic', version: '3.0' },
  { id: '3', name: 'Gemini Pro', provider: 'Google', version: '1.0' },
]

// Mock users for form - will be replaced with real API data in team-assignment-card
export const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
]

/**
 * Helper function to get status translation key
 */
export const getStatusTranslationKey = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: 'project_status.draft',
    ready: 'project_status.ready',
    running: 'project_status.running',
    paused: 'project_status.paused',
    completed: 'project_status.completed',
    archived: 'project_status.archived',
  }
  return statusMap[status] || status
}


