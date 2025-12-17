import { useState } from 'react'
import { Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProducts } from '../hooks/use-products'
import { ProductsTable } from './products-table'
import { ProductsTableSkeleton } from './products-table-skeleton'

interface ProductsListProps {
  projectId: string
  onViewProduct?: (productId: string) => void
}

export function ProductsList({ projectId }: ProductsListProps) {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [skip, setSkip] = useState(0)
  const limit = 20

  const { data, isLoading, error, refetch } = useProducts(projectId, {
    q: search || undefined,
    platform: platform || undefined,
    category: category || undefined,
    skip,
    limit,
  })

  if (!projectId) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-muted-foreground text-center'>
            Project ID is required to load products
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-2 text-center'>
            <div className='text-destructive font-medium'>
              Error loading products
            </div>
            <div className='text-muted-foreground text-sm'>
              {(error as Error).message || 'Unknown error occurred'}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              className='mt-4'
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Sản phẩm</h2>
          <p className='text-muted-foreground'>
            Quản lý và xem sản phẩm trong dự án này
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='relative w-[280px]'>
            <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
            <Input
              placeholder='Tìm kiếm sản phẩm...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSkip(0)
              }}
              className='pl-8'
            />
          </div>
          <Select
            value={platform || 'all'}
            onValueChange={(value) => {
              setPlatform(value === 'all' ? '' : value)
              setSkip(0)
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Nền tảng' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả nền tảng</SelectItem>
              <SelectItem value='shopee'>Shopee</SelectItem>
              <SelectItem value='lazada'>Lazada</SelectItem>
              <SelectItem value='tiki'>Tiki</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={category || 'all'}
            onValueChange={(value) => {
              setCategory(value === 'all' ? '' : value)
              setSkip(0)
            }}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Danh mục' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả danh mục</SelectItem>
              <SelectItem value='electronics'>Điện tử</SelectItem>
              <SelectItem value='fashion'>Thời trang</SelectItem>
              <SelectItem value='home'>Nhà cửa & Đời sống</SelectItem>
              <SelectItem value='beauty'>Làm đẹp</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <Filter className='mr-2 h-4 w-4' />
            Bộ lọc
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='mr-2 h-4 w-4' />
            Xuất
          </Button>
        </div>
      </div>

      {isLoading ? (
        <ProductsTableSkeleton />
      ) : (
        <>
          <ProductsTable products={data?.items || []} projectId={projectId} />
          {data && data.total > limit && (
            <div className='flex items-center justify-between'>
              <div className='text-muted-foreground text-sm'>
                Showing {skip + 1} to {Math.min(skip + limit, data.total)} of{' '}
                {data.total} products
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSkip(Math.max(0, skip - limit))}
                  disabled={skip === 0}
                >
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSkip(skip + limit)}
                  disabled={skip + limit >= data.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
