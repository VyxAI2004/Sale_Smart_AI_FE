import type { ReactNode } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Task } from '../types/task.types'

interface TaskDetailDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  if (!task) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getTaskTypeLabel = (taskType?: string | null) => {
    const labels: Record<string, string> = {
      marketing_research: 'Nghiên cứu Marketing',
      competitive_analysis: 'Phân tích Cạnh tranh',
      content_strategy: 'Chiến lược Nội dung',
      pricing_strategy: 'Chiến lược Giá',
      market_positioning: 'Định vị Thị trường',
    }
    return labels[taskType || ''] || taskType || 'Nhiệm vụ'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xử lý',
      in_progress: 'Đang thực hiện',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    }
    return labels[status] || status
  }

  const formatDescription = (text: string) => {
    if (!text) return null

    // Process line by line to identify headings and structure
    const lines = text.split('\n')
    const processedLines: string[] = []
    // Helper function to check if a line is a heading pattern
    // Pattern: starts with "- ", contains ":", and is relatively short (heading-like)
    const isHeadingPattern = (line: string): boolean => {
      const trimmed = line.trim()
      return (
        trimmed.startsWith('-') &&
        trimmed.includes(':') &&
        trimmed.length < 100 &&
        trimmed.indexOf(':') < 50 // ":" should appear early in the line
      )
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // If it's a heading pattern, ensure it's on its own line
      if (isHeadingPattern(trimmed)) {
        // Add empty line before heading if previous line exists and isn't empty
        if (
          processedLines.length > 0 &&
          processedLines[processedLines.length - 1].trim() !== ''
        ) {
          processedLines.push('')
        }
        processedLines.push(trimmed)
        // Add empty line after heading if next line exists and isn't empty
        if (i < lines.length - 1 && lines[i + 1]?.trim() !== '') {
          processedLines.push('')
        }
      } else if (trimmed === '') {
        // Keep empty lines
        processedLines.push('')
      } else {
        // Regular line - merge with previous if it's not a heading context
        const prevLine = processedLines[processedLines.length - 1]
        if (
          prevLine &&
          prevLine.trim() !== '' &&
          !isHeadingPattern(prevLine.trim())
        ) {
          // Merge with previous line
          processedLines[processedLines.length - 1] += ' ' + trimmed
        } else {
          processedLines.push(trimmed)
        }
      }
    }

    // Split by double newlines to get paragraphs
    const normalized = processedLines.join('\n')
    const paragraphs = normalized.split(/\n\n+/).filter((p) => p.trim())

    return paragraphs.map((paragraph, idx) => {
      const trimmed = paragraph.trim()

      // Check if it's a heading (starts with ##)
      if (trimmed.startsWith('##')) {
        const headingText = trimmed.replace(/^##+\s*/, '')
        return (
          <h5
            key={idx}
            className='text-foreground mt-4 mb-2 text-xs font-semibold first:mt-0'
          >
            {formatInlineText(headingText)}
          </h5>
        )
      }

      // Check if it's a heading-like pattern (starts with - and contains :)
      // Examples: "- Kết quả mong đợi:", "- Mục đích:", etc.
      // Pattern: starts with "- ", has text, then ":", optionally followed by short text
      if (/^-\s*[^:]+:\s*/.test(trimmed) && trimmed.length < 100) {
        // Extract heading text (everything before ":")
        const match = trimmed.match(/^-\s*([^:]+):/)
        const headingText = match
          ? match[1].trim()
          : trimmed.replace(/^-\s*/, '').replace(/:\s*.*$/, '')
        return (
          <h5
            key={idx}
            className='text-foreground mt-4 mb-2 text-xs font-semibold first:mt-0'
          >
            {formatInlineText(headingText)}
          </h5>
        )
      }

      // Check if it's a bullet list (starts with - or numbered list)
      if (trimmed.startsWith('-') || /^\d+\.\s/.test(trimmed)) {
        // Split by lines that start with - or number
        const lines = trimmed.split('\n').filter((line) => line.trim())
        const items: string[] = []
        let currentItem = ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          // Check if this line starts a new list item
          // But exclude heading-like patterns (contains : and is short)
          const isHeading =
            trimmedLine.startsWith('-') &&
            trimmedLine.includes(':') &&
            trimmedLine.length < 100 &&
            trimmedLine.indexOf(':') < 50
          if (
            (trimmedLine.startsWith('-') || /^\d+\.\s/.test(trimmedLine)) &&
            !isHeading
          ) {
            // Save previous item if exists
            if (currentItem) {
              items.push(currentItem)
            }
            // Start new item
            currentItem = trimmedLine.replace(/^[-•]\s*|\d+\.\s*/, '').trim()
          } else if (currentItem) {
            // Continue current item (multi-line list item)
            currentItem += ' ' + trimmedLine
          } else {
            // Standalone line, treat as new item
            items.push(trimmedLine)
          }
        }
        // Add last item
        if (currentItem) {
          items.push(currentItem)
        }

        if (items.length === 0) return null

        return (
          <ul key={idx} className='mb-3 ml-4 list-disc space-y-1.5'>
            {items.map((item, itemIdx) => (
              <li
                key={itemIdx}
                className='text-muted-foreground text-xs leading-relaxed'
              >
                {formatInlineText(item)}
              </li>
            ))}
          </ul>
        )
      }

      // Check if paragraph contains heading-like patterns in the middle
      // Split by lines and check each line
      const lines = trimmed.split('\n').filter((line) => line.trim())
      if (lines.length > 1) {
        const result: ReactNode[] = []
        let currentParagraph = ''

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          // Check if it's a heading-like pattern
          const isHeading =
            line.startsWith('-') &&
            line.includes(':') &&
            line.length < 100 &&
            line.indexOf(':') < 50
          if (isHeading) {
            // Save previous paragraph if exists
            if (currentParagraph) {
              result.push(
                <p
                  key={`p-${i}`}
                  className='text-muted-foreground mb-3 text-xs leading-relaxed'
                >
                  {formatInlineText(currentParagraph)}
                </p>
              )
              currentParagraph = ''
            }
            // Add heading
            const headingText = line.replace(/^-\s*/, '').replace(/:\s*$/, '')
            result.push(
              <h5
                key={`h-${i}`}
                className='text-foreground mt-4 mb-2 text-xs font-semibold first:mt-0'
              >
                {formatInlineText(headingText)}
              </h5>
            )
          } else {
            // Add to current paragraph
            if (currentParagraph) {
              currentParagraph += ' ' + line
            } else {
              currentParagraph = line
            }
          }
        }
        // Add last paragraph if exists
        if (currentParagraph) {
          result.push(
            <p
              key='p-last'
              className='text-muted-foreground mb-3 text-xs leading-relaxed last:mb-0'
            >
              {formatInlineText(currentParagraph)}
            </p>
          )
        }

        if (result.length > 0) {
          return <div key={idx}>{result}</div>
        }
      }

      // Regular paragraph
      return (
        <p
          key={idx}
          className='text-muted-foreground mb-3 text-xs leading-relaxed last:mb-0'
        >
          {formatInlineText(trimmed)}
        </p>
      )
    })
  }

  const formatInlineText = (text: string) => {
    // Split by bold markers (**text**)
    const parts: (string | ReactNode)[] = []
    const regex = /\*\*([^*]+)\*\*/g
    let lastIndex = 0
    let match
    let key = 0

    while ((match = regex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      // Add bold text
      parts.push(
        <strong key={key++} className='text-foreground font-semibold'>
          {match[1]}
        </strong>
      )
      lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {task.task_order && (
              <div className='bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                {task.task_order}
              </div>
            )}
            <span className='text-sm'>{task.name}</span>
          </DialogTitle>
          <DialogDescription className='text-xs'>
            Chi tiết nhiệm vụ
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Description */}
          {task.description && (
            <div className='bg-muted/30 rounded-lg border p-4'>
              <h4 className='text-foreground mb-3 text-xs font-semibold'>
                Mô tả
              </h4>
              <div className='space-y-2'>
                {formatDescription(task.description)}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className='flex flex-wrap items-center gap-2'>
            <Badge
              variant={getPriorityColor(task.priority) as any}
              className='text-xs'
            >
              {task.priority === 'high'
                ? 'Cao'
                : task.priority === 'medium'
                  ? 'Trung bình'
                  : 'Thấp'}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {getTaskTypeLabel(task.task_type)}
            </Badge>
            <Badge variant='secondary' className='text-xs'>
              {getStatusLabel(task.status)}
            </Badge>
          </div>

          {/* Metadata */}
          <div className='grid grid-cols-2 gap-4'>
            {task.estimated_hours && (
              <div className='flex items-center gap-2'>
                <Clock className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-xs'>Ước tính</p>
                  <p className='text-xs font-medium'>
                    ~{task.estimated_hours}h
                  </p>
                </div>
              </div>
            )}
            {task.actual_hours && (
              <div className='flex items-center gap-2'>
                <Clock className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-xs'>Thực tế</p>
                  <p className='text-xs font-medium'>{task.actual_hours}h</p>
                </div>
              </div>
            )}
            {task.due_date && (
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-xs'>Hạn chót</p>
                  <p className='text-xs font-medium'>
                    {new Date(task.due_date).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
            {task.completed_at && (
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-xs'>Hoàn thành</p>
                  <p className='text-xs font-medium'>
                    {new Date(task.completed_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className='border-t pt-4'>
            <div className='grid grid-cols-2 gap-4 text-xs'>
              <div>
                <p className='text-muted-foreground'>Ngày tạo</p>
                <p className='mt-1'>
                  {new Date(task.created_at).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Cập nhật lần cuối</p>
                <p className='mt-1'>
                  {new Date(task.updated_at).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
