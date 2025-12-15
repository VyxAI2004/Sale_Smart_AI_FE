import { useState } from 'react';
import { useCrawlSearch } from '../hooks/use-product-crawler';
import { useProductAISearchMutation } from '../hooks/use-product-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, CheckCircle2, XCircle, Sparkles, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { CrawlResultsDisplay } from './crawl-results-display';
import type { PlatformEnum } from '../types/product-ai.types';

interface CrawlerInterfaceProps {
  projectId: string;
  onCrawlComplete?: () => void;
}

export function CrawlerInterface({ projectId, onCrawlComplete }: CrawlerInterfaceProps) {
  const [searchUrl, setSearchUrl] = useState('');
  const [maxProducts, setMaxProducts] = useState(10);
  const [productUrls, setProductUrls] = useState<string[]>([]);
  const [searchUrls, setSearchUrls] = useState<string[]>([]); // Search URLs from AI
  const [useAISearch, setUseAISearch] = useState(true); // Default to AI search
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformEnum>('all'); // Default to all platforms

  const crawlSearch = useCrawlSearch();
  const aiSearch = useProductAISearchMutation();

  const handleAISearch = async () => {
    try {
      const result = await aiSearch.mutateAsync({
        projectId,
        params: {
          limit: maxProducts,
          platform: selectedPlatform,
        },
      });
      
      // Extract SEARCH URLs from AI search response (not product URLs)
      // These are search URLs that user will copy and paste into "Dán URL"
      const urls: string[] = [];
      result.recommended_products.forEach((product) => {
        if ('url' in product && product.url) {
          // Single platform product - url is search URL
          urls.push(product.url);
        } else if ('urls' in product) {
          // Multi-platform product: use selected platform or fallback
          if (selectedPlatform === 'shopee' && product.urls.shopee) {
            urls.push(product.urls.shopee);
          } else if (selectedPlatform === 'lazada' && product.urls.lazada) {
            urls.push(product.urls.lazada);
          } else if (selectedPlatform === 'tiki' && product.urls.tiki) {
            urls.push(product.urls.tiki);
          } else if (selectedPlatform === 'all') {
            // If all, collect all unique URLs
            if (product.urls.shopee) urls.push(product.urls.shopee);
            if (product.urls.lazada) urls.push(product.urls.lazada);
            if (product.urls.tiki) urls.push(product.urls.tiki);
          } else {
            // Fallback: use any available URL
            if (product.urls.shopee) urls.push(product.urls.shopee);
            else if (product.urls.lazada) urls.push(product.urls.lazada);
            else if (product.urls.tiki) urls.push(product.urls.tiki);
          }
        }
      });
      
      // Remove duplicates
      const uniqueUrls = Array.from(new Set(urls));
      setSearchUrls(uniqueUrls);
      
      // Clear product URLs (will be populated after user crawls with search URL)
      setProductUrls([]);
      
      if (onCrawlComplete) {
        onCrawlComplete();
      }
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUseSearchUrl = (url: string) => {
    // Fill search URL and switch to manual mode
    setSearchUrl(url);
    setUseAISearch(false);
    // Scroll to search input
    document.getElementById('search-url')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCopySearchUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Đã copy URL vào clipboard');
    } catch (error) {
      toast.error('Không thể copy URL');
    }
  };

  const handleCrawlSearch = async () => {
    if (!searchUrl.trim()) {
      toast.error('Please enter a search URL');
      return;
    }

    try {
      const urls = await crawlSearch.mutateAsync({
        project_id: projectId,
        search_url: searchUrl,
        max_products: maxProducts,
      });
      setProductUrls(urls);
      toast.success(`Found ${urls.length} product URLs`);
      if (onCrawlComplete) {
        onCrawlComplete();
      }
    } catch (error) {
      // Error handled by hook
    }
  };


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Crawler</CardTitle>
          <CardDescription>
            Crawl products and reviews from e-commerce platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Search Products */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 1</Badge>
              <h3 className="font-semibold">Search Products</h3>
            </div>
            
            {/* Toggle between AI Search and Manual URL */}
            <div className="flex items-center gap-2 p-2 border rounded-lg">
              <Button
                variant={useAISearch ? "default" : "ghost"}
                size="sm"
                onClick={() => setUseAISearch(true)}
                className="flex-1"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Tìm kiếm bằng A.I
              </Button>
              <Button
                variant={!useAISearch ? "default" : "ghost"}
                size="sm"
                onClick={() => setUseAISearch(false)}
                className="flex-1"
              >
                <Search className="mr-2 h-4 w-4" />
                Dán URL
              </Button>
            </div>

            {useAISearch ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="platform-select">Platform</Label>
                  <Select
                    value={selectedPlatform}
                    onValueChange={(value) => setSelectedPlatform(value as PlatformEnum)}
                  >
                    <SelectTrigger id="platform-select">
                      <SelectValue placeholder="Chọn platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả platforms</SelectItem>
                      <SelectItem value="shopee">Shopee</SelectItem>
                      <SelectItem value="lazada">Lazada</SelectItem>
                      <SelectItem value="tiki">Tiki</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Chọn platform để tìm kiếm sản phẩm
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-products">Max Products</Label>
                  <Input
                    id="max-products"
                    type="number"
                    min={1}
                    max={50}
                    value={maxProducts}
                    onChange={(e) => setMaxProducts(parseInt(e.target.value) || 10)}
                  />
                  <p className="text-xs text-muted-foreground">
                    AI will search for products based on your project requirements
                  </p>
                </div>
                <Button
                  onClick={handleAISearch}
                  disabled={aiSearch.isPending}
                  className="w-full"
                >
                  {aiSearch.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Tìm kiếm bằng A.I
                    </>
                  )}
                </Button>
                {aiSearch.isError && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span>Failed to search products with AI</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="search-url">Search URL</Label>
                  <Input
                    id="search-url"
                    placeholder="https://shopee.vn/search?keyword=..."
                    value={searchUrl}
                    onChange={(e) => setSearchUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a search URL from Shopee, Lazada, or Tiki
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-products">Max Products</Label>
                  <Input
                    id="max-products"
                    type="number"
                    min={1}
                    max={50}
                    value={maxProducts}
                    onChange={(e) => setMaxProducts(parseInt(e.target.value) || 10)}
                  />
                </div>
                <Button
                  onClick={handleCrawlSearch}
                  disabled={crawlSearch.isPending}
                  className="w-full"
                >
                  {crawlSearch.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Crawling...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Start Crawling
                    </>
                  )}
                </Button>
                {crawlSearch.isError && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span>Failed to crawl search results</span>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Display AI Search URLs */}
      {searchUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search URLs từ A.I</CardTitle>
            <CardDescription>
              Copy và dán các URL này vào phần "Dán URL" để crawl sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {searchUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopySearchUrl(url)}
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleUseSearchUrl(url)}
                    title="Sử dụng URL này"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Dùng URL này
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Display Crawl Results */}
      {productUrls.length > 0 && (
        <CrawlResultsDisplay 
          productUrls={productUrls} 
          projectId={projectId}
          onProductsCreated={onCrawlComplete}
        />
      )}
    </div>
  );
}



