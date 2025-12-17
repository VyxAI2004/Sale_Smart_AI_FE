export interface Project {
  id?: string
  name: string
  description?: string
  target_product_name: string
  target_product_category?: string
  target_budget_range?: number
  currency?: string
  status?: ProjectStatus
  pipeline_type?: PipelineType
  crawl_schedule?: CrawlSchedule
  next_crawl_at?: Date
  created_by?: string
  assigned_to?: string[]
  assigned_model_id?: string
  deadline?: Date
  completed_at?: Date
  created_at?: Date
  updated_at?: Date
  product_images?: string[]
}

export type ProjectStatus =
  | 'draft'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'archived'

export type PipelineType = 'standard' | 'advanced' | 'custom'

export type CrawlSchedule = 'daily' | 'weekly' | 'monthly' | 'custom' | ''

export interface ProjectFormData
  extends Omit<Project, 'id' | 'created_at' | 'updated_at' | 'completed_at'> {
  isActive: boolean
}

export interface ProjectFormErrors {
  name?: string
  target_product_name?: string
  target_budget_range?: string
  assigned_to?: string
  [key: string]: string | undefined
}

export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
}

export interface AIModel {
  id: string
  name: string
  description?: string
  version?: string
}

export interface StatusOption {
  value: ProjectStatus
  label: string
  color: string
}

export interface SelectOption {
  value: string
  label: string
}
