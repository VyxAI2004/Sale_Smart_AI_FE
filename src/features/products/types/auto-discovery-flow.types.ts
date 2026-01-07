/**
 * Product Discovery Flow Types
 * Phase 1: Search (existing)
 * Phase 2: Confirmation (new)
 * Phase 3: Review Count Input (new)
 * Phase 4: Processing & Results (new)
 */

// ========== Phase Management ==========

export type DiscoveryPhase = 'search' | 'confirm' | 'review_form' | 'processing' | 'complete'

// ========== Event Types ==========

export type FlowEventType =
  | 'flow_start'
  | 'review_crawl_start'
  | 'review_crawl_progress'
  | 'review_crawl_complete'
  | 'review_crawl_error'
  | 'trust_score_start'
  | 'trust_score_progress'
  | 'trust_score_complete'
  | 'trust_score_error'
  | 'analysis_start'
  | 'analysis_progress'
  | 'analysis_complete'
  | 'analysis_error'
  | 'task_generation_start'
  | 'task_generation_progress'
  | 'task_generation_complete'
  | 'task_generation_error'
  | 'flow_complete'
  | 'product_error'
  | 'error'

export interface FlowEvent {
  type: FlowEventType
  product_id?: string
  product_name?: string
  product_index?: number
  total_products?: number
  message?: string
  data?: any
  current?: number
  total?: number
  percentage?: number
  [key: string]: any
}

// ========== Product Types ==========

export interface ImportedProduct {
  id: string
  name: string
  price: number
  rating: number | null
  review_count: number | null
  platform: string
  url?: string
  reason: string // Why it was selected/rejected
}

// ========== User Input ==========

export interface ReviewCountInput {
  product_id: string
  review_count: number
}

// ========== Processing Results ==========

export interface TrustScoreBreakdown {
  authenticity: number
  sentiment: number
  spam: number
}

export interface SentimentDistribution {
  positive: number
  neutral: number
  negative: number
}

export interface Task {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  description?: string
}

export interface ProductProcessingResult {
  product_id: string
  product_name: string
  product_index?: number
  trust_score: number
  trust_score_breakdown?: TrustScoreBreakdown
  sentiment_distribution?: SentimentDistribution
  key_insights: string[]
  tasks: Task[]
  total_analyzed?: number
  tasks_count?: number
}

// ========== State Management ==========

export interface DiscoveryFlowState {
  // Current phase
  phase: DiscoveryPhase
  
  // Phase 1: Search results (from existing SearchResultsStream)
  searchResults: any // ProductSearchResponse
  
  // Phase 2: Confirmation
  passedProducts: ImportedProduct[]
  rejectedProducts: ImportedProduct[]
  userConfirmContinue: boolean | null
  
  // Phase 3: Review count inputs
  reviewCounts: { [productId: string]: number }
  
  // Phase 4: Processing
  processingStatus: 'idle' | 'running' | 'complete' | 'error'
  productProgress: { [productId: string]: number } // percentage per product
  productResults: { [productId: string]: ProductProcessingResult }
  
  // General state
  isStreaming: boolean
  error?: string
}

// ========== API Request/Response ==========

export interface ExecuteFlowRequest {
  project_id: string
  products: Array<{
    product_id: string
    review_count: number
  }>
}

export interface FlowSummary {
  total_products: number
  processed_products: number
  total_reviews_crawled?: number
  total_tasks_created?: number
}

export interface FlowCompleteEvent extends FlowEvent {
  type: 'flow_complete'
  results: { [productId: string]: ProductProcessingResult }
  summary?: FlowSummary
}
