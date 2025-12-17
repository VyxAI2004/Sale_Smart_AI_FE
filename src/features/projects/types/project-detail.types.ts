import type { ProjectApiResponse } from '../api/project-api'

// Project Analytics Types
export interface ProjectAnalytics {
  total_products: number
  analyzed_products: number
  confidence_score: number
  recommended_price: number
  market_position: number
  trends: {
    products_growth: string
    price_trend: string
  }
}

// Product Source Types
export interface ProductSource {
  id: string
  url: string
  platform: string
  product_name: string
  is_active: boolean
  last_crawled_at: string | null
  next_crawl_at: string | null
  crawl_status: 'active' | 'pending' | 'failed' | 'paused'
}

// Competitor Product Types
export interface CompetitorProduct {
  id: string
  name: string
  brand: string
  platform: string
  current_price: number
  currency: string
  similarity_score: number
  average_rating: number
  review_count: number
  url: string
  collected_at: string
}

// Price Analysis Types
export interface PriceAnalysis {
  id: string
  avg_market_price: number
  min_price: number
  max_price: number
  recommended_price: number
  confidence_score: number
  insights: string
  price_by_brand: Record<string, number>
  created_at: string
}

// AI Model Stats
export interface AIModelStats {
  llm: {
    model_name: string
    usage_count: number
    last_used_at: string | null
  }
  crawler: {
    model_name: string
    usage_count: number
    last_used_at: string | null
  }
  analyzer: {
    model_name: string
    usage_count: number
    last_used_at: string | null
  }
}

// Task Types
export interface ProjectTask {
  id: string
  name: string
  pipeline_stage: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  assigned_to: string | null
  assigned_user_name: string | null
  due_date: string | null
  completed_at: string | null
}

// Activity Types
export interface ProjectActivity {
  id: string
  action: string
  user_name: string | null
  model_name: string | null
  created_at: string
  metadata: Record<string, unknown>
}

// Comprehensive Project Detail
export interface ProjectDetailData extends ProjectApiResponse {
  analytics: ProjectAnalytics | null
  product_sources: ProductSource[]
  competitor_products: CompetitorProduct[]
  price_analysis: PriceAnalysis | null
  ai_model_stats: AIModelStats | null
  tasks: ProjectTask[]
  recent_activities: ProjectActivity[]
  team_members: Array<{
    id: string
    name: string
    email: string
    avatar_url: string | null
  }>
}
