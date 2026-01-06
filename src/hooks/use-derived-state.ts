import { useState, useMemo } from 'react'

/**
 * Data Sync Pattern (Derived State) Hook
 * 
 * Replaces snapshot state with ID-based state to avoid out-of-sync issues.
 * Automatically keeps selected item in sync with the source array.
 * 
 * @example
 * // Instead of:
 * // const [selectedUser, setSelectedUser] = useState<User | null>(null)
 * // ❌ selectedUser gets stale after data refetch
 * 
 * // Use derived state:
 * const { selectedId, setSelectedId, selected } = useDerivedState(users, 'id')
 * // ✅ selected always syncs with users array
 * 
 * @template T Type of items in array, must have an 'id' property
 * @param items Source array of items
 * @param idKey Name of the id property (default: 'id')
 * @returns Object with selectedId state, setter, and computed selected item
 */
export function useDerivedState<T extends Record<string, any>>(
  items: T[] = [],
  idKey: keyof T = 'id' as keyof T,
) {
  const [selectedId, setSelectedId] = useState<string | number | null>(null)

  // Derived state - computed from array, always in sync
  const selected = useMemo(() => {
    if (!selectedId || !items.length) return null
    return items.find(item => String(item[idKey]) === String(selectedId)) ?? null
  }, [selectedId, items, idKey])

  const clearSelected = () => setSelectedId(null)

  return {
    selectedId,
    setSelectedId,
    selected,
    clearSelected,
    isSelected: (id: string | number) => selectedId === id,
  }
}

/**
 * Multi-select variant of useDerivedState
 * 
 * @example
 * const { selectedIds, toggleSelect, clearAll } = useMultiDerivedState(users)
 * 
 * @template T Type of items in array
 * @param items Source array of items
 * @param idKey Name of the id property
 * @returns Object with selectedIds, toggle function, and selected items array
 */
export function useMultiDerivedState<T extends Record<string, any>>(
  items: T[] = [],
  idKey: keyof T = 'id' as keyof T,
) {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])

  // Derived state - get selected items from array
  const selected = useMemo(() => {
    if (!selectedIds.length || !items.length) return []
    return items.filter(item => selectedIds.includes(String(item[idKey])))
  }, [selectedIds, items, idKey])

  const toggleSelect = (id: string | number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(prevId => prevId !== id)
        : [...prev, id]
    )
  }

  const isSelected = (id: string | number) => selectedIds.includes(id)
  const clearAll = () => setSelectedIds([])
  const selectAll = () => {
    setSelectedIds(items.map(item => String(item[idKey])))
  }

  return {
    selectedIds,
    setSelectedIds,
    selected,
    toggleSelect,
    isSelected,
    clearAll,
    selectAll,
  }
}
