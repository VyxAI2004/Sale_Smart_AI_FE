export interface CrawlSearchRequest {
  project_id: string;
  search_url: string;
  max_products?: number; // 1-50, default 10
}

export interface CrawlReviewsRequest {
  product_id: string;
  review_limit?: number; // 0-100, default 30
  custom_cookies?: Record<string, string>;
}

export interface CrawlSearchResponse {
  product_urls: string[];
  status?: 'success' | 'failed';
  message?: string;
}

export interface CrawlReviewsResponse {
  status: 'success' | 'failed';
  message?: string;
  reviews_crawled?: number;
  product_updated?: boolean;
}







