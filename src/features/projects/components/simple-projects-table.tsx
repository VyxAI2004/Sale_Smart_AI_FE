import { type NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type ProjectApiResponse } from '../api/project-api'

type SimpleProjectsTableProps = {
  data: ProjectApiResponse[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function SimpleProjectsTable({ data }: SimpleProjectsTableProps) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data.map((project) => (
              <TableRow key={project.id}>
                <TableCell className='font-medium'>{project.name}</TableCell>
                <TableCell>{project.description || '-'}</TableCell>
                <TableCell>{project.target_product_name || '-'}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{project.status}</Badge>
                </TableCell>
                <TableCell>
                  {project.target_budget_range
                    ? `${project.target_budget_range} ${project.currency}`
                    : '-'}
                </TableCell>
                <TableCell>
                  {project.created_at
                    ? new Date(project.created_at).toLocaleDateString()
                    : '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center'>
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
