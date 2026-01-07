import { useState } from 'react'
import type { UUID } from 'crypto'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useDerivedState } from '@/hooks/use-derived-state'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search as SearchComponent } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  TeamCard,
  TeamDetailDialog,
  AddTeamMemberDialog,
  TeamCreateDialog,
} from '../components'
import { useTeams, useDeleteTeam } from '../index'
import type { ITeam } from '../types'

export function TeamsPage() {
  const { t } = useTranslation()
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: teams = [],
    isLoading: isLoadingTeams,
    refetch,
  } = useTeams(0, 100)
  const { mutate: deleteTeam } = useDeleteTeam()

  // ✅ Derived state - always in sync with teams array
  const { setSelectedId: setSelectedTeamId, selected: selectedTeam } =
    useDerivedState(teams, 'id')

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTeam = (teamId: string) => {
    return new Promise<void>((resolve, reject) => {
      deleteTeam(teamId as UUID, {
        onSuccess: () => {
          toast.success(t('teams.deleteSuccess'))
          refetch()
          resolve()
        },
        onError: () => {
          toast.error(t('teams.deleteError'))
          reject(new Error('Delete failed'))
        },
      })
    })
  }

  const handleShowDetail = (team: ITeam) => {
    setSelectedTeamId(team.id)
    setShowDetailDialog(true)
  }

  const handleAddMember = (team: ITeam) => {
    setSelectedTeamId(team.id)
    setShowAddMemberDialog(true)
  }

  return (
    <>
      <Header>
        <SearchComponent />
        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitcher />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        {/* Header */}
        <div className='flex items-center justify-between space-y-3 '>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('teams.title')}
            </h2>
            <p className='text-muted-foreground'>{t('teams.description')}</p>
          </div>
          <Button
            onClick={() => setShowCreateTeamDialog(true)}
            size='sm'
          >
            <Plus className='mr-2 h-4 w-4' />
            {t('teams.createTeam')}
          </Button>
        </div>

        {/* Search Bar */}
        <div className='my-4'>
          <Input
            placeholder={t('teams.searchTeams')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='h-9 w-40 lg:w-[250px]'
          />
        </div>

        {/* Teams Grid */}
          <div className='w-full overflow-y-auto p-1'>
          {isLoadingTeams ? (
            <div className='flex items-center justify-center py-12'>
              <p className='text-muted-foreground'>{t('common.loading')}</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className='rounded-lg border border-dashed p-12 text-center'>
              <p className='text-muted-foreground'>
                {searchTerm
                  ? t('teams.content.noTeamsFound')
                  : t('teams.content.noTeamsYet')}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowCreateTeamDialog(true)}
                  className='mt-4'
                >
                  {t('teams.createTeam')}
                </Button>
              )}
            </div>
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filteredTeams.map((team: ITeam) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onDetail={() => handleShowDetail(team)}
                  onAddMember={() => handleAddMember(team)}
                  onDelete={handleDeleteTeam}
                />
              ))}
            </div>
          )}
        </div>
      </Main>

      {/* Dialogs */}
      <TeamCreateDialog
        isOpen={showCreateTeamDialog}
        onClose={() => setShowCreateTeamDialog(false)}
        onSuccess={() => {
          setShowCreateTeamDialog(false)
          toast.success(t('teams.createSuccess'))
          refetch()
        }}
      />

      <AddTeamMemberDialog
        isOpen={showAddMemberDialog}
        onClose={() => setShowAddMemberDialog(false)}
        teamId={selectedTeam?.id as UUID | null}
        onSuccess={() => {
          setShowAddMemberDialog(false)
          toast.success(t('teams.memberAdded'))
          refetch()
        }}
      />

      <TeamDetailDialog
        team={selectedTeam}
        isOpen={showDetailDialog}
        onOpenChange={(open) => {
          setShowDetailDialog(open)
          if (!open) setSelectedTeamId(null)
        }}
        onAddMember={() => {
          if (selectedTeam) {
            handleAddMember(selectedTeam)
          }
        }}
      />
    </>
  )
}
