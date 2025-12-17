import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type ProjectApiResponse } from '../api/project-api'

type ProjectsDialogType = 'add' | 'edit' | 'delete' | 'archive'

type ProjectsContextType = {
  open: ProjectsDialogType | null
  setOpen: (str: ProjectsDialogType | null) => void
  currentRow: ProjectApiResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ProjectApiResponse | null>>
}

const ProjectsContext = React.createContext<ProjectsContextType | null>(null)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProjectsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProjectApiResponse | null>(null)

  return (
    <ProjectsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
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
