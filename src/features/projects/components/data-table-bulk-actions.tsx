import { type Table } from '@tanstack/react-table'
import { type ProjectApiResponse } from '../api/project-api'

interface DataTableBulkActionsProps {
  table: Table<ProjectApiResponse>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows

  if (selectedRows.length === 0) return null

  return (
    <div className='text-muted-foreground text-sm'>
      {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s)
      selected.
    </div>
  )
}
