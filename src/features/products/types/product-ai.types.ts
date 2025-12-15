export interface ProductWithLink {
  name: string;
  estimated_price: number;
  url: string;
}

export interface ProductWithMultiLinks {
  name: string;
  estimated_price: number;
  urls: {
    shopee: string;
    lazada: string;
    tiki: string;
  };
}

export interface ProjectInfo {
  id: string;
  name: string;
  description?: string;
  target_product: string;
  budget?: number;
  platform: string;
}

export interface GroundingMetadata {
  grounding_supports: number;
  search_entry_point?: string;
}

export interface GroundingMetadataFull {
  step1_analysis?: GroundingMetadata;
  step2_links?: GroundingMetadata;
}

export interface ProductSearchResponse {
  project_info: ProjectInfo;
  ai_analysis: string;
  recommended_products: Array<ProductWithLink | ProductWithMultiLinks>;
  all_products: Array<ProductWithLink | ProductWithMultiLinks>;
  total_found: number;
  grounding_metadata: GroundingMetadataFull;
  note: string;
}

export type PlatformEnum = 'shopee' | 'lazada' | 'tiki' | 'all';


