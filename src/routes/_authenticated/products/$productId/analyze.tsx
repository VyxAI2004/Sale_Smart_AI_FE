import { createFileRoute } from '@tanstack/react-router';
import { AnalyzeReviewsPage } from '@/features/products/components/analyze-reviews-page';

export const Route = createFileRoute('/_authenticated/products/$productId/analyze')({
  component: AnalyzeReviewsPage,
});
