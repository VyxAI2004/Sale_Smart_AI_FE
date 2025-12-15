export interface UserAIModel {
  id: string;
  user_id: string;
  ai_model_id: string;
  api_key?: string;
  config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  // User info for admin view
  user_username?: string;
  user_email?: string;
  user_full_name?: string;
  // AI Model info
  ai_model_name?: string;
  ai_model_provider?: string;
  ai_model_type?: string;
}

export interface UserAIModelCreate {
  ai_model_id: string;
  api_key?: string;
  config?: Record<string, unknown>;
}

export interface UserAIModelUpdate {
  api_key?: string;
  config?: Record<string, unknown>;
}



