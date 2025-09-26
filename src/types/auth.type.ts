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
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

export type TLoginPayload = z.infer<typeof loginPayloadSchema>
export type TLoginResponse = z.infer<typeof loginResponseSchema>
export type TUser = z.infer<typeof userSchema>