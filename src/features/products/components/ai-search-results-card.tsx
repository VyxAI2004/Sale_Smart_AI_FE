import { ExternalLink, Copy, DollarSign, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {
  ProductSearchResponse,
  ProductWithLink,
  ProductWithMultiLinks,
} from '../types/product-ai.types'

interface AISearchResultsCardProps {
  data: ProductSearchResponse | null
  isLoading?: boolean
  onUseUrl?: (url: string) => void
}

export function AISearchResultsCard({
  data,
  isLoading,
  onUseUrl,
}: AISearchResultsCardProps) {
  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname
      const path = urlObj.pathname
      if (domain.length + path.length <= maxLength) return url
      return `${domain}${path.substring(0, maxLength - domain.length - 3)}...`
    } catch {
      return url.length > maxLength
        ? `${url.substring(0, maxLength - 3)}...`
        : url
    }
  }
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('URL copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const isProductWithLink = (
    product: ProductWithLink | ProductWithMultiLinks
  ): product is ProductWithLink => {
    return 'url' in product
  }

  const isProductWithMultiLinks = (
    product: ProductWithLink | ProductWithMultiLinks
  ): product is ProductWithMultiLinks => {
    return 'urls' in product
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Search Results</CardTitle>
          <CardDescription>Loading search results...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground py-8 text-center'>
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (
    !data ||
    !data.recommended_products ||
    data.recommended_products.length === 0
  ) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Search Results</CardTitle>
        <CardDescription>
          {data.total_found} products found • {data.recommended_products.length}{' '}
          recommended
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* AI Analysis */}
        {data.ai_analysis && (
          <div className='bg-muted rounded-lg p-4'>
            <h4 className='mb-2 font-semibold'>AI Analysis</h4>
            <p className='text-muted-foreground text-sm whitespace-pre-line'>
              {data.ai_analysis}
            </p>
          </div>
        )}

        {/* Products Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[40px] text-xs'>#</TableHead>
              <TableHead className='text-xs'>Product Name</TableHead>
              <TableHead className='text-xs'>Price</TableHead>
              <TableHead className='text-xs'>Link(s)</TableHead>
              <TableHead className='w-[120px] text-right text-xs'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.recommended_products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-muted-foreground py-8 text-center'
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              data.recommended_products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className='text-xs'>
                    <Badge variant='secondary' className='text-xs'>
                      {index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-xs font-medium'>
                    {product.name}
                  </TableCell>
                  <TableCell className='text-xs'>
                    <div className='flex items-center gap-1'>
                      <DollarSign className='text-muted-foreground h-3 w-3' />
                      <span className='font-semibold'>
                        {formatCurrency(product.estimated_price, 'VND')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-xs'>
                    {isProductWithLink(product) ? (
                      <div className='flex items-center gap-1'>
                        <a
                          href={product.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary max-w-[200px] truncate hover:underline'
                          title={product.url}
                        >
                          {truncateUrl(product.url, 35)}
                        </a>
                      </div>
                    ) : isProductWithMultiLinks(product) ? (
                      <div className='space-y-0.5'>
                        {product.urls.shopee && (
                          <div className='flex items-center gap-1'>
                            <Badge
                              variant='outline'
                              className='px-1 py-0 text-[10px]'
                            >
                              S
                            </Badge>
                            <a
                              href={product.urls.shopee}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary max-w-[180px] truncate hover:underline'
                              title={product.urls.shopee}
                            >
                              {truncateUrl(product.urls.shopee, 30)}
                            </a>
                          </div>
                        )}
                        {product.urls.lazada && (
                          <div className='flex items-center gap-1'>
                            <Badge
                              variant='outline'
                              className='px-1 py-0 text-[10px]'
                            >
                              L
                            </Badge>
                            <a
                              href={product.urls.lazada}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary max-w-[180px] truncate hover:underline'
                              title={product.urls.lazada}
                            >
                              {truncateUrl(product.urls.lazada, 30)}
                            </a>
                          </div>
                        )}
                        {product.urls.tiki && (
                          <div className='flex items-center gap-1'>
                            <Badge
                              variant='outline'
                              className='px-1 py-0 text-[10px]'
                            >
                              T
                            </Badge>
                            <a
                              href={product.urls.tiki}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary max-w-[180px] truncate hover:underline'
                              title={product.urls.tiki}
                            >
                              {truncateUrl(product.urls.tiki, 30)}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex flex-wrap items-center justify-end gap-0.5'>
                      {isProductWithLink(product) ? (
                        <>
                          {onUseUrl && (
                            <Button
                              variant='default'
                              size='sm'
                              className='h-7 px-2 text-xs'
                              onClick={() => onUseUrl(product.url)}
                              title='Use this URL'
                            >
                              <ArrowRight className='mr-1 h-3 w-3' />
                              Use
                            </Button>
                          )}
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 w-7 p-0'
                            onClick={() => handleCopyUrl(product.url)}
                            title='Copy URL'
                          >
                            <Copy className='h-3 w-3' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 w-7 p-0'
                            onClick={() => handleOpenUrl(product.url)}
                            title='Open in new tab'
                          >
                            <ExternalLink className='h-3 w-3' />
                          </Button>
                        </>
                      ) : isProductWithMultiLinks(product) ? (
                        <div className='flex flex-wrap items-center gap-0.5'>
                          {product.urls.shopee && (
                            <>
                              {onUseUrl && (
                                <Button
                                  variant='default'
                                  size='sm'
                                  className='h-7 px-1.5 text-[10px]'
                                  onClick={() => onUseUrl(product.urls.shopee!)}
                                  title='Use Shopee URL'
                                >
                                  <ArrowRight className='h-3 w-3' />
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-7 w-7 p-0'
                                onClick={() =>
                                  handleCopyUrl(product.urls.shopee!)
                                }
                                title='Copy Shopee URL'
                              >
                                <Copy className='h-3 w-3' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-7 w-7 p-0'
                                onClick={() =>
                                  handleOpenUrl(product.urls.shopee!)
                                }
                                title='Open Shopee'
                              >
                                <ExternalLink className='h-3 w-3' />
                              </Button>
                            </>
                          )}
                          {product.urls.lazada && (
                            <>
                              {onUseUrl && (
                                <Button
                                  variant='default'
                                  size='sm'
                                  className='h-7 px-1.5 text-[10px]'
                                  onClick={() => onUseUrl(product.urls.lazada!)}
                                  title='Use Lazada URL'
                                >
                                  <ArrowRight className='h-3 w-3' />
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-7 w-7 p-0'
                                onClick={() =>
                                  handleCopyUrl(product.urls.lazada!)
                                }
                                title='Copy Lazada URL'
                              >
                                <Copy className='h-3 w-3' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-7 w-7 p-0'
                                onClick={() =>
                                  handleOpenUrl(product.urls.lazada!)
                                }
                                title='Open Lazada'
                              >
                                <ExternalLink className='h-3 w-3' />
                              </Button>
                            </>
                          )}
                          {product.urls.tiki && (
                            <>
                              {onUseUrl && (
                                <Button
                                  variant='default'
                                  size='sm'
                                  className='h-7 px-1.5 text-[10px]'
                                  onClick={() => onUseUrl(product.urls.tiki!)}
                                  title='Use Tiki URL'
                                >
                                  <ArrowRight className='h-3 w-3' />
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-7 w-7 p-0'
                                onClick={() =>
                                  handleCopyUrl(product.urls.tiki!)
                                }
                                title='Copy Tiki URL'
                              >
                                <Copy className='h-3 w-3' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-7 w-7 p-0'
                                onClick={() =>
                                  handleOpenUrl(product.urls.tiki!)
                                }
                                title='Open Tiki'
                              >
                                <ExternalLink className='h-3 w-3' />
                              </Button>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
