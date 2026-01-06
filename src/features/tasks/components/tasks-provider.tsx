import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useDerivedState } from '@/hooks/use-derived-state'
import { type Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRowId: string | null
  setCurrentRowId: (id: string | null) => void
  setCurrentRow: (row: Task | null) => void
  currentRow: Task | null
}

const TasksContext = React.createContext<TasksContextType | null>(null)

/**
 * TasksProvider - Context provider for tasks feature
 * 
 * Uses derived state pattern for currentRow to avoid out-of-sync bugs.
 * Only stores currentRowId, derives currentRow from tasks array.
 */
export function TasksProvider({ 
  children, 
  tasks = [] 
}: { 
  children: React.ReactNode
  tasks?: Task[]
}) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  
  const { selected: currentRow, setSelectedId: setCurrentRowId } = useDerivedState(tasks, 'id')
  const setCurrentRow = (row: Task | null) => setCurrentRowId(row?.id ?? null)

  return (
    <TasksContext value={{ open, setOpen, currentRowId: currentRow?.id ?? null, setCurrentRowId, setCurrentRow, currentRow }}>
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
