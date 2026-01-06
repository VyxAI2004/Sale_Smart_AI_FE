import { useState } from 'react'
import { useTeams } from '../hooks'
import type { ITeam } from '../types'

interface TeamSelectorProps {
  selectedTeam: ITeam | null
  onSelectTeam: (team: ITeam) => void
  onCreateTeamClick?: () => void
}

/**
 * TeamSelector Component
 * Dropdown to switch between teams
 */
export const TeamSelector = ({
  selectedTeam,
  onSelectTeam,
  onCreateTeamClick,
}: TeamSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: teams, isLoading } = useTeams()

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100'
      >
        <span className='font-medium'>
          {selectedTeam?.name || 'Select Team'}
        </span>
        <svg
          className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50'>
          {isLoading ? (
            <div className='p-3 text-center text-gray-500'>Loading teams...</div>
          ) : teams && teams.length > 0 ? (
            <>
              <div className='max-h-60 overflow-y-auto'>
                {teams.map((team: ITeam) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      onSelectTeam(team)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedTeam?.id === team.id ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <div className='font-medium'>{team.name}</div>
                    <div className='text-xs text-gray-500'>{team.description}</div>
                  </button>
                ))}
              </div>
              <div className='border-t p-2'>
                <button
                  onClick={() => {
                    onCreateTeamClick?.()
                    setIsOpen(false)
                  }}
                  className='w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 text-sm font-medium'
                >
                  + Create Team
                </button>
              </div>
            </>
          ) : (
            <div className='p-3 text-center text-gray-500'>No teams found</div>
          )}
        </div>
      )}
    </div>
  )
}
