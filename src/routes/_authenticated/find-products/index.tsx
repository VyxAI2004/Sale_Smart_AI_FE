import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { FindProductsPage } from '@/features/products/pages/find-products-page'

const findProductsSearchSchema = z.object({
  projectId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/find-products/')({
  validateSearch: findProductsSearchSchema,
  component: FindProductsPage,
})
