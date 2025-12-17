export interface DetailedRating {
  [key: string]: number | string
}

export interface Product {
  id: string
  project_id: string
  product_source_id?: string
  crawl_session_id?: string
  company?: string
  name: string
  brand?: string
  category?: string
  subcategory?: string
  platform: 'shopee' | 'lazada' | 'tiki' | string
  current_price: number
  original_price?: number
  discount_rate?: number
  currency?: string
  specifications?: Record<string, unknown>
  features?: string
  description?: string
  images?: Record<string, unknown>
  average_rating?: number
  review_count?: number
  sold_count?: number
  detailed_rating?: DetailedRating | Record<string, unknown>
  url: string
  collected_at?: string
  is_verified?: boolean
  data_source?: string
  trust_score?: number
  created_at?: string
  updated_at?: string
}

export interface ProductListResponse {
  items: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductCreate {
  project_id: string
  product_source_id?: string
  crawl_session_id?: string
  company?: string
  name: string
  brand?: string
  category?: string
  subcategory?: string
  platform?: string
  current_price?: number
  original_price?: number
  discount_rate?: number
  currency?: string
  specifications?: Record<string, unknown>
  features?: string
  images?: Record<string, unknown>
  url: string
  is_verified?: boolean
  data_source?: string
}

export interface ProductUpdate {
  name?: string
  company?: string
  brand?: string
  category?: string
  subcategory?: string
  platform?: string
  current_price?: number
  original_price?: number
  discount_rate?: number
  currency?: string
  specifications?: Record<string, unknown>
  features?: string
  images?: Record<string, unknown>
  url?: string
  is_verified?: boolean
  data_source?: string
}
