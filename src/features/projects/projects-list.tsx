import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProjectsDialogs } from './components/projects-dialogs'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { ProjectsProvider } from './components/projects-provider'
import { ProjectsTable } from './components/projects-table'
import { mockProjects } from './data/projects'

const route = getRouteApi('/_authenticated/projects/')

export function Projects() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <ProjectsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Manage your projects and track their progress here.
            </p>
          </div>
          <ProjectsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ProjectsTable data={mockProjects} search={search} navigate={navigate} />
        </div>
      </Main>

      <ProjectsDialogs />
    </ProjectsProvider>
  )
}