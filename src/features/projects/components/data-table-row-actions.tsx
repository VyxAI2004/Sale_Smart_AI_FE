import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, Edit, Archive, Play, Pause, Eye } from 'lucide-react'
import { Link } from '@tanstack/react-router'
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
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem asChild>
            <Link to="/projects/$projectId" params={{ projectId: project.id }}>
              View Details
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
            Edit
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
              Pause
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
              Resume
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
            Archive
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
            className="text-destructive focus:text-destructive"
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}