import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AnalyticsCard } from '../components/dashboard/analytics-card'
import { ProjectDetailApi } from '../api/project-detail-api'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/use-translation'
import { Loader2 } from 'lucide-react'
import { useProjectContext } from '@/contexts/project-context'
import type { ProjectDetailData } from '../types/project-detail.types'

export function AnalyticsPage() {
  const { t } = useTranslation()
  const { activeProject, isLoading: isLoadingContext } = useProjectContext()
  const [projectDetail, setProjectDetail] = useState<ProjectDetailData | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  useEffect(() => {
    if (!activeProject) {
      setProjectDetail(null)
      return
    }

    const fetchProjectDetail = async () => {
      try {
        setIsLoadingDetail(true)
        const data = await ProjectDetailApi.getProjectDetail(activeProject.id)
        setProjectDetail(data)
      } catch (error) {
        console.error('Failed to fetch project detail:', error)
        setProjectDetail(null)
      } finally {
        setIsLoadingDetail(false)
      }
    }

    fetchProjectDetail()
  }, [activeProject])

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
        {isLoadingContext ? (
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
            <AnalyticsCard
              project={projectDetail}
              isLoading={isLoadingDetail}
              onRefreshAnalytics={async () => {
                if (activeProject) {
                  try {
                    setIsLoadingDetail(true)
                    const data = await ProjectDetailApi.getProjectDetail(activeProject.id)
                    setProjectDetail(data)
                  } catch (error) {
                    console.error('Failed to refresh analytics:', error)
                  } finally {
                    setIsLoadingDetail(false)
                  }
                }
              }}
              onExportReport={() => {
                // TODO: Implement export report
                console.log('Export report')
              }}
            />
          </div>
        )}
      </Main>
    </>
  )
}
