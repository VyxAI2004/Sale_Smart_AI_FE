import { useTranslation } from '@/hooks/use-translation'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  const { t } = useTranslation()

  return (
    <ContentSection
      title={t('settings.appearance.title')}
      desc={t('settings.appearance.description')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
