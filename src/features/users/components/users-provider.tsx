import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useDerivedState } from '@/hooks/use-derived-state'
import { type User } from '../data/schema'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRowId: string | null
  setCurrentRowId: (id: string | null) => void
  currentRow: User | null
}

const UsersContext = React.createContext<UsersContextType | null>(null)

/**
 * UsersProvider - Context provider for users page
 * 
 * Uses derived state pattern for currentRow to avoid out-of-sync bugs
 * when data refetches. Only stores currentRowId, derives currentRow from users array.
 */
export function UsersProvider({ 
  children, 
  users = [] 
}: { 
  children: React.ReactNode
  users?: User[]
}) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  
  // ✅ Derived state pattern - store ID only, compute currentRow from users array
  const { selected: currentRow, setSelectedId: setCurrentRowId } = useDerivedState(users, 'id')

  return (
    <UsersContext value={{ open, setOpen, currentRowId: currentRow?.id ?? null, setCurrentRowId, currentRow }}>
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
