export interface Task {
  id: string;
  project_id: string;
  crawl_session_id?: string | null;
  name: string;
  description?: string | null;
  pipeline_stage: string;
  stage_order: number;
  task_order?: number | null;
  task_type?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string | null;
  assigned_model_id?: string | null;
  due_date?: string | null;
  completed_at?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  stage_metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  project_id: string;
  crawl_session_id?: string;
  name: string;
  description?: string;
  pipeline_stage: string;
  stage_order: number;
  task_type?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  assigned_model_id?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  stage_metadata?: Record<string, any>;
}

export interface TaskUpdate {
  name?: string;
  description?: string;
  pipeline_stage?: string;
  stage_order?: number;
  task_order?: number;
  task_type?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  assigned_model_id?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  stage_metadata?: Record<string, any>;
  completed_at?: string;
}

export interface TaskGenerationRequest {
  max_tasks?: number;
}

export interface TaskGenerationResponse {
  product_id: string;
  tasks_generated: number;
  tasks: Array<{
    id: string;
    name: string;
    description?: string;
    task_type?: string;
    priority?: string;
    status?: string;
    task_order?: number;
    estimated_hours?: number;
  }>;
  message: string;
}

export interface TaskFilters {
  project_id?: string;
  assigned_to?: string;
  status?: string;
  task_type?: string;
  priority?: string;
}
