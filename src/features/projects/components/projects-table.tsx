import { useState, useEffect } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type ProjectApiResponse } from '../api/project-api'
import { PRODUCT_CATEGORIES } from '../constants/project.constants'
import { statuses, pipelineTypes, crawlSchedules } from '../data/data'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { projectsColumns as columns } from './projects-columns'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className: string
  }
}

type DataTableProps = {
  data: ProjectApiResponse[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function ProjectsTable({ data, search, navigate }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Synced with URL states (keys/defaults mirror projects route search schema)
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      // name per-column text filter
      { columnId: 'name', searchKey: 'name', type: 'string' },
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'pipeline_type', searchKey: 'pipeline_type', type: 'array' },
      {
        columnId: 'target_product_category',
        searchKey: 'category',
        type: 'array',
      },
      { columnId: 'crawl_schedule', searchKey: 'schedule', type: 'array' },
    ],
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Ensure page is in range after data changes
  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter projects...'
        searchKey='name'
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: statuses.map((status) => ({
              label: status.label,
              value: status.value,
            })),
          },
          {
            columnId: 'pipeline_type',
            title: 'Pipeline',
            options: pipelineTypes.map((type) => ({
              label: type.label,
              value: type.value,
            })),
          },
          {
            columnId: 'target_product_category',
            title: 'Category',
            options: PRODUCT_CATEGORIES.map((category) => ({
              label: category,
              value: category,
            })),
          },
          {
            columnId: 'crawl_schedule',
            title: 'Schedule',
            options: crawlSchedules.map((schedule) => ({
              label: schedule.label,
              value: schedule.value,
            })),
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(header.column.columnDef.meta?.className)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.columnDef.meta?.className)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <DataTableBulkActions table={table} />
    </div>
  )
}
