'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProducts } from '../hooks/use-products'

interface AdvancedFilterPanelProps {
  projectId: string
  onSearching: (isSearching: boolean) => void
  onFilterResults: (results: any) => void
}

export function AdvancedFilterPanel({
  projectId,
  onSearching,
  onFilterResults,
}: AdvancedFilterPanelProps) {
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [minRating, setMinRating] = useState<string>('')
  const [minReviews, setMinReviews] = useState<string>('')
  const [minSold, setMinSold] = useState<string>('')
  const [platform, setPlatform] = useState<string>('all')

  const { refetch, isFetching } = useProducts(projectId, {
    min_price: minPrice ? parseFloat(minPrice) : undefined,
    max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    platform: platform !== 'all' ? platform : undefined,
    limit: 1000,
  })

  const handleSearch = async () => {
    onSearching(true)
    try {
      const result = await refetch()
      if (result.data) {
        // Filter results based on rating and review count
        const filtered = result.data.items.filter((product) => {
          if (minRating && (product.average_rating ?? 0) < parseFloat(minRating)) {
            return false
          }
          if (minReviews && (product.review_count ?? 0) < parseInt(minReviews)) {
            return false
          }
          if (minSold && (product.sold_count ?? 0) < parseInt(minSold)) {
            return false
          }
          return true
        })
        onFilterResults({
          ...result.data,
          items: filtered,
          total: filtered.length,
        })
      }
    } finally {
      onSearching(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Price Range */}
      <div className='space-y-3'>
        <Label className='text-sm font-semibold'>Khoảng giá</Label>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <Label htmlFor='min-price' className='text-xs text-muted-foreground'>
              Giá tối thiểu
            </Label>
            <Input
              id='min-price'
              type='number'
              placeholder='0'
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className='mt-1'
            />
          </div>
          <div>
            <Label htmlFor='max-price' className='text-xs text-muted-foreground'>
              Giá tối đa
            </Label>
            <Input
              id='max-price'
              type='number'
              placeholder='999999'
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className='mt-1'
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className='space-y-3'>
        <Label htmlFor='min-rating' className='text-sm font-semibold'>
          Đánh giá tối thiểu
        </Label>
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger id='min-rating'>
            <SelectValue placeholder='Bất kỳ' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='4.5'>4.5+ sao</SelectItem>
            <SelectItem value='4.0'>4.0+ sao</SelectItem>
            <SelectItem value='3.5'>3.5+ sao</SelectItem>
            <SelectItem value='3.0'>3.0+ sao</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Review Count */}
      <div className='space-y-3'>
        <Label htmlFor='min-reviews' className='text-sm font-semibold'>
          Số đánh giá tối thiểu
        </Label>
        <Select value={minReviews} onValueChange={setMinReviews}>
          <SelectTrigger id='min-reviews'>
            <SelectValue placeholder='Bất kỳ' />
          </SelectTrigger>
          <SelectContent>

            <SelectItem value='100'>100+</SelectItem>
            <SelectItem value='500'>500+</SelectItem>
            <SelectItem value='1000'>1000+</SelectItem>
            <SelectItem value='5000'>5000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sold Count */}
      <div className='space-y-3'>
        <Label htmlFor='min-sold' className='text-sm font-semibold'>
          Số lượng bán tối thiểu
        </Label>
        <Select value={minSold} onValueChange={setMinSold}>
          <SelectTrigger id='min-sold'>
            <SelectValue placeholder='Bất kỳ' />
          </SelectTrigger>
          <SelectContent>

            <SelectItem value='100'>100+</SelectItem>
            <SelectItem value='500'>500+</SelectItem>
            <SelectItem value='1000'>1000+</SelectItem>
            <SelectItem value='5000'>5000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform */}
      <div className='space-y-3'>
        <Label htmlFor='platform' className='text-sm font-semibold'>
          Sàn thương mại
        </Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger id='platform'>
            <SelectValue placeholder='Chọn sàn' />
          </SelectTrigger>
          <SelectContent>

            <SelectItem value='shopee'>Shopee</SelectItem>
            <SelectItem value='lazada'>Lazada</SelectItem>
            <SelectItem value='tiki'>Tiki</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={isFetching}
        className='w-full'
        size='lg'
      >
        {isFetching && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        Tìm kiếm
      </Button>
    </div>
  )
}
