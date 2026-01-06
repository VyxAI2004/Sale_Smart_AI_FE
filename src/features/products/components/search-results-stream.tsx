'use client'

import { useRef, useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ProductSearchResponse } from '../types/product-ai.types'

interface SearchResultsStreamProps {
  searchResults: ProductSearchResponse
  isLoading?: boolean
}

export function SearchResultsStream({
  searchResults,
}: SearchResultsStreamProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [displayedAnalysis, setDisplayedAnalysis] = useState('')

  // Typing effect for AI analysis
  useEffect(() => {
    if (!searchResults.ai_analysis) return

    let index = 0
    const text = searchResults.ai_analysis
    setDisplayedAnalysis('')

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedAnalysis(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [searchResults.ai_analysis])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedAnalysis])

  return (
    <div className='space-y-4'>
      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Phân tích AI</CardTitle>
          <CardDescription>{searchResults.project_info.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-sm leading-relaxed whitespace-pre-wrap text-foreground'>
            {displayedAnalysis}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Products */}
      {searchResults.recommended_products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              Sản phẩm được đề xuất ({searchResults.recommended_products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {searchResults.recommended_products.map((product, idx) => (
                <div
                  key={idx}
                  className='rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex-1'>
                      <h4 className='font-medium text-sm text-foreground line-clamp-2'>
                        {product.name}
                      </h4>
                      <div className='mt-2 text-xs text-muted-foreground space-y-1'>
                        <div>
                          💰 Giá: {product.estimated_price?.toLocaleString('vi-VN')} VND
                        </div>
                        {'url' in product && product.url && (
                          <a
                            href={product.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline block truncate'
                          >
                            Xem trên sàn →
                          </a>
                        )}
                        {'urls' in product && (
                          <div className='space-y-1'>
                            {product.urls.shopee && (
                              <a
                                href={product.urls.shopee}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline block truncate'
                              >
                                🛒 Shopee
                              </a>
                            )}
                            {product.urls.lazada && (
                              <a
                                href={product.urls.lazada}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline block truncate'
                              >
                                🛒 Lazada
                              </a>
                            )}
                            {product.urls.tiki && (
                              <a
                                href={product.urls.tiki}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline block truncate'
                              >
                                🛒 Tiki
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Package className='h-5 w-5 text-green-600 flex-shrink-0 mt-1' />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Products */}
      {searchResults.all_products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>
              Tất cả sản phẩm tìm được ({searchResults.all_products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2 max-h-72 overflow-y-auto'>
              {searchResults.all_products.map((product, idx) => (
                <div
                  key={idx}
                  className='rounded p-2 border border-border bg-muted/30 text-xs'
                >
                  <div className='font-medium text-foreground line-clamp-1'>
                    {product.name}
                  </div>
                  <div className='text-muted-foreground mt-1'>
                    ${product.estimated_price?.toLocaleString('vi-VN')} VND
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grounding Info */}
      {searchResults.grounding_metadata && (
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            <div className='text-xs space-y-1'>
              {searchResults.grounding_metadata.step1_analysis && (
                <div>
                  📊 Analysis grounding supports:{' '}
                  {searchResults.grounding_metadata.step1_analysis.grounding_supports}
                </div>
              )}
              {searchResults.grounding_metadata.step2_links && (
                <div>
                  🔗 Links grounding supports:{' '}
                  {searchResults.grounding_metadata.step2_links.grounding_supports}
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {searchResults.note && (
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='text-xs'>{searchResults.note}</AlertDescription>
        </Alert>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
