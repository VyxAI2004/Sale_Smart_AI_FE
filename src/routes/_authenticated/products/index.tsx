import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products/pages/products-page'

const productsSearchSchema = z.object({
  projectId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/products/')({
  validateSearch: productsSearchSchema,
  component: ProductsPage,
})
