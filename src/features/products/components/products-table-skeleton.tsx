import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ProductsTableSkeleton() {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Trust Score</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className='h-4 w-[200px]' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-[80px]' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-[100px]' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-[60px]' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-[60px]' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-[60px]' />
              </TableCell>
              <TableCell className='text-right'>
                <Skeleton className='ml-auto h-8 w-8' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
