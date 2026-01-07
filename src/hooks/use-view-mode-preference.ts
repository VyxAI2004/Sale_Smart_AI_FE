import { useLocalStorage } from './use-local-storage'

type ViewMode = 'table' | 'grid'

const VALID_VIEW_MODES: ViewMode[] = ['table', 'grid']

/**
 * Hook for managing view mode preference (table/grid)
 * Persists to localStorage and syncs across tabs
 * @param key - localStorage key (e.g., 'projects-view-mode')
 * @param defaultMode - default view mode
 * @returns [viewMode, setViewMode]
 */
export function useViewModePreference(
  key: string,
  defaultMode: ViewMode = 'table'
): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = useLocalStorage<ViewMode>(
    key,
    defaultMode,
    {
      serialize: (value) => value, // String, no need to JSON.stringify
      deserialize: (value) => {
        // Validate value
        if (VALID_VIEW_MODES.includes(value as ViewMode)) {
          return value as ViewMode
        }
        console.warn(
          `Invalid view mode "${value}" for key "${key}", using default "${defaultMode}"`
        )
        return defaultMode
      },
      syncData: true, // Enable cross-tab sync
    }
  )

  const setViewMode = (newMode: ViewMode) => {
    if (!VALID_VIEW_MODES.includes(newMode)) {
      console.warn(`Invalid view mode "${newMode}", ignoring`)
      return
    }
    setMode(newMode)
  }

  return [mode, setViewMode]
}
