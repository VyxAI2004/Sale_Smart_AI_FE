import { useState } from 'react'
import { useCreateTeamUser, useInviteUserToTeam } from '../hooks'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from '@/hooks/use-translation'
import type { UUID } from 'crypto'

interface AddTeamMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  teamId?: UUID | null
  onSuccess?: () => void
}

interface CreateUserFormData {
  username: string
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  role: 'owner' | 'lead' | 'member'
}

interface InviteUserFormData {
  email: string
  role: 'owner' | 'lead' | 'member'
}

type RoleType = 'owner' | 'lead' | 'member'

export const AddTeamMemberDialog = ({
  isOpen,
  onClose,
  teamId,
  onSuccess,
}: AddTeamMemberDialogProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'create' | 'invite'>('create')

  const [createForm, setCreateForm] = useState<CreateUserFormData>({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    fullName: '',
    role: 'member',
  })
  const [createError, setCreateError] = useState('')

  const [inviteForm, setInviteForm] = useState<InviteUserFormData>({
    email: '',
    role: 'member',
  })
  const [inviteError, setInviteError] = useState('')

  const { mutate: createUser, isPending: isCreating } = useCreateTeamUser()
  const { mutate: inviteUser, isPending: isInviting } = useInviteUserToTeam()

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')

    if (!createForm.username.trim()) {
      setCreateError(t('teams.validation.usernameRequired'))
      return
    }

    if (createForm.username.trim().length < 3) {
      setCreateError(t('teams.validation.usernameMinLength'))
      return
    }

    if (!createForm.email.trim()) {
      setCreateError(t('teams.validation.emailRequired'))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(createForm.email)) {
      setCreateError(t('teams.validation.invalidEmail'))
      return
    }

    if (!createForm.password) {
      setCreateError(t('teams.validation.passwordRequired'))
      return
    }

    if (createForm.password.length < 8) {
      setCreateError(t('teams.validation.passwordMinLength'))
      return
    }

    if (createForm.password !== createForm.passwordConfirm) {
      setCreateError(t('teams.validation.passwordMismatch'))
      return
    }

    if (!createForm.fullName.trim()) {
      setCreateError(t('teams.validation.fullNameRequired'))
      return
    }

    createUser(
      {
        username: createForm.username.trim(),
        email: createForm.email.trim(),
        full_name: createForm.fullName.trim(),
        password: createForm.password,
      },
      {
        onSuccess: () => {
          setCreateForm({
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
            fullName: '',
            role: 'member',
          })
          setCreateError('')
          onClose()
          onSuccess?.()
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            t('teams.errors.createUserFailed')
          setCreateError(message)
        },
      }
    )
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')

    if (!inviteForm.email.trim()) {
      setInviteError(t('teams.validation.emailRequired'))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteForm.email)) {
      setInviteError(t('teams.validation.invalidEmail'))
      return
    }

    if (!teamId) {
      setInviteError(t('teams.errors.teamNotSelected'))
      return
    }

    inviteUser(
      {
        teamId,
        request: {
          email: inviteForm.email.trim(),
          role: inviteForm.role,
        },
      },
      {
        onSuccess: () => {
          setInviteForm({
            email: '',
            role: 'member',
          })
          setInviteError('')
          onClose()
          onSuccess?.()
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            t('teams.errors.inviteFailed')
          setInviteError(message)
        },
      }
    )
  }

  const handleClose = () => {
    if (!isCreating && !isInviting) {
      setCreateForm({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        fullName: '',
        role: 'member',
      })
      setInviteForm({
        email: '',
        role: 'member',
      })
      setCreateError('')
      setInviteError('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{t('teams.addMember')}</DialogTitle>
          <DialogDescription>
            {t('teams.addMemberDescription')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'create' | 'invite')} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='create'>
              {t('teams.createNewUser')}
            </TabsTrigger>
            <TabsTrigger value='invite'>
              {t('teams.inviteExisting')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='create' className='space-y-4'>
            <form onSubmit={handleCreateSubmit} className='space-y-4'>
              {createError && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{createError}</AlertDescription>
                </Alert>
              )}

              <div className='space-y-2'>
                <Label htmlFor='username'>{t('teams.username')} *</Label>
                <Input
                  id='username'
                  placeholder='john_doe'
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  disabled={isCreating}
                  autoFocus
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>{t('teams.email')} *</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  disabled={isCreating}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='fullName'>{t('teams.fullName')} *</Label>
                <Input
                  id='fullName'
                  placeholder='John Doe'
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  disabled={isCreating}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='password'>{t('teams.password')} *</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    disabled={isCreating}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='passwordConfirm'>{t('teams.confirmPassword')} *</Label>
                  <Input
                    id='passwordConfirm'
                    type='password'
                    placeholder='••••••••'
                    value={createForm.passwordConfirm}
                    onChange={(e) => setCreateForm({ ...createForm, passwordConfirm: e.target.value })}
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='create-role'>{t('teams.role')} *</Label>
                <Select value={createForm.role} onValueChange={(v) => setCreateForm({ ...createForm, role: v as RoleType })}>
                  <SelectTrigger id='create-role' disabled={isCreating}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='member'>{t('teams.roles.member')}</SelectItem>
                    <SelectItem value='lead'>{t('teams.roles.lead')}</SelectItem>
                    <SelectItem value='owner'>{t('teams.roles.owner')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className='mt-6'>
                <Button type='button' variant='outline' onClick={handleClose} disabled={isCreating}>
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {t('teams.creating')}
                    </>
                  ) : (
                    t('teams.createUser')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value='invite' className='space-y-4'>
            <form onSubmit={handleInviteSubmit} className='space-y-4'>
              {inviteError && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{inviteError}</AlertDescription>
                </Alert>
              )}

              <div className='space-y-2'>
                <Label htmlFor='invite-email'>{t('teams.email')} *</Label>
                <Input
                  id='invite-email'
                  type='email'
                  placeholder='john@example.com'
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  disabled={isInviting}
                  autoFocus
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='invite-role'>{t('teams.role')} *</Label>
                <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({ ...inviteForm, role: v as RoleType })}>
                  <SelectTrigger id='invite-role' disabled={isInviting}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='member'>{t('teams.roles.member')}</SelectItem>
                    <SelectItem value='lead'>{t('teams.roles.lead')}</SelectItem>
                    <SelectItem value='owner'>{t('teams.roles.owner')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className='mt-6'>
                <Button type='button' variant='outline' onClick={handleClose} disabled={isInviting}>
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={isInviting}>
                  {isInviting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {t('teams.inviting')}
                    </>
                  ) : (
                    t('teams.inviteUser')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
