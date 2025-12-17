import { useEffect, useState } from 'react'
import type { UserAIModelCreate } from '@/types/user-ai-model.types'
import { toast } from 'sonner'
import { isSuperAdmin } from '@/utils/jwt'
import { useAiModels } from '@/hooks/use-ai-models'
import { usePermissions } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'
import { useUserAiModels } from '@/hooks/use-user-ai-models'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ContentSection } from '../components/content-section'
import { AddUserModelDialog } from './add-user-model-dialog'
import { CreateModelDialog } from './create-model-dialog'
import { ModelsList } from './models-list'
import { UserModelsList } from './user-models-list'

export default function SettingsAIAndModels() {
  const { t } = useTranslation()
  const {
    userModels,
    isLoading,
    fetchUserModels,
    createOrUpdateUserModel,
    deleteUserModel,
  } = useUserAiModels()
  const { models, fetchMyModels, activateModel, deactivateModel, removeModel } =
    useAiModels()
  const {
    hasPermission,
    isLoading: isLoadingPermissions,
    permissions,
  } = usePermissions()
  const isSuperAdminUser = isSuperAdmin()
  const hasManagePermission = hasPermission('manage_ai_models')
  const isAdmin = isSuperAdminUser || hasManagePermission

  // Debug: Log permissions to check
  useEffect(() => {
    if (!isLoadingPermissions) {
      console.log('Permissions:', permissions)
      console.log('Is Super Admin:', isSuperAdminUser)
      console.log('Has manage_ai_models:', hasManagePermission)
      console.log('Is Admin:', isAdmin)
    }
  }, [
    permissions,
    isLoadingPermissions,
    isSuperAdminUser,
    hasManagePermission,
    isAdmin,
  ])
  const [aiEnabled, setAiEnabled] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openCreateModel, setOpenCreateModel] = useState(false)

  useEffect(() => {
    void fetchUserModels()
  }, [fetchUserModels])

  useEffect(() => {
    if (isAdmin && !isLoadingPermissions) {
      void fetchMyModels()
    }
  }, [isAdmin, isLoadingPermissions, fetchMyModels])

  const handleAddModel = async (values: UserAIModelCreate) => {
    try {
      await createOrUpdateUserModel(values)
      toast.success(t('settings.aiModels.aiModelConfigurationAdded'))
    } catch (error) {
      toast.error(t('settings.aiModels.failedToAddAIModelConfiguration'))
      console.error(error)
    }
  }

  const handleUpdateApiKey = async (modelId: string, apiKey: string) => {
    try {
      await createOrUpdateUserModel({
        ai_model_id: modelId,
        api_key: apiKey,
      })
      toast.success(t('settings.aiModels.apiKeyUpdated'))
    } catch (error) {
      toast.error(t('settings.aiModels.failedToUpdateApiKey'))
      console.error(error)
    }
  }

  const handleDeleteModel = async (modelId: string) => {
    if (!confirm(t('settings.aiModels.confirmDelete'))) {
      return
    }
    try {
      await deleteUserModel(modelId)
      toast.success(t('settings.aiModels.aiModelConfigurationDeleted'))
    } catch (error) {
      toast.error(t('settings.aiModels.failedToDeleteAIModelConfiguration'))
      console.error(error)
    }
  }

  return (
    <div className='w-full'>
      <ContentSection
        title={t('settings.aiModels.title')}
        desc={t('settings.aiModels.description')}
      >
        <>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-base font-medium'>
                {t('settings.aiModels.enableAIFeatures')}
              </h3>
              <p className='text-muted-foreground text-sm'>
                {t('settings.aiModels.enableAIFeaturesDescription')}
              </p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>

          <Separator className='my-4' />

          {/* AI Models Management - Super Admin Only */}
          {isAdmin && (
            <>
              <div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-base font-medium'>
                      {t('settings.aiModels.aiModelsManagement')}
                    </h3>
                    <p className='text-muted-foreground mt-1 text-sm'>
                      {t('settings.aiModels.aiModelsManagementDescription')}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='default'
                      size='sm'
                      onClick={() => setOpenCreateModel(true)}
                    >
                      {t('settings.aiModels.createModel')}
                    </Button>
                  </div>
                </div>

                <p className='text-muted-foreground mb-3 text-sm'>
                  {t('settings.aiModels.manageAIModelsDescription')}
                </p>

                <ModelsList
                  models={models}
                  onActivate={activateModel}
                  onDeactivate={deactivateModel}
                  onDelete={removeModel}
                />
                <CreateModelDialog
                  open={openCreateModel}
                  onOpenChange={setOpenCreateModel}
                />
              </div>

              <Separator className='my-6' />
            </>
          )}

          {/* User AI Model Configurations */}
          <div>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-medium'>
                  {t('settings.aiModels.myAIModelConfigurations')}
                </h3>
                {isAdmin && (
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {t('settings.aiModels.superAdminViewAll')}
                  </p>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='default'
                  size='sm'
                  onClick={() => setOpenAdd(true)}
                >
                  {t('settings.aiModels.addApiKey')}
                </Button>
              </div>
            </div>

            <p className='text-muted-foreground mb-3 text-sm'>
              {t('settings.aiModels.configureApiKeysDescription')}
            </p>

            <UserModelsList
              userModels={userModels}
              isLoading={isLoading}
              onUpdate={handleUpdateApiKey}
              onDelete={handleDeleteModel}
            />
            <AddUserModelDialog
              open={openAdd}
              onOpenChange={setOpenAdd}
              onSubmit={handleAddModel}
            />
          </div>
        </>
      </ContentSection>
    </div>
  )
}
