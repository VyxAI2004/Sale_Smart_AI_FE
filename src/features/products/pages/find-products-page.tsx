import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitcher } from '@/components/language-switcher'
import { FindProductWorkflow } from '../components/find-product-workflow'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/use-translation'
import { Loader2 } from 'lucide-react'
import { useProjectContext } from '@/contexts/project-context'

export function FindProductsPage() {
  const { t } = useTranslation()
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
            <FindProductWorkflow
              projectId={activeProject.id}
              onComplete={() => {
                // Optionally refresh or navigate
                console.log('Find product workflow completed')
              }}
            />
          </div>
        )}
      </Main>
    </>
  )
}
