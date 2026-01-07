'use client'

import { useState, useCallback } from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ProductSearchResponse } from '../types/product-ai.types'
import { AdvancedFilterPanel } from './advanced-filter-panel.tsx'
import { FilterResultsDisplay } from './filter-results-display.tsx'
import { FreeQueryPanel } from './free-query-panel.tsx'
import { SearchResultsStream } from './search-results-stream.tsx'
import { ReviewConfirmation } from './review-confirmation'
import { ReviewCountForm } from './review-count-form'
import { Phase2Processing } from './phase2-processing'
import { useDiscoveryFlow } from '../hooks/use-discovery-flow'

interface ProductSearchInterfaceProps {
  projectId: string
}

export type SearchMode = 'free' | 'advanced'

export function ProductSearchInterface({
  projectId,
}: ProductSearchInterfaceProps) {
  const [searchMode, setSearchMode] = useState<SearchMode>('free')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] =
    useState<ProductSearchResponse | null>(null)
  const [filterResults, setFilterResults] = useState<any>(null)
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('')

  // Discovery flow hook
  const {
    phase,
    passedProducts,
    rejectedProducts,
    productProgress,
    productResults,
    isStreaming,
    setPhase,
    setPassedProducts,
    setRejectedProducts,
    confirmContinue,
    setReviewCounts,
    startDetailedFlow,
  } = useDiscoveryFlow(projectId)

  // Handle Phase 1 results - extract passed/rejected products
  const handlePhase1Complete = useCallback(() => {
    if (!searchResults) return

    const passed = searchResults.recommended_products?.map((p: any) => ({
      id: p.id || p.product_id || '',
      name: p.name || '',
      price: p.estimated_price || p.price || 0,
      rating: p.rating || null,
      review_count: p.review_count || null,
      platform: p.platform || 'unknown',
      url: p.url || p.urls?.lazada || p.urls?.shopee || p.urls?.tiki,
      reason: 'Đạt tiêu chí tìm kiếm',
    })) || []

    const rejected = searchResults.all_products
      ?.filter((p: any) => !searchResults.recommended_products?.some((r: any) => r.id === p.id))
      .map((p: any) => ({
        id: p.id || p.product_id || '',
        name: p.name || '',
        price: p.price || 0,
        rating: p.rating || null,
        review_count: p.review_count || null,
        platform: p.platform || 'unknown',
        url: p.url || p.urls?.lazada || p.urls?.shopee || p.urls?.tiki,
        reason: 'Không đạt tiêu chí tìm kiếm',
      })) || []

    setPassedProducts(passed)
    setRejectedProducts(rejected)
    setPhase('confirm')
  }, [searchResults, setPassedProducts, setRejectedProducts, setPhase])

  // Render loading state during Phase 1 search
  const renderPhase1Loading = () => {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            {/* Animated Loading Spinner */}
            <div className='flex justify-center'>
              <div className='relative h-12 w-12'>
                <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
              </div>
            </div>

            {/* Search Query Display */}
            {lastSearchQuery && (
              <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30'>
                <p className='text-xs font-medium text-muted-foreground'>Đang tìm kiếm:</p>
                <p className='mt-1 text-sm font-medium text-foreground line-clamp-2'>
                  "{lastSearchQuery}"
                </p>
              </div>
            )}

            {/* Progress Text */}
            <div className='space-y-2 text-center'>
              <p className='text-sm font-medium text-foreground'>
                Đang phân tích sản phẩm...
              </p>
              <p className='text-xs text-muted-foreground'>
                Vui lòng chờ, quá trình này có thể mất vài giây
              </p>
            </div>

            {/* Progress Bar Animation */}
            <div className='h-1 w-full overflow-hidden rounded-full bg-muted'>
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 h-full w-1/3 animate-pulse'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Add "Continue Analysis" button trigger
  const renderPhase1Results = () => {
    if (searchMode === 'free' && searchResults) {
      return (
        <SearchResultsStream
          searchResults={searchResults}
          isLoading={isSearching}
        />
      )
    } else if (searchMode === 'advanced' && filterResults) {
      return (
        <FilterResultsDisplay
          items={filterResults.items}
          total={filterResults.total}
        />
      )
    }
    return null
  }

  // Render phase content
  const renderPhaseContent = () => {
    switch (phase) {
      case 'search':
        // Show loading during search
        if (isSearching) {
          return renderPhase1Loading()
        }
        
        // Show results if available
        if (renderPhase1Results()) {
          return renderPhase1Results()
        }

        // Show empty state
        return (
          <Card>
            <CardContent className='pt-6'>
              <div className='text-muted-foreground py-12 text-center'>
                <Search className='mx-auto mb-4 h-8 w-8 opacity-50' />
                <p>Kết quả sẽ xuất hiện ở đây</p>
              </div>
            </CardContent>
          </Card>
        )

      case 'confirm':
        return (
          <ReviewConfirmation
            passedProducts={passedProducts}
            rejectedProducts={rejectedProducts}
            onContinue={(shouldContinue) => {
              if (shouldContinue) {
                confirmContinue(true)
              } else {
                // Reset search state and go back to search phase
                setSearchResults(null)
                setFilterResults(null)
                setIsSearching(false)
                setPhase('search')
              }
            }}
          />
        )

      case 'review_form':
        return (
          <ReviewCountForm
            products={passedProducts}
            onContinue={(inputs) => {
              setReviewCounts(inputs)
              startDetailedFlow()
            }}
            isLoading={isStreaming}
          />
        )

      case 'processing':
      case 'complete':
        return (
          <Phase2Processing
            products={passedProducts}
            productProgress={productProgress}
            productResults={productResults}
            isProcessing={phase === 'processing'}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className='w-full h-full flex flex-col'>
      {/* Header */}
      <div className='px-6 pt-6 pb-4 border-b'>
        <h2 className='text-2xl font-bold tracking-tight'>Tìm kiếm sản phẩm</h2>
        <p className='text-muted-foreground text-sm'>
          Tìm kiếm sản phẩm với AI hoặc sử dụng các bộ lọc nâng cao
        </p>
      </div>

      {/* Main Grid - 3:7 Layout */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Left Column - Input Panel (3/10) */}
        <div className='w-3/10 overflow-y-auto border-r px-6 py-4'>
          <Card className='sticky top-0 border-0 shadow-none bg-transparent'>
            <CardContent className='p-0'>
              {/* Mode Switcher */}
              <Tabs
                value={searchMode}
                onValueChange={(value) => setSearchMode(value as SearchMode)}
                className='mb-4'
              >
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='free' className='flex items-center gap-2'>
                    <Search className='h-4 w-4' />
                    Truy vấn tự do
                  </TabsTrigger>
                  <TabsTrigger
                    value='advanced'
                    className='flex items-center gap-2'
                  >
                    <Filter className='h-4 w-4' />
                    Bộ lọc nâng cao
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='free' className='mt-4'>
                  <FreeQueryPanel
                    projectId={projectId}
                    onSearching={setIsSearching}
                    onSearchResults={setSearchResults}
                    onQueryChange={setLastSearchQuery}
                  />
                </TabsContent>

                <TabsContent value='advanced' className='mt-4'>
                  <AdvancedFilterPanel
                    projectId={projectId}
                    onSearching={setIsSearching}
                    onFilterResults={setFilterResults}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Results Panel (7/10) */}
        <div className='w-7/10 overflow-y-auto px-6 py-4 flex flex-col'>
          {phase === 'search' && renderPhase1Results() && (
            <>
              <div className='flex-1 overflow-y-auto mb-4'>
                {renderPhaseContent()}
              </div>
              <div className='sticky bottom-0 pt-4 bg-background border-t'>
                <button
                  onClick={handlePhase1Complete}
                  className='w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-100 dark:hover:bg-blue-950/50'
                >
                  ➡️ Tiếp Tục Phân Tích Chi Tiết
                </button>
              </div>
            </>
          )}
          
          {(phase !== 'search' || isSearching || !renderPhase1Results()) && (
            <div className='flex-1 overflow-y-auto'>
              {renderPhaseContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
