/**
 * Export Button Component - Dropdown menu for exporting dashboard data
 */
import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DashboardResponse } from '../types/dashboard.types'
import { exportToExcel, exportToPDF } from '../utils/export-utils'

interface ExportButtonProps {
  dashboard: DashboardResponse | null
  disabled?: boolean
}

export function ExportButton({ dashboard, disabled }: ExportButtonProps) {
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (!dashboard) {
      toast.error(t('dashboard.export.noData'))
      return
    }

    try {
      setIsExporting(true)

      if (format === 'excel') {
        await exportToExcel(dashboard)
        toast.success(t('dashboard.export.excelSuccess'))
      } else {
        await exportToPDF(dashboard)
        toast.success(t('dashboard.export.pdfSuccess'))
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error(
        error instanceof Error ? error.message : t('dashboard.export.error')
      )
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          disabled={disabled || isExporting || !dashboard}
        >
          {isExporting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              {t('dashboard.export.exporting')}
            </>
          ) : (
            <>
              <Download className='mr-2 h-4 w-4' />
              {t('dashboard.export')}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => handleExport('excel')}
          disabled={isExporting || !dashboard}
        >
          <FileSpreadsheet className='mr-2 h-4 w-4' />
          {t('dashboard.export.excel')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={isExporting || !dashboard}
        >
          <FileText className='mr-2 h-4 w-4' />
          {t('dashboard.export.pdf')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
