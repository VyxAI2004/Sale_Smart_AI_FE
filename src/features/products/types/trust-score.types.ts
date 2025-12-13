export interface ProductTrustScore {
  id: string;
  product_id: string;
  trust_score: number; // 0-100
  total_reviews: number;
  analyzed_reviews: number;
  verified_reviews_count: number;
  spam_reviews_count: number;
  spam_percentage: number;
  positive_reviews_count: number;
  negative_reviews_count: number;
  neutral_reviews_count: number;
  average_sentiment_score: number;
  review_quality_score?: number;
  engagement_score?: number;
  calculated_at: string;
  calculation_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TrustScoreBreakdown {
  factor: number;
  weight: number;
  contribution: number;
  details: Record<string, unknown>;
}

export interface TrustScoreDetailResponse {
  product_id: string;
  trust_score: number;
  breakdown: Record<string, TrustScoreBreakdown>;
  total_reviews: number;
  analyzed_reviews: number;
  calculated_at: string;
}

export interface TopTrustedProduct {
  product_id: string;
  product_name: string;
  trust_score: number;
  total_reviews: number;
  platform: string;
}

export interface TopTrustedProductsResponse {
  items: TopTrustedProduct[];
  total: number;
  limit: number;
}

export interface ProductsByScoreRangeResponse {
  items: Array<{
    product_id: string;
    product_name: string;
    trust_score: number;
    platform: string;
  }>;
  total: number;
  min_score: number;
  max_score: number;
  skip: number;
  limit: number;
}

