import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type ProjectApiResponse } from '../api/project-api'
import { DataTableRowActions } from './data-table-row-actions'
import i18n from '@/lib/i18n'

const t = (key: string) => i18n.t(key) || key

export const projectsColumns: ColumnDef<ProjectApiResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t('common.selectAll')}
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('sticky md:table-cell start-0 z-10 rounded-tl-[inherit] bg-background'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t('common.selectRow')}
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.name')} />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.description')} />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue('description') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'target_product_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.product')} />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue('target_product_name') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.status')} />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant="outline" className="capitalize">
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'target_budget_range',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.budget')} />
    ),
    cell: ({ row }) => {
      const budget = row.getValue('target_budget_range') as string
      const currency = row.original.currency
      return (
        <div>
          {budget ? `${budget} ${currency || ''}` : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'pipeline_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.pipelineType')} />
    ),
    cell: ({ row }) => {
      const type = row.getValue('pipeline_type') as string
      return (
        <Badge variant="secondary" className="capitalize">
          {type || '-'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'assigned_to',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.assignedTo')} />
    ),
    cell: ({ row }) => {
      const assignedTo = row.original.assigned_to
      return (
        <div>
          {assignedTo ? `${t('projects.user')} ${assignedTo}` : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.deadline')} />
    ),
    cell: ({ row }) => {
      const deadline = row.getValue('deadline') as string
      return (
        <div>
          {deadline ? new Date(deadline).toLocaleDateString() : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'crawl_schedule',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.schedule')} />
    ),
    cell: ({ row }) => {
      const schedule = row.getValue('crawl_schedule') as string
      return (
        <div className="capitalize">
          {schedule || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'next_crawl_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.nextCrawl')} />
    ),
    cell: ({ row }) => {
      const nextCrawl = row.getValue('next_crawl_at') as string
      return (
        <div>
          {nextCrawl ? new Date(nextCrawl).toLocaleDateString() : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.updated')} />
    ),
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as string
      return (
        <div>
          {date ? new Date(date).toLocaleDateString() : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('projects.createdAt')} />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return (
        <div>
          {date ? new Date(date).toLocaleDateString() : '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: t('projects.actions'),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('sticky md:table-cell end-0 z-10 rounded-tr-[inherit] bg-background'),
    },
  },
]