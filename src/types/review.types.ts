export interface ProductReview {
  id: string;
  product_id: string;
  crawl_session_id?: string;
  reviewer_name?: string;
  reviewer_id?: string;
  rating: number; // 1-5
  content?: string;
  review_date?: string;
  platform: string;
  source_url?: string;
  is_verified_purchase: boolean;
  helpful_count?: number;
  images?: Record<string, unknown>;
  crawled_at: string;
  created_at: string;
  updated_at: string;
  analysis?: ReviewAnalysis;
}

export interface ProductReviewListResponse {
  items: ProductReview[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductReviewCreate {
  product_id: string;
  crawl_session_id?: string;
  reviewer_name?: string;
  reviewer_id?: string;
  rating: number;
  content?: string;
  review_date?: string;
  platform: string;
  source_url?: string;
  is_verified_purchase?: boolean;
  helpful_count?: number;
  images?: Record<string, unknown>;
  raw_data?: Record<string, unknown>;
}

export interface ProductReviewUpdate {
  reviewer_name?: string;
  reviewer_id?: string;
  rating?: number;
  content?: string;
  review_date?: string;
  is_verified_purchase?: boolean;
  helpful_count?: number;
  images?: Record<string, unknown>;
}

export interface ReviewStatistics {
  total_reviews: number;
  verified_reviews: number;
  rating_distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  platform_distribution: Record<string, number>;
}

export interface ReviewStatisticsResponse {
  product_id: string;
  reviews: ReviewStatistics;
  analysis: AnalysisStatistics;
}

export interface ReviewAnalysis {
  id: string;
  review_id: string;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  sentiment_score: number; // 0-1
  sentiment_confidence: number; // 0-1
  is_spam: boolean;
  spam_score: number; // 0-1
  spam_confidence: number; // 0-1
  sentiment_model_version?: string;
  spam_model_version?: string;
  analyzed_at: string;
  analysis_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ReviewAnalysisListResponse {
  items: ReviewAnalysis[];
  total: number;
  skip: number;
  limit: number;
}

export interface ReviewAnalysisCreate {
  review_id: string;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
  sentiment_confidence: number;
  is_spam: boolean;
  spam_score: number;
  spam_confidence: number;
  sentiment_model_version?: string;
  spam_model_version?: string;
  analysis_metadata?: Record<string, unknown>;
}

export interface ReviewAnalysisUpdate {
  sentiment_label?: 'positive' | 'negative' | 'neutral';
  sentiment_score?: number;
  sentiment_confidence?: number;
  is_spam?: boolean;
  spam_score?: number;
  spam_confidence?: number;
  sentiment_model_version?: string;
  spam_model_version?: string;
  analysis_metadata?: Record<string, unknown>;
}

export interface AnalysisStatistics {
  total_analyzed: number;
  sentiment_counts: {
    positive: number;
    negative: number;
    neutral: number;
  };
  spam_count: number;
  spam_percentage: number;
  average_sentiment_score: number;
}

export interface AnalysisStatisticsResponse {
  product_id: string;
  total_analyzed: number;
  sentiment_counts: {
    positive: number;
    negative: number;
    neutral: number;
  };
  spam_count: number;
  spam_percentage: number;
  average_sentiment_score: number;
}



