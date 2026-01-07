import { useState, useCallback, useEffect } from 'react'

interface UseLocalStorageOptions<T> {
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
  syncData?: boolean // Sync across browser tabs
}

const defaultSerialize = <T>(value: T): string => JSON.stringify(value)
const defaultDeserialize = <T>(value: string): T => JSON.parse(value)

/**
 * Custom hook for managing state persisted to localStorage
 * @param key - localStorage key
 * @param initialValue - default value if not in localStorage
 * @param options - configuration options
 * @returns [value, setValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((val: T) => T)) => void] {
  const {
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    syncData = true,
  } = options

  // Initialize state from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }
      return deserialize(item)
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serialize(valueToStore))
          // Dispatch storage event for cross-tab sync
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: serialize(valueToStore),
              url: window.location.href,
            })
          )
        }
      } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error)
      }
    },
    [key, serialize, storedValue]
  )

  // Sync state across browser tabs
  useEffect(() => {
    if (!syncData || typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserialize, syncData])

  return [storedValue, setValue]
}
