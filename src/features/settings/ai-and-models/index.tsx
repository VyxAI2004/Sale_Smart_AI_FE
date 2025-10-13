import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ContentSection } from '../components/content-section'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from '@tanstack/react-router'
import { useAiModels } from '@/hooks/use-ai-models'
import { ModelsList } from './models-list'
import { CreateModelDialog } from './create-model-dialog'

export default function SettingsAIAndModels() {
  const { user } = useAuth()
  const { models, fetchMyModels, activateModel, deactivateModel, removeModel } = useAiModels()
  const navigate = useNavigate()
  const [aiEnabled, setAiEnabled] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)

  useEffect(() => {
    void fetchMyModels()
  }, [fetchMyModels])

  return (
    <div className='w-full'>
      <ContentSection title='AI & Models' desc='Manage your AI preferences and models.'>
        <>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>Enable AI features</h3>
              <p className='text-sm text-muted-foreground'>Turn off to disable AI features for your account.</p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>

          <Separator className='my-4' />

          <div>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Manage Models</h3>
              <div className='flex items-center gap-2'>
                {user?.username?.toLowerCase?.().includes('admin') && (
                  <Button size='sm' variant='outline' onClick={() => navigate({ to: '/settings/ai-and-models' })}>
                    Admin: Manage all
                  </Button>
                )}
                <Button variant='default' size='sm' onClick={() => fetchMyModels()}>
                  Refresh
                </Button>
                <Button variant='secondary' size='sm' onClick={() => setOpenCreate(true)}>
                  Create Model
                </Button>
              </div>
            </div>

            <p className='text-sm text-muted-foreground mb-3'>Create, activate or deactivate your AI models.</p>

            <ModelsList
              models={models}
              onActivate={activateModel}
              onDeactivate={deactivateModel}
              onDelete={removeModel}
            />
            <CreateModelDialog open={openCreate} onOpenChange={setOpenCreate} />
          </div>
        </>
      </ContentSection>
    </div>
  )
}
