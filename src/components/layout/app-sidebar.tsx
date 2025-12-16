import { useState, useEffect } from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { getSidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { ProjectSwitcher } from './project-switcher'
import i18n from '@/lib/i18n'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const [sidebarData, setSidebarData] = useState(getSidebarData())

  useEffect(() => {
    const updateSidebar = () => {
      setSidebarData(getSidebarData())
    }

    i18n.on('languageChanged', updateSidebar)
    return () => {
      i18n.off('languageChanged', updateSidebar)
    }
  }, [])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <ProjectSwitcher projects={sidebarData.projects} />

        {/* Replace <ProjectSwitcher /> with the following <AppTitle />
         /* if you want to use the normal app title instead of ProjectSwitcher dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
