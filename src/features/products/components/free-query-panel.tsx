'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProductAISearchMutation } from '../hooks/use-product-ai'
import type {
  PlatformEnum,
  ProductSearchResponse,
} from '../types/product-ai.types'

interface FreeQueryPanelProps {
  projectId: string
  onSearching: (isSearching: boolean) => void
  onSearchResults: (results: ProductSearchResponse) => void
}

export function FreeQueryPanel({
  projectId,
  onSearching,
  onSearchResults,
}: FreeQueryPanelProps) {
  const [query, setQuery] = useState('')
  const [maxProducts, setMaxProducts] = useState('10')
  const [platform, setPlatform] = useState<PlatformEnum>('all')

  const aiSearch = useProductAISearchMutation()

  const handleSearch = async () => {
    if (!query.trim()) return

    onSearching(true)
    try {
      const result = await aiSearch.mutateAsync({
        projectId,
        params: {
          limit: parseInt(maxProducts) || 10,
          platform,
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
          placeholder='Ví dụ: laptop dưới 15 triệu, điện thoại gaming tốt...'
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

      {/* Number of Products */}
      <div className='space-y-3'>
        <Label htmlFor='max-products' className='text-sm font-semibold'>
          Số lượng sản phẩm
        </Label>
        <Select value={maxProducts} onValueChange={setMaxProducts}>
          <SelectTrigger id='max-products'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='5'>5 sản phẩm</SelectItem>
            <SelectItem value='10'>10 sản phẩm</SelectItem>
            <SelectItem value='15'>15 sản phẩm</SelectItem>
            <SelectItem value='20'>20 sản phẩm</SelectItem>
            <SelectItem value='30'>30 sản phẩm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform */}
      <div className='space-y-3'>
        <Label htmlFor='platform' className='text-sm font-semibold'>
          Sàn thương mại
        </Label>
        <Select
          value={platform}
          onValueChange={(val) => setPlatform(val as PlatformEnum)}
        >
          <SelectTrigger id='platform'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả sàn</SelectItem>
            <SelectItem value='shopee'>Shopee</SelectItem>
            <SelectItem value='lazada'>Lazada</SelectItem>
            <SelectItem value='tiki'>Tiki</SelectItem>
          </SelectContent>
        </Select>
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

      {aiSearch.isError && (
        <div className='rounded-md bg-red-50 p-3 text-sm text-red-700'>
          Tìm kiếm thất bại. Vui lòng thử lại.
        </div>
      )}
    </div>
  )
}
