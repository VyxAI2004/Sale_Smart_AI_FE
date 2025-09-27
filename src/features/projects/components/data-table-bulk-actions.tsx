import { type Table } from '@tanstack/react-table'
import { type Project } from '../data/schema'

interface DataTableBulkActionsProps {
  table: Table<Project>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  
  if (selectedRows.length === 0) return null

  return (
    <div className="text-sm text-muted-foreground">
      {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  )
}