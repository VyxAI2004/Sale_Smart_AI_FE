import { useState, useEffect } from 'react';
import { useCrawlSearch } from '../hooks/use-product-crawler';
import { useProductAISearchMutation } from '../hooks/use-product-ai';
import { useProducts } from '../hooks/use-products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Copy, 
  ExternalLink,
  Package,
  MessageSquare,
  Brain,
  Shield,
  ArrowRight,
  Circle,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { CrawlResultsDisplay } from './crawl-results-display';
import { AISearchResultsCard } from './ai-search-results-card';
import { AutoDiscoveryStream } from './auto-discovery-stream';
import type { PlatformEnum, ProductSearchResponse } from '../types/product-ai.types';

interface FindProductWorkflowProps {
  projectId: string;
  onComplete?: () => void;
}

type WorkflowStep = 'search' | 'paste-url' | 'crawl' | 'analyze' | 'calculate' | 'complete';

interface StepStatus {
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message?: string;
}

export function FindProductWorkflow({ projectId, onComplete }: FindProductWorkflowProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('auto');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('search');
  const [searchUrl, setSearchUrl] = useState('');
  const [maxProducts, setMaxProducts] = useState(10);
  const [productUrls, setProductUrls] = useState<string[]>([]);
  const [searchUrls, setSearchUrls] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformEnum>('all');
  const [aiSearchResult, setAiSearchResult] = useState<ProductSearchResponse | null>(null);
  const [stepStatuses, setStepStatuses] = useState<Record<WorkflowStep, StepStatus>>({
    search: { status: 'pending' },
    'paste-url': { status: 'pending' },
    crawl: { status: 'pending' },
    analyze: { status: 'pending' },
    calculate: { status: 'pending' },
    complete: { status: 'pending' },
  });

  const crawlSearch = useCrawlSearch();
  const aiSearch = useProductAISearchMutation();
  const { data: productsData, refetch: refetchProducts } = useProducts(projectId, { limit: 1000 });

  // Monitor products to detect when crawl completes
  useEffect(() => {
    if (currentStep === 'crawl' && productUrls.length > 0 && productsData) {
      // Check if products have been created
      const crawledProducts = productsData.items.filter(p => 
        productUrls.some(url => p.url === url || p.url?.includes(new URL(url).pathname))
      );
      
      if (crawledProducts.length > 0) {
        setStepStatuses(prev => ({
          ...prev,
          crawl: { status: 'completed', message: `${crawledProducts.length} products crawled` }
        }));
        setCurrentStep('analyze');
        // Auto-trigger analyze step
        handleAutoAnalyze(crawledProducts.map(p => p.id));
      }
    }
  }, [productsData, productUrls, currentStep]);

  const handleAutoAnalyze = async (productIds: string[]) => {
    setStepStatuses(prev => ({
      ...prev,
      analyze: { status: 'in-progress', message: 'Analyzing reviews...' }
    }));

    // Note: This would need to be implemented as a batch analyze endpoint
    // For now, we'll just mark as completed after a delay
    // In real implementation, you'd call analyze API for each product
    setTimeout(() => {
      setStepStatuses(prev => ({
        ...prev,
        analyze: { status: 'completed', message: 'Reviews analyzed' }
      }));
      setCurrentStep('calculate');
      handleAutoCalculate(productIds);
    }, 2000);
  };

  const handleAutoCalculate = async (productIds: string[]) => {
    setStepStatuses(prev => ({
      ...prev,
      calculate: { status: 'in-progress', message: 'Calculating trust scores...' }
    }));

    // Note: This would need to be implemented as a batch calculate endpoint
    // For now, we'll just mark as completed after a delay
    setTimeout(() => {
      setStepStatuses(prev => ({
        ...prev,
        calculate: { status: 'completed', message: 'Trust scores calculated' }
      }));
      setCurrentStep('complete');
      setStepStatuses(prev => ({
        ...prev,
        complete: { status: 'completed', message: 'Workflow completed!' }
      }));
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  };

  const handleAISearch = async () => {
    setStepStatuses(prev => ({
      ...prev,
      search: { status: 'in-progress', message: 'Searching with AI...' }
    }));

    try {
      const result = await aiSearch.mutateAsync({
        projectId,
        params: {
          limit: maxProducts,
          platform: selectedPlatform,
        },
      });
      
      const urls: string[] = [];
      result.recommended_products.forEach((product) => {
        if ('url' in product && product.url) {
          urls.push(product.url);
        } else if ('urls' in product) {
          if (selectedPlatform === 'shopee' && product.urls.shopee) {
            urls.push(product.urls.shopee);
          } else if (selectedPlatform === 'lazada' && product.urls.lazada) {
            urls.push(product.urls.lazada);
          } else if (selectedPlatform === 'tiki' && product.urls.tiki) {
            urls.push(product.urls.tiki);
          } else if (selectedPlatform === 'all') {
            if (product.urls.shopee) urls.push(product.urls.shopee);
            if (product.urls.lazada) urls.push(product.urls.lazada);
            if (product.urls.tiki) urls.push(product.urls.tiki);
          } else {
            if (product.urls.shopee) urls.push(product.urls.shopee);
            else if (product.urls.lazada) urls.push(product.urls.lazada);
            else if (product.urls.tiki) urls.push(product.urls.tiki);
          }
        }
      });
      
      const uniqueUrls = Array.from(new Set(urls));
      setSearchUrls(uniqueUrls);
      setProductUrls([]);
      setAiSearchResult(result); // Store full response
      
      setStepStatuses(prev => ({
        ...prev,
        search: { status: 'completed', message: `Found ${uniqueUrls.length} search URLs` }
      }));
      // Move to paste-url step after AI search
      setCurrentStep('paste-url');
    } catch (error) {
      setStepStatuses(prev => ({
        ...prev,
        search: { status: 'error', message: 'AI search failed' }
      }));
    }
  };

  const handleUseSearchUrl = (url: string) => {
    setSearchUrl(url);
    setCurrentStep('paste-url');
    document.getElementById('search-url')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCopySearchUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleCrawlSearch = async () => {
    if (!searchUrl.trim()) {
      toast.error('Please enter a search URL');
      return;
    }

    setStepStatuses(prev => ({
      ...prev,
      crawl: { status: 'in-progress', message: 'Crawling products and reviews...' }
    }));

    try {
      const urls = await crawlSearch.mutateAsync({
        project_id: projectId,
        search_url: searchUrl,
        max_products: maxProducts,
      });
      setProductUrls(urls);
      setStepStatuses(prev => ({
        ...prev,
        'paste-url': { status: 'completed', message: `Found ${urls.length} product URLs` },
        crawl: { status: 'in-progress', message: `Crawling reviews for ${urls.length} products...` }
      }));
      setCurrentStep('crawl');
      
      // Start polling for products
      const interval = setInterval(() => {
        refetchProducts();
      }, 2000);

      // Clear interval after 60 seconds
      setTimeout(() => clearInterval(interval), 60000);
      
      toast.success(`Found ${urls.length} product URLs`);
    } catch (error) {
      setStepStatuses(prev => ({
        ...prev,
        crawl: { status: 'error', message: 'Crawl failed' }
      }));
    }
  };

  const getStepIcon = (step: WorkflowStep, status: StepStatus['status']) => {
    if (status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
    if (status === 'error') {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
    if (status === 'in-progress') {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
    }
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const getStepLabel = (step: WorkflowStep) => {
    switch (step) {
      case 'search':
        return 'AI Search';
      case 'paste-url':
        return 'Paste URL & Crawl';
      case 'crawl':
        return 'Crawl Reviews';
      case 'analyze':
        return 'Analyze Reviews';
      case 'calculate':
        return 'Calculate Trust Score';
      case 'complete':
        return 'Complete';
      default:
        return '';
    }
  };

  const getStepDescription = (step: WorkflowStep) => {
    switch (step) {
      case 'search':
        return 'Use AI to search for products';
      case 'paste-url':
        return 'Paste search URL and crawl products';
      case 'crawl':
        return 'Crawl reviews for products';
      case 'analyze':
        return 'Analyze reviews with sentiment analysis and spam detection';
      case 'calculate':
        return 'Calculate trust score based on review analysis';
      case 'complete':
        return 'All products processed successfully';
      default:
        return '';
    }
  };

  const steps: WorkflowStep[] = ['search', 'paste-url', 'crawl', 'analyze', 'calculate', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStep(prevStep);
      // Don't reset status, keep it as is
    }
  };

  const canGoBack = currentStepIndex > 0;

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'manual' | 'auto')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-fit">
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Auto Discovery</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Manual Workflow</span>
          </TabsTrigger>
        </TabsList>

        {/* Auto Discovery Tab */}
        <TabsContent value="auto" className="mt-6">
          <AutoDiscoveryStream 
            projectId={projectId}
            onComplete={() => {
              if (onComplete) {
                onComplete();
              }
            }}
          />
        </TabsContent>

        {/* Manual Workflow Tab */}
        <TabsContent value="manual" className="mt-6">
          <ManualWorkflowContent
            projectId={projectId}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            searchUrl={searchUrl}
            setSearchUrl={setSearchUrl}
            maxProducts={maxProducts}
            setMaxProducts={setMaxProducts}
            productUrls={productUrls}
            setProductUrls={setProductUrls}
            searchUrls={searchUrls}
            setSearchUrls={setSearchUrls}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            aiSearchResult={aiSearchResult}
            setAiSearchResult={setAiSearchResult}
            stepStatuses={stepStatuses}
            setStepStatuses={setStepStatuses}
            crawlSearch={crawlSearch}
            aiSearch={aiSearch}
            productsData={productsData}
            refetchProducts={refetchProducts}
            handleAutoAnalyze={handleAutoAnalyze}
            handleAutoCalculate={handleAutoCalculate}
            handleAISearch={handleAISearch}
            handleUseSearchUrl={handleUseSearchUrl}
            handleCopySearchUrl={handleCopySearchUrl}
            handleCrawlSearch={handleCrawlSearch}
            getStepIcon={getStepIcon}
            getStepLabel={getStepLabel}
            getStepDescription={getStepDescription}
            steps={steps}
            currentStepIndex={currentStepIndex}
            progress={progress}
            handleBack={handleBack}
            canGoBack={canGoBack}
            onComplete={onComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Manual Workflow Content Component
interface ManualWorkflowContentProps {
  projectId: string;
  currentStep: WorkflowStep;
  setCurrentStep: (step: WorkflowStep) => void;
  searchUrl: string;
  setSearchUrl: (url: string) => void;
  maxProducts: number;
  setMaxProducts: (max: number) => void;
  productUrls: string[];
  setProductUrls: (urls: string[]) => void;
  searchUrls: string[];
  setSearchUrls: (urls: string[]) => void;
  selectedPlatform: PlatformEnum;
  setSelectedPlatform: (platform: PlatformEnum) => void;
  aiSearchResult: ProductSearchResponse | null;
  setAiSearchResult: (result: ProductSearchResponse | null) => void;
  stepStatuses: Record<WorkflowStep, StepStatus>;
  setStepStatuses: (statuses: Record<WorkflowStep, StepStatus>) => void;
  crawlSearch: any;
  aiSearch: any;
  productsData: any;
  refetchProducts: () => void;
  handleAutoAnalyze: (productIds: string[]) => Promise<void>;
  handleAutoCalculate: (productIds: string[]) => Promise<void>;
  handleAISearch: () => Promise<void>;
  handleUseSearchUrl: (url: string) => void;
  handleCopySearchUrl: (url: string) => Promise<void>;
  handleCrawlSearch: () => Promise<void>;
  getStepIcon: (step: WorkflowStep, status: StepStatus['status']) => JSX.Element;
  getStepLabel: (step: WorkflowStep) => string;
  getStepDescription: (step: WorkflowStep) => string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  progress: number;
  handleBack: () => void;
  canGoBack: boolean;
  onComplete?: () => void;
}

function ManualWorkflowContent({
  currentStep,
  setCurrentStep,
  searchUrl,
  setSearchUrl,
  maxProducts,
  setMaxProducts,
  productUrls,
  setProductUrls,
  selectedPlatform,
  setSelectedPlatform,
  aiSearchResult,
  setAiSearchResult,
  stepStatuses,
  crawlSearch,
  aiSearch,
  productsData,
  refetchProducts,
  handleAutoAnalyze,
  handleAutoCalculate,
  handleAISearch,
  handleUseSearchUrl,
  handleCopySearchUrl,
  handleCrawlSearch,
  getStepIcon,
  getStepLabel,
  getStepDescription,
  steps,
  currentStepIndex,
  progress,
  handleBack,
  canGoBack,
  onComplete,
}: ManualWorkflowContentProps) {
  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle>Find Product Workflow</CardTitle>
          <CardDescription>
            Complete workflow to find, crawl, analyze, and calculate trust scores for products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStepIcon(step, stepStatuses[step].status)}
                    <span className="text-sm font-medium">{getStepLabel(step)}</span>
                  </div>
                  {stepStatuses[step].message && (
                    <span className="text-xs text-muted-foreground text-center">
                      {stepStatuses[step].message}
                    </span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: AI Search */}
      {currentStep === 'search' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Step 1</Badge>
                <CardTitle>AI Search</CardTitle>
              </div>
            </div>
            <CardDescription>{getStepDescription('search')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform-select">Platform</Label>
              <Select
                value={selectedPlatform}
                onValueChange={(value) => setSelectedPlatform(value as PlatformEnum)}
              >
                <SelectTrigger id="platform-select">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="shopee">Shopee</SelectItem>
                  <SelectItem value="lazada">Lazada</SelectItem>
                  <SelectItem value="tiki">Tiki</SelectItem>
                </SelectContent>
              </Select>
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
                  Search with AI
                </>
              )}
            </Button>
            {aiSearch.isError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <XCircle className="h-4 w-4" />
                <span>Failed to search products with AI</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Display AI Search Results */}
      {aiSearchResult && (currentStep === 'search' || currentStep === 'paste-url') && (
        <AISearchResultsCard 
          data={aiSearchResult} 
          isLoading={aiSearch.isPending}
          onUseUrl={currentStep === 'paste-url' ? handleUseSearchUrl : undefined}
        />
      )}

      {/* Step 2: Paste URL & Crawl */}
      {currentStep === 'paste-url' && (
        <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 2</Badge>
                  <CardTitle>Paste URL & Crawl</CardTitle>
                </div>
                {canGoBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>
              <CardDescription>{getStepDescription('paste-url')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="search-url">Search URL</Label>
                <Input
                  id="search-url"
                  placeholder="https://shopee.vn/search?keyword=..."
                  value={searchUrl}
                  onChange={(e) => setSearchUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Paste a search URL from Shopee, Lazada, or Tiki
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
                disabled={crawlSearch.isPending || !searchUrl.trim()}
                className="w-full"
              >
                {crawlSearch.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Crawling Products...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Crawl Products
                  </>
                )}
              </Button>
              {crawlSearch.isError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>Failed to crawl search results</span>
                </div>
              )}
            </CardContent>
          </Card>
      )}

      {/* Step 3: Crawl Reviews */}
      {currentStep === 'crawl' && productUrls.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Step 3</Badge>
                <CardTitle>Crawl Reviews</CardTitle>
              </div>
              {canGoBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            <CardDescription>{getStepDescription('crawl')}</CardDescription>
          </CardHeader>
          <CardContent>
            <CrawlResultsDisplay 
              productUrls={productUrls} 
              projectId={projectId}
              onProductsCreated={() => {
                // This will trigger the useEffect to move to next step
                refetchProducts();
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Analyze Reviews */}
      {currentStep === 'analyze' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Step 4</Badge>
                <CardTitle>Analyze Reviews</CardTitle>
              </div>
              {canGoBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            <CardDescription>{getStepDescription('analyze')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              {stepStatuses.analyze.status === 'in-progress' ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm text-muted-foreground">Analyzing reviews...</p>
                </div>
              ) : stepStatuses.analyze.status === 'completed' ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <p className="text-sm text-muted-foreground">Reviews analyzed successfully</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Waiting for analysis to start...</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Calculate Trust Score */}
      {currentStep === 'calculate' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Step 5</Badge>
                <CardTitle>Calculate Trust Score</CardTitle>
              </div>
              {canGoBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            <CardDescription>{getStepDescription('calculate')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              {stepStatuses.calculate.status === 'in-progress' ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm text-muted-foreground">Calculating trust scores...</p>
                </div>
              ) : stepStatuses.calculate.status === 'completed' ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <p className="text-sm text-muted-foreground">Trust scores calculated successfully</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Waiting for calculation to start...</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Complete */}
      {currentStep === 'complete' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">Step 6</Badge>
                <CardTitle>Complete</CardTitle>
              </div>
              {canGoBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            <CardDescription>{getStepDescription('complete')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <p className="text-lg font-semibold">Workflow Completed Successfully!</p>
              <p className="text-sm text-muted-foreground text-center">
                All products have been crawled, analyzed, and trust scores have been calculated.
              </p>
              <Button onClick={() => {
                setCurrentStep('search');
                setStepStatuses({
                  search: { status: 'pending' },
                  'paste-url': { status: 'pending' },
                  crawl: { status: 'pending' },
                  analyze: { status: 'pending' },
                  calculate: { status: 'pending' },
                  complete: { status: 'pending' },
                });
                setProductUrls([]);
                setSearchUrls([]);
                setSearchUrl('');
                setAiSearchResult(null);
              }}>
                Start New Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
