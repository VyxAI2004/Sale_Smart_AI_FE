import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statuses } from '../data/data'
import { type Project } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const projectsColumns: ColumnDef<Project>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('sticky md:table-cell start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project Name' />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col ps-3">
        <LongText className='max-w-48 font-medium'>{row.getValue('name')}</LongText>
        <LongText className='max-w-48 text-xs text-muted-foreground'>
          {row.original.target_product_name}
        </LongText>
      </div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) return null

      return (
        <Badge variant="outline" className={cn(status.color, status.bgColor)}>
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: true,
  },
  {
    accessorKey: 'target_product_category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32'>
        {row.getValue('target_product_category') || '-'}
      </LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'target_budget_range',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Budget' />
    ),
    cell: ({ row }) => {
      const budget = row.getValue('target_budget_range') as number
      const currency = row.original.currency
      
      if (!budget) return '-'
      
      return (
        <span className="font-medium">
          {new Intl.NumberFormat('vi-VN').format(budget)} {currency}
        </span>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'pipeline_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pipeline' />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue('pipeline_type')}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'crawl_schedule',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Schedule' />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {row.getValue('crawl_schedule') || '-'}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Deadline' />
    ),
    cell: ({ row }) => {
      const deadline = row.getValue('deadline') as Date
      if (!deadline) return '-'
      
      return (
        <span className="text-sm">
          {deadline.toLocaleDateString('vi-VN')}
        </span>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as Date
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString('vi-VN')}
        </span>
      )
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'sticky end-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    },
  },
]