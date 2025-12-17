/**
 * Auto Discovery Types
 * Types for the auto-discovery feature that automatically finds and imports products
 */

export type StreamEventType =
  | 'step_start'
  | 'step_progress'
  | 'step_complete'
  | 'ai_thinking'
  | 'step_error'
  | 'final_result'

export interface StreamEvent {
  type: StreamEventType
  step: string
  step_name?: string
  message: string
  data?: any
  timestamp?: string
}

export interface AutoDiscoveryRequest {
  project_id: string
  user_input: string // Backend expects 'user_input', not 'user_query'
  filter_criteria?: any
  max_products?: number
}

export interface RejectedProduct {
  product_name: string
  product_url: string
  platform: string
  price: number
  rating?: number | null
  review_count?: number | null
  sales_count?: number | null
  is_mall?: boolean | null
  brand?: string | null
  reason: string
}

export interface PassedProduct {
  product_name: string
  product_url: string
  platform: string
  price: number
  rating?: number | null
  review_count?: number | null
  sales_count?: number | null
  is_mall?: boolean | null
  brand?: string | null
  reason: string
}

export interface CrawledProductSummary {
  product_name: string
  product_url: string
  platform: string
  price: number
  rating?: number | null
  review_count?: number | null
  sales_count?: number | null
  is_mall?: boolean | null
  brand?: string | null
}

export interface AutoDiscoveryStepProgress {
  message?: string
  products_crawled_so_far?: number
  total_urls?: number
  checked?: number
  total?: number
  passed?: number
  rejected?: number
  evaluated?: number
  user_query?: string
  max_products?: number
  criteria?: any
  total_crawled?: number
  analysis?: string
  rejected_products?: RejectedProduct[]
  passed_products?: PassedProduct[]
  crawled_products_summary?: CrawledProductSummary[]
}

export interface AutoDiscoveryFinalResult {
  status: 'success' | 'error'
  message: string
  products_found?: number
  products_filtered?: number
  products_imported?: number
  imported_product_ids?: string[]
  extracted_criteria?: {
    min_rating?: number
    max_rating?: number
    min_review_count?: number
    max_review_count?: number
    min_price?: number
    max_price?: number
    platforms?: string[]
    is_mall?: boolean
    is_verified_seller?: boolean
    required_keywords?: string[]
    excluded_keywords?: string[]
    [key: string]: any
  }
  ai_analysis?: string
  error_type?: string
  error_message?: string
  rejected_products?: RejectedProduct[]
  rejected_count?: number
  passed_products?: PassedProduct[]
  passed_count?: number
  crawled_products_summary?: CrawledProductSummary[]
}

export interface AutoDiscoveryStep {
  id: string
  name: string
  icon: string
}

export interface AutoDiscoveryState {
  currentStep: string
  stepStatus: Record<string, 'pending' | 'active' | 'complete' | 'error'>
  aiThinking: string
  progress: Record<string, AutoDiscoveryStepProgress>
  finalResult: AutoDiscoveryFinalResult | null
  error: string | null
  isStreaming: boolean
}
