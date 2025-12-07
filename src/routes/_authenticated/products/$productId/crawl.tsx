import { createFileRoute } from '@tanstack/react-router';
import { ProductCrawl } from '@/features/products/components/product-crawl';

export const Route = createFileRoute('/_authenticated/products/$productId/crawl')({
  component: ProductCrawl,
});
