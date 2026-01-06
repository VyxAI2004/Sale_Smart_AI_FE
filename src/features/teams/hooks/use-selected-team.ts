import { useState, useEffect } from 'react'
import type { ITeam } from '../types'

const STORAGE_KEY = 'selectedTeamId'

/**
 * Hook to manage selected team
 * Persists selected team to localStorage
 */
export const useSelectedTeam = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setSelectedTeamId(stored)
    setIsLoaded(true)
  }, [])

  const selectTeam = (team: ITeam) => {
    setSelectedTeamId(team.id)
    localStorage.setItem(STORAGE_KEY, team.id)
  }

  const clearTeam = () => {
    setSelectedTeamId(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    selectedTeamId,
    selectTeam,
    clearTeam,
    isLoaded,
  }
}

