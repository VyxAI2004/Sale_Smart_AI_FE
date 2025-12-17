import { useTranslation } from '@/hooks/use-translation'
import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  const { t } = useTranslation()

  return (
    <ContentSection title={t('account.title')} desc={t('account.description')}>
      <AccountForm />
    </ContentSection>
  )
}
