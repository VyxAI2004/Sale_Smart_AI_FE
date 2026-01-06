import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  TeamInviteDialog,
} from '../components'

export function TeamDetailPage() {
  const navigate = useNavigate()
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  // TODO: Fetch team details using teamId
  // This will be connected once useTeamDetails hook is created

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
        <div className='flex gap-4 mb-6'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate({ to: '/teams' })}
            className='gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Teams
          </Button>
        </div>

        <Card>
          <CardContent className='pt-6'>
            <h2 className='text-2xl font-bold mb-4'>Team Details</h2>
            <p className='text-muted-foreground'>Team information will load here...</p>
          </CardContent>
        </Card>

        <div className='mt-6 space-y-4'>
          <Button
            onClick={() => setIsInviteDialogOpen(true)}
            className='w-full'
          >
            Invite Member
          </Button>
        </div>

        <TeamInviteDialog
          isOpen={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
          team={null}
        />
      </Main>
    </>
  )
}
