import { z } from 'zod'

export const projectStatusSchema = z.union([
  z.literal('draft'),
  z.literal('active'), 
  z.literal('paused'),
  z.literal('completed'),
  z.literal('archived'),
])
export type ProjectStatus = z.infer<typeof projectStatusSchema>

export const pipelineTypeSchema = z.union([
  z.literal('standard'),
  z.literal('advanced'),
  z.literal('custom'),
])
export type PipelineType = z.infer<typeof pipelineTypeSchema>

export const crawlScheduleSchema = z.union([
  z.literal('daily'),
  z.literal('weekly'),
  z.literal('monthly'),
  z.literal('custom'),
])
export type CrawlSchedule = z.infer<typeof crawlScheduleSchema>

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  target_product_name: z.string(),
  target_product_category: z.string().optional(),
  target_budget_range: z.number().optional(),
  currency: z.string().default('VND'),
  status: projectStatusSchema.default('draft'),
  pipeline_type: pipelineTypeSchema.default('standard'),
  crawl_schedule: crawlScheduleSchema.optional(),
  assigned_to: z.string().optional(),
  assigned_model_id: z.string().optional(),
  deadline: z.coerce.date().optional(),
  created_by: z.string().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  completed_at: z.coerce.date().optional(),
})

export type Project = z.infer<typeof projectSchema>

export const projectListSchema = z.array(projectSchema)