import { z } from 'zod'

export const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
})

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  avatar_url: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  date_of_birth: z.string().date().nullable().optional(),
  language: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  urls: z.array(z.string()).nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  roles: z.array(z.any()).optional(),
})

export type TLoginPayload = z.infer<typeof loginPayloadSchema>
export type TLoginResponse = z.infer<typeof loginResponseSchema>
export type TUser = z.infer<typeof userSchema>
