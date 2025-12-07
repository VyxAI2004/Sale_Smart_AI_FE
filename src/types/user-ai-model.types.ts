export interface UserAIModel {
  id: string;
  user_id: string;
  ai_model_id: string;
  api_key?: string;
  config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
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



