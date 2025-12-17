import { useTranslation } from '@/hooks/use-translation'
import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'

export function SettingsDisplay() {
  const { t } = useTranslation()

  return (
    <ContentSection
      title={t('settings.display.title')}
      desc={t('settings.display.description')}
    >
      <DisplayForm />
    </ContentSection>
  )
}
