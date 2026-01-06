'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ProductSearchResponse } from '../types/product-ai.types'
import { AdvancedFilterPanel } from './advanced-filter-panel.tsx'
import { FilterResultsDisplay } from './filter-results-display.tsx'
import { FreeQueryPanel } from './free-query-panel.tsx'
import { SearchResultsStream } from './search-results-stream.tsx'

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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Tìm kiếm sản phẩm</h2>
        <p className='text-muted-foreground'>
          Tìm kiếm sản phẩm với AI hoặc sử dụng các bộ lọc nâng cao
        </p>
      </div>
      {/* Main Grid */}
      <div className='grid min-h-[calc(100vh-300px)] grid-cols-2 gap-6'>
        {/* Left Column - Input Panel */}
        <div className='space-y-4 overflow-y-auto pr-2'>
          <Card className='sticky top-0'>
            <CardContent className='pt-6'>
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
        {/* Right Column - Results Panel */}
        <div className='space-y-4 overflow-y-auto pl-2'>
          {searchMode === 'free' && searchResults ? (
            <SearchResultsStream
              searchResults={searchResults}
              isLoading={isSearching}
            />
          ) : searchMode === 'advanced' && filterResults ? (
            <FilterResultsDisplay
              items={filterResults.items}
              total={filterResults.total}
            />
          ) : (
            <Card>
              <CardContent className='pt-6'>
                <div className='text-muted-foreground py-12 text-center'>
                  <p>Kết quả sẽ xuất hiện ở đây</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>{' '}
      </div>{' '}
    </div>
  )
}
