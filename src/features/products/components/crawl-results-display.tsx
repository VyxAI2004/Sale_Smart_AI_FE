import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  Link as LinkIcon,
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useCreateProduct } from '../hooks/use-products';
import type { ProductCreate } from '../types/product.types';

interface CrawlResultsDisplayProps {
  productUrls: string[];
  projectId: string;
  onUrlClick?: (url: string) => void;
  onProductsCreated?: () => void;
}

// Helper function to extract platform from URL
function extractPlatform(url: string): string {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('lazada')) return 'lazada';
  if (urlLower.includes('shopee')) return 'shopee';
  if (urlLower.includes('tiki')) return 'tiki';
  return 'other';
}

// Helper function to extract product name from URL
function extractProductName(url: string): string {
  try {
    const urlObj = new URL(url);
    // Try to extract from path
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart) {
      // Decode URL and clean up
      const decoded = decodeURIComponent(lastPart);
      // Remove common URL patterns
      return decoded
        .replace(/\.html?$/, '')
        .replace(/[_-]/g, ' ')
        .trim() || 'Product';
    }
  } catch {
    // If URL parsing fails, use a default name
  }
  return 'Product';
}

export function CrawlResultsDisplay({ 
  productUrls, 
  projectId,
  onUrlClick,
  onProductsCreated 
}: CrawlResultsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<Set<number>>(new Set());
  const createProduct = useCreateProduct();
  const [isCreating, setIsCreating] = useState(false);

  const handleCopyUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      toast.success('URL copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onUrlClick) {
      onUrlClick(url);
    }
  };

  const handleToggleSelect = (index: number) => {
    const newSelected = new Set(selectedUrls);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedUrls(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUrls.size === productUrls.length) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(productUrls.map((_, index) => index)));
    }
  };

  const handleCreateProducts = async () => {
    if (selectedUrls.size === 0) {
      toast.error('Please select at least one URL to create products');
      return;
    }

    setIsCreating(true);
    const selectedIndices = Array.from(selectedUrls);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Create products sequentially to avoid overwhelming the API
      for (const index of selectedIndices) {
        const url = productUrls[index];
        try {
          const platform = extractPlatform(url);
          const name = extractProductName(url);
          
          const payload: ProductCreate = {
            project_id: projectId,
            name: name,
            url: url,
            platform: platform,
            current_price: 0,
          };

          await createProduct.mutateAsync(payload);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to create product for URL ${url}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} product${successCount > 1 ? 's' : ''}`);
        // Clear selection after successful creation
        setSelectedUrls(new Set());
        if (onProductsCreated) {
          onProductsCreated();
        }
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to create ${errorCount} product${errorCount > 1 ? 's' : ''}`);
      }
    } catch (error) {
      toast.error('An error occurred while creating products');
    } finally {
      setIsCreating(false);
    }
  };

  if (productUrls.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Crawl Results</CardTitle>
            <Badge variant="secondary" className="ml-2">
              {productUrls.length} {productUrls.length === 1 ? 'URL' : 'URLs'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          Product URLs found from the search crawl. Select URLs to create products.
        </CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedUrls.size === productUrls.length && productUrls.length > 0}
                onCheckedChange={handleSelectAll}
                id="select-all"
              />
              <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select All ({selectedUrls.size}/{productUrls.length})
              </Label>
            </div>
            {selectedUrls.size > 0 && (
              <Button
                onClick={handleCreateProducts}
                disabled={isCreating}
                size="sm"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create {selectedUrls.size} Product{selectedUrls.size > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            )}
          </div>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-2">
              {productUrls.map((url, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${
                    selectedUrls.has(index)
                      ? 'bg-accent border-primary'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <Checkbox
                    checked={selectedUrls.has(index)}
                    onCheckedChange={() => handleToggleSelect(index)}
                    id={`url-${index}`}
                  />
                  <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm text-primary hover:underline truncate"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenUrl(url);
                    }}
                  >
                    {url}
                  </a>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleCopyUrl(url, index)}
                      title="Copy URL"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleOpenUrl(url)}
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Total: {productUrls.length} product URLs</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const allUrls = productUrls.join('\n');
                navigator.clipboard.writeText(allUrls);
                toast.success('All URLs copied to clipboard');
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy All URLs
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

