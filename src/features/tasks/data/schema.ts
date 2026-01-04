import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string().optional(),
  status: z.string(),
  label: z.string().optional(),
  priority: z.string(),
  product_id: z.string().optional().nullable(),
  product_name: z.string().optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  project_id: z.string(),
  pipeline_stage: z.string().optional(),
  stage_order: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
