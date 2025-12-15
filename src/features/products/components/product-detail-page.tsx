import { useParams } from '@tanstack/react-router';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ConfigDrawer } from '@/components/config-drawer';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Loader2 } from 'lucide-react';
import { useProduct } from '../hooks/use-products';
import { ProductHeader } from './dashboard/product-header';
import { ProductDetailTabs } from './dashboard/product-detail-tabs';

export function ProductDetailPage() {
  const { productId } = useParams({ from: '/_authenticated/products/$productId/' });
  const { data: product, isLoading, error } = useProduct(productId);

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
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Main>
      </div>
    );
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
          <div className="flex items-center justify-center min-h-[400px] text-center">
            <div>
              <h2 className="text-lg font-semibold mb-2">Failed to load product</h2>
              <p className="text-muted-foreground mb-4">
                {error ? (error as Error).message : 'Product not found'}
              </p>
            </div>
          </div>
        </Main>
      </div>
    );
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
  );
}

