import { useTranslation } from '@/hooks/use-translation'
import { ContentSection } from '../components/content-section'
import { NotificationsForm } from './notifications-form'

export function SettingsNotifications() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('settings.notifications.title')}
      desc={t('settings.notifications.description')}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
