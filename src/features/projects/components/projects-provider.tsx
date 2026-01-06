import React from 'react'
import { useDerivedState } from '@/hooks/use-derived-state'
import useDialogState from '@/hooks/use-dialog-state'
import { type ProjectApiResponse } from '../api/project-api'

type ProjectsDialogType = 'add' | 'edit' | 'delete' | 'archive'

type ProjectsContextType = {
  open: ProjectsDialogType | null
  setOpen: (str: ProjectsDialogType | null) => void
  currentRowId: string | null
  setCurrentRowId: (id: string | null) => void
  setCurrentRow: (row: ProjectApiResponse | null) => void
  currentRow: ProjectApiResponse | null
  onRefresh?: () => Promise<void>
}

const ProjectsContext = React.createContext<ProjectsContextType | null>(null)

/**
 * ProjectsProvider - Context provider for projects feature
 *
 * Uses derived state pattern for currentRow to avoid out-of-sync bugs.
 * Only stores currentRowId, derives currentRow from projects array.
 */
export function ProjectsProvider({
  children,
  projects = [],
  onRefresh,
}: {
  children: React.ReactNode
  projects?: ProjectApiResponse[]
  onRefresh?: () => Promise<void>
}) {
  const [open, setOpen] = useDialogState<ProjectsDialogType>(null)

  const { selected: currentRow, setSelectedId: setCurrentRowId } =
    useDerivedState(projects, 'id')
  const setCurrentRow = (row: ProjectApiResponse | null) =>
    setCurrentRowId(row?.id ?? null)

  return (
    <ProjectsContext.Provider
      value={{
        open,
        setOpen,
        currentRowId: currentRow?.id ?? null,
        setCurrentRowId,
        setCurrentRow,
        currentRow,
        onRefresh,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => {
  const projectsContext = React.useContext(ProjectsContext)

  if (!projectsContext) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }

  return projectsContext
}
