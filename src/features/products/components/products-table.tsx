import { useNavigate, Link } from '@tanstack/react-router'
import {
  MoreHorizontal,
  ExternalLink,
  Star,
  TrendingUp,
  Download,
  Eye,
  Edit,
  Trash2,
  Brain,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteProduct } from '../hooks/use-products'
import type { Product } from '../types/product.types'

interface ProductsTableProps {
  products: Product[]
  projectId: string
  onView?: (product: Product) => void
  onEdit?: (product: Product) => void
}

export function ProductsTable({ products, onEdit }: ProductsTableProps) {
  const deleteProduct = useDeleteProduct()
  const navigate = useNavigate()

  const handleDelete = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      await deleteProduct.mutateAsync({
        id: product.id,
        projectId: product.project_id,
      })
    }
  }

  const getPlatformBadgeVariant = (platform: string | null | undefined) => {
    if (!platform) return 'default'
    switch (platform.toLowerCase()) {
      case 'shopee':
        return 'default'
      case 'lazada':
        return 'secondary'
      case 'tiki':
        return 'outline'
      default:
        return 'default'
    }
  }

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
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className='text-muted-foreground text-center'
              >
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className='font-medium'>
                  <div className='flex flex-col'>
                    <span>{product.name}</span>
                    {product.brand && (
                      <span className='text-muted-foreground text-xs'>
                        {product.brand}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={getPlatformBadgeVariant(product.platform)}>
                    {product.platform || 'Unknown'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-semibold'>
                      {formatCurrency(
                        product.current_price || 0,
                        product.currency || 'VND'
                      )}
                    </span>
                    {product.original_price &&
                      product.original_price > (product.current_price || 0) && (
                        <span className='text-muted-foreground text-xs line-through'>
                          {formatCurrency(
                            product.original_price,
                            product.currency || 'VND'
                          )}
                        </span>
                      )}
                  </div>
                </TableCell>

                <TableCell>
                  {product.average_rating ? (
                    <div className='flex items-center gap-1'>
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      <span>{product.average_rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>

                <TableCell>{product.review_count || 0}</TableCell>

                <TableCell>
                  {typeof product.trust_score === 'number' ? (
                    <div className='flex items-center gap-1'>
                      <TrendingUp className='h-4 w-4' />
                      <span className='font-semibold'>
                        {product.trust_score.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>

                <TableCell className='text-right'>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end' className='w-[180px]'>
                      <DropdownMenuItem asChild>
                        <Link
                          to='/products/$productId'
                          params={{ productId: product.id }}
                        >
                          View Details
                          <DropdownMenuShortcut>
                            <Eye size={16} />
                          </DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          Edit
                          <DropdownMenuShortcut>
                            <Edit size={16} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() =>
                          product.url && window.open(product.url, '_blank')
                        }
                        disabled={!product.url}
                      >
                        Open on {product.platform || 'platform'}
                        <DropdownMenuShortcut>
                          <ExternalLink size={16} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          navigate({
                            to: '/products/$productId/crawl',
                            params: { productId: product.id },
                          })
                        }
                      >
                        Crawl Data
                        <DropdownMenuShortcut>
                          <Download size={16} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          navigate({
                            to: '/products/$productId/analyze',
                            params: { productId: product.id },
                          })
                        }
                      >
                        Analyze Reviews
                        <DropdownMenuShortcut>
                          <Brain size={16} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => handleDelete(product)}
                        className='text-destructive focus:text-destructive'
                      >
                        Delete
                        <DropdownMenuShortcut>
                          <Trash2 size={16} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
