import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  ProjectDetailsCard,
  BudgetCard,
  ConfigurationCard,
  SidebarCards,
  ProjectPreviewCard,
  ProductImagesCard,
  // AIModelCard,
  // TeamAssignmentCard,
} from './components'
import { useProjectForm } from './hooks/use-project-form'

const AddProjectForm = () => {
  const { t } = useTranslation()
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    handleSaveDraft,
    resetForm,
  } = useProjectForm()

  const handleDiscard = () => {
    if (isSubmitting) return

    // Check if form has unsaved changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(resetForm)

    if (hasChanges) {
      const confirmed = confirm(t('projects.discardConfirm'))
      if (!confirmed) return
    }

    resetForm()
    toast.info(t('projects.formReset'))
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitcher />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('projects.addProjectTitle')}
            </h2>
            <p className='text-muted-foreground'>
              {t('projects.addProjectDescription')}
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <Button
              variant='outline'
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className='px-6'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {t('projects.saving')}
                </>
              ) : (
                t('projects.saveDraft')
              )}
            </Button>
            <Button
              variant='outline'
              className='text-muted-foreground hover:text-foreground px-6'
              onClick={handleDiscard}
              disabled={isSubmitting}
            >
              {t('projects.discard')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='px-6'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {t('projects.publishing')}
                </>
              ) : (
                t('projects.publish')
              )}
            </Button>
          </div>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Left Column - Main Content */}
            <div className='space-y-6 lg:col-span-2'>
              <ProjectDetailsCard
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <ProductImagesCard
                images={formData.product_images || []}
                onImagesChange={(images) =>
                  handleInputChange('product_images', images)
                }
              />

              <BudgetCard
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <ConfigurationCard
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className='space-y-6'>
              {/* Test AI Model Card only */}
              {/* <AIModelCard
                formData={formData}
                onInputChange={handleInputChange}
              /> */}

              {/* Test Team Assignment Card only */}
              {/* <TeamAssignmentCard
                formData={formData}
                onInputChange={handleInputChange}
              /> */}

              <SidebarCards
                formData={formData}
                onInputChange={handleInputChange}
              />

              <ProjectPreviewCard formData={formData} />
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

export default AddProjectForm
