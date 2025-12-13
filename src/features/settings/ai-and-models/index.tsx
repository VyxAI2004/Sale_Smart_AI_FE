import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ContentSection } from '../components/content-section'
import { useUserAiModels } from '@/hooks/use-user-ai-models'
import { useAiModels } from '@/hooks/use-ai-models'
import { usePermissions } from '@/hooks/use-permissions'
import { UserModelsList } from './user-models-list'
import { AddUserModelDialog } from './add-user-model-dialog'
import { ModelsList } from './models-list'
import { CreateModelDialog } from './create-model-dialog'
import { isSuperAdmin } from '@/utils/jwt'
import { UserAIModelApi } from '@/apis/user-ai-model.api'
import type { UserAIModelCreate } from '@/types/user-ai-model.types'
import { toast } from 'sonner'

export default function SettingsAIAndModels() {
  const { userModels, isLoading, fetchUserModels, createOrUpdateUserModel, deleteUserModel } = useUserAiModels()
  const { models, fetchMyModels, activateModel, deactivateModel, removeModel, createModel } = useAiModels()
  const { hasPermission, isLoading: isLoadingPermissions, permissions } = usePermissions()
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
  }, [permissions, isLoadingPermissions, isSuperAdminUser, hasManagePermission, isAdmin])
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
      toast.success('AI Model configuration added successfully')
    } catch (error) {
      toast.error('Failed to add AI Model configuration')
      console.error(error)
    }
  }

  const handleUpdateApiKey = async (modelId: string, apiKey: string) => {
    try {
      await createOrUpdateUserModel({
        ai_model_id: modelId,
        api_key: apiKey,
      })
      toast.success('API key updated successfully')
    } catch (error) {
      toast.error('Failed to update API key')
      console.error(error)
    }
  }

  const handleDeleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return
    }
    try {
      await deleteUserModel(modelId)
      toast.success('AI Model configuration deleted successfully')
    } catch (error) {
      toast.error('Failed to delete AI Model configuration')
      console.error(error)
    }
  }

  return (
    <div className='w-full'>
      <ContentSection title='AI & Models' desc='Manage your AI preferences and API keys.'>
        <>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-base font-medium'>Enable AI features</h3>
              <p className='text-sm text-muted-foreground'>Turn off to disable AI features for your account.</p>
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
                    <h3 className='text-base font-medium'>AI Models Management</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Create and manage AI models available in the system
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='secondary' size='sm' onClick={() => setOpenCreateModel(true)}>
                      Create Model
                    </Button>
                  </div>
                </div>

                <p className='text-sm text-muted-foreground mb-3'>
                  Manage AI models that users can configure with their API keys.
                </p>

                <ModelsList
                  models={models}
                  onActivate={activateModel}
                  onDeactivate={deactivateModel}
                  onDelete={removeModel}
                />
                <CreateModelDialog open={openCreateModel} onOpenChange={setOpenCreateModel} />
              </div>

              <Separator className='my-6' />
            </>
          )}

          {/* User AI Model Configurations */}
          <div>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-medium'>My AI Model Configurations</h3>
                {isAdmin && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    Super Admin: You can view and manage all users' API keys
                  </p>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='secondary' size='sm' onClick={() => setOpenAdd(true)}>
                  Add Configuration
                </Button>
              </div>
            </div>

            <p className='text-sm text-muted-foreground mb-3'>
              Configure API keys for AI models. {!isAdmin && 'You can only view your own API keys.'}
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
