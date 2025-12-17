import { useParams } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useProduct } from '../hooks/use-products'
import { ProductDetailTabs } from './dashboard/product-detail-tabs'
import { ProductHeader } from './dashboard/product-header'

export function ProductDetailPage() {
  const { productId } = useParams({
    from: '/_authenticated/products/$productId/',
  })
  const { data: product, isLoading, error } = useProduct(productId)

  if (isLoading) {
    return (
      <div>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <ProductHeader product={null} isLoading={true} />
          <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        </Main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='flex min-h-[400px] items-center justify-center text-center'>
            <div>
              <h2 className='mb-2 text-lg font-semibold'>
                Failed to load product
              </h2>
              <p className='text-muted-foreground mb-4'>
                {error ? (error as Error).message : 'Product not found'}
              </p>
            </div>
          </div>
        </Main>
      </div>
    )
  }

  return (
    <div>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <ProductHeader product={product} />

        <ProductDetailTabs
          product={product}
          productId={productId}
          isLoading={isLoading}
        />
      </Main>
    </div>
  )
}
