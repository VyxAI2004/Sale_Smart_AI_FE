import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Trash2, Edit, Archive, Play, Pause, Eye } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type ProjectApiResponse } from '../api/project-api'
import { useProjects } from './projects-provider'

type DataTableRowActionsProps = {
  row: Row<ProjectApiResponse>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useProjects()
  const project = row.original

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>{t('common.openMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem asChild>
            <Link to='/projects/$projectId' params={{ projectId: project.id }}>
              {t('projects.viewDetails')}
              <DropdownMenuShortcut>
                <Eye size={16} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(project)
              setOpen('edit')
            }}
          >
            {t('projects.edit')}
            <DropdownMenuShortcut>
              <Edit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {project.status === 'ready' ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(project)
                // TODO: Implement pause functionality
              }}
            >
              {t('projects.pause')}
              <DropdownMenuShortcut>
                <Pause size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ) : project.status === 'paused' ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(project)
                // TODO: Implement resume functionality
              }}
            >
              {t('projects.resume')}
              <DropdownMenuShortcut>
                <Play size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(project)
              setOpen('archive')
            }}
          >
            {t('projects.archive')}
            <DropdownMenuShortcut>
              <Archive size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(project)
              setOpen('delete')
            }}
            className='text-destructive focus:text-destructive'
          >
            {t('projects.delete')}
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
