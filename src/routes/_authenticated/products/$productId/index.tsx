import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@/features/products/components/product-detail-page'

export const Route = createFileRoute('/_authenticated/products/$productId/')({
  component: ProductDetailPage,
})
