export interface TrustScoreAnalysis {
  interpretation: string
  strengths: string[]
  weaknesses: string[]
}

export interface ReviewInsights {
  sentiment_overview: string
  key_positive_themes: string[]
  key_negative_themes: string[]
  spam_concerns: string
}

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high'
  risk_factors: string[]
  confidence_level: string
}

export interface ProductAnalyticsAnalysis {
  summary: string
  trust_score_analysis: TrustScoreAnalysis
  review_insights: ReviewInsights
  recommendations: string[]
  risk_assessment: RiskAssessment
}

export interface ProductAnalyticsMetadata {
  model_used: string
  total_reviews_analyzed: number
  sample_reviews_count: number
  error?: string
}

export interface ProductAnalyticsResponse {
  product_id: string
  analysis: ProductAnalyticsAnalysis
  metadata: ProductAnalyticsMetadata
  generated_at: string
}
