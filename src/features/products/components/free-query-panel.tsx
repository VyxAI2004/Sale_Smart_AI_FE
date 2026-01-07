'use client'

import { useState } from 'react'
import { Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProductAISearchMutation } from '../hooks/use-product-ai'
import type { ProductSearchResponse } from '../types/product-ai.types'

interface FreeQueryPanelProps {
  projectId: string
  onSearching: (isSearching: boolean) => void
  onSearchResults: (results: ProductSearchResponse) => void
  onQueryChange?: (query: string) => void
}

export function FreeQueryPanel({
  projectId,
  onSearching,
  onSearchResults,
  onQueryChange,
}: FreeQueryPanelProps) {
  const [query, setQuery] = useState('')
  const [copiedExample, setCopiedExample] = useState<number | null>(null)

  const aiSearch = useProductAISearchMutation()

  const examples = [
    'Tìm cho tôi 5 sản phẩm tương tự với dự án, yêu cầu có trên 100 review, rating trên 4.0 trên sàn Tiki',
    'Tìm 3 sản phẩm rating từ 4.5 trở lên, trên Lazada',
    'Tìm 10 sản phẩm ít nhất 200 review, rating 4.2 trở lên, chỉ tìm trên Tiki',
    'Tìm sản phẩm cạnh tranh có số review từ 50-500, rating từ 3.5-5.0 trên Lazada',
  ]

  const handleCopyExample = (index: number) => {
    const example = examples[index]
    setQuery(example)
    setCopiedExample(index)
    setTimeout(() => setCopiedExample(null), 2000)
    if (onQueryChange) {
      onQueryChange(example)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    // Notify parent of search query
    if (onQueryChange) {
      onQueryChange(query)
    }

    onSearching(true)
    try {
      const result = await aiSearch.mutateAsync({
        projectId,
        params: {
          limit: 10,
          platform: 'all',
        },
      })
      onSearchResults(result)
    } finally {
      onSearching(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Query Input */}
      <div className='space-y-3'>
        <Label htmlFor='query' className='text-sm font-semibold'>
          Bạn đang tìm kiếm gì?
        </Label>
        <Input
          id='query'
          placeholder='Nhập yêu cầu tìm kiếm của bạn...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearch()
            }
          }}
          className='min-h-12'
        />
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={!query.trim() || aiSearch.isPending}
        className='w-full'
        size='lg'
      >
        {aiSearch.isPending && (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        )}
        Tìm kiếm
      </Button>

      {/* Example Cases */}
      <div className='space-y-3'>
        <div className='text-xs font-semibold text-muted-foreground uppercase'>
          Ví dụ câu truy vấn
        </div>
        <div className='space-y-2'>
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleCopyExample(index)}
              className='w-full text-left flex items-start gap-3 p-3 rounded-lg border border-dashed hover:bg-accent transition-colors group'
            >
              <span className='text-xs font-medium text-muted-foreground mt-0.5 flex-shrink-0'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className='text-xs text-muted-foreground group-hover:text-foreground flex-1 line-clamp-2'>
                {example}
              </span>
              {copiedExample === index ? (
                <Check className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
              ) : (
                <Copy className='h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0 mt-0.5' />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className='space-y-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'>
        <p className='text-xs font-semibold text-blue-900 dark:text-blue-100'>
          Gợi ý tìm kiếm
        </p>
        <ul className='text-xs text-blue-800 dark:text-blue-200 space-y-1'>
          <li>• <strong>Số sản phẩm:</strong> Nêu rõ "5 sản phẩm", "10 sản phẩm", etc.</li>
          <li>• <strong>Giá:</strong> "dưới 15 triệu", "từ 10-20 triệu"</li>
          <li>• <strong>Rating:</strong> "rating từ 4.0 trở lên", "rating 4.5+"</li>
          <li>• <strong>Số review:</strong> "trên 100 review", "từ 50-500 review"</li>
          <li>• <strong>Sàn:</strong> Tiki, Lazada (Shopee & Amazon chưa hỗ trợ)</li>
          <li>• <strong>Ví dụ:</strong> "Tìm 5 sản phẩm laptop, rating 4.0+, 100+ review, sàn Tiki"</li>
        </ul>
      </div>

      {aiSearch.isError && (
        <div className='rounded-md bg-red-50 p-3 text-sm text-red-700'>
          Tìm kiếm thất bại. Vui lòng thử lại.
        </div>
      )}
    </div>
  )
}

