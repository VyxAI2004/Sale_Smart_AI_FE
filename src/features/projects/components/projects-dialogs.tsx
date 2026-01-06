import { ProjectArchiveDialog } from './projects-archive-dialog'
import { ProjectDeleteDialog } from './projects-delete-dialog'
import { useProjects } from './projects-provider'

export function ProjectsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProjects()

  return (
    <>
      {currentRow && (
        <>
          <ProjectDeleteDialog
            key={`project-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ProjectArchiveDialog
            key={`project-archive-${currentRow.id}`}
            open={open === 'archive'}
            onOpenChange={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
