import { useState } from 'react';
import { useReviews, useReviewStatistics } from '@/hooks/use-reviews';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

interface ReviewsListProps {
  productId: string;
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const [platform, setPlatform] = useState<string>('');
  const [includeAnalysis, setIncludeAnalysis] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 20;

  const { data: reviewsData, isLoading } = useReviews(productId, {
    platform: platform || undefined,
    include_analysis: includeAnalysis,
    skip,
    limit,
  });

  const { data: statistics } = useReviewStatistics(productId);

  const getSentimentBadgeVariant = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      case 'neutral':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistics */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Reviews</CardDescription>
              <CardTitle className="text-3xl">{statistics.reviews.total_reviews}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {statistics.reviews.verified_reviews} verified purchases
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Rating</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                {Object.entries(statistics.reviews.rating_distribution).reduce(
                  (acc, [rating, count]) => acc + parseInt(rating) * count,
                  0
                ) / statistics.reviews.total_reviews || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Based on {statistics.reviews.total_reviews} reviews
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Analyzed Reviews</CardDescription>
              <CardTitle className="text-3xl">{statistics.analysis.total_analyzed}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {statistics.analysis.spam_count} spam detected
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>Product reviews and analysis</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={platform || "all"} onValueChange={(value) => setPlatform(value === "all" ? "" : value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="shopee">Shopee</SelectItem>
                  <SelectItem value="lazada">Lazada</SelectItem>
                  <SelectItem value="tiki">Tiki</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIncludeAnalysis(!includeAnalysis)}
              >
                {includeAnalysis ? 'Hide' : 'Show'} Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading reviews...</div>
          ) : reviewsData && reviewsData.items.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.items.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{review.reviewer_name || 'Anonymous'}</div>
                      <Badge variant="outline" className="text-xs">
                        {review.platform}
                      </Badge>
                      {review.is_verified_purchase && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.content && (
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                  )}
                  {review.analysis && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Badge variant={getSentimentBadgeVariant(review.analysis.sentiment_label)}>
                        {review.analysis.sentiment_label}
                      </Badge>
                      {review.analysis.is_spam && (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Spam
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Confidence: {(review.analysis.sentiment_confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  {review.review_date && (
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(review.review_date), 'PPp')}
                    </div>
                  )}
                </div>
              ))}
              {reviewsData.total > limit && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {skip + 1} to {Math.min(skip + limit, reviewsData.total)} of{' '}
                    {reviewsData.total} reviews
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSkip(Math.max(0, skip - limit))}
                      disabled={skip === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSkip(skip + limit)}
                      disabled={skip + limit >= reviewsData.total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No reviews found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



