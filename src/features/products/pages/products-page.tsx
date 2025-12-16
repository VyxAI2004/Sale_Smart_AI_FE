import { useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ProductsList } from '../components/products-list'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/use-translation'
import { Loader2 } from 'lucide-react'
import { useProjectContext } from '@/contexts/project-context'

export function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { activeProject, isLoading } = useProjectContext()

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitcher />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-muted-foreground">{t('projects.loading')}</span>
              </div>
            </CardContent>
          </Card>
        ) : !activeProject ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-8">
                {t('projects.selectProjectFirst')}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <ProductsList
              projectId={activeProject.id}
              onViewProduct={(productId) => {
                navigate({ to: `/products/${productId}` })
              }}
            />
          </div>
        )}
      </Main>
    </>
  )
}
