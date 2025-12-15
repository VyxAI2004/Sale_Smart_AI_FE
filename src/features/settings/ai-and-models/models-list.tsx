import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Power, PowerOff, Trash2 } from 'lucide-react'
import type { AiModel } from '@/hooks/use-ai-models'
import OpenAIIcon from '@/components/icons/openai'
import GeminiIcon from '@/components/icons/gemini'
import ClaudeIcon from '@/components/icons/claude'
import GrokIcon from '@/components/icons/grok'
import DeepseekIcon from '@/components/icons/deepseek'

type ModelsListProps = {
  models?: AiModel[]
  onActivate: (id: string) => void
  onDeactivate: (id: string) => void
  onDelete: (id: string) => void
}

export function ModelsList({ models = [], onActivate, onDeactivate, onDelete }: ModelsListProps) {
  return (
    <div className='mt-3'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((m: AiModel) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  {m.provider === 'openai' && <OpenAIIcon width={18} height={18} />}
                  {m.provider === 'gemini' && <GeminiIcon width={18} height={18} />}
                  {m.provider === 'claude' && <ClaudeIcon width={18} height={18} />}
                  {m.provider === 'grok' && <GrokIcon width={18} height={18} />}
                  {m.provider === 'deepseek' && <DeepseekIcon width={18} height={18} />}
                  <span>{m.provider}</span>
                </div>
              </TableCell>
              <TableCell>{m.model_type}</TableCell>
              <TableCell>{m.is_active ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {m.is_active ? (
                      <DropdownMenuItem onClick={() => onDeactivate(m.id)}>
                        <PowerOff className='mr-2 h-4 w-4' />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onActivate(m.id)}>
                        <Power className='mr-2 h-4 w-4' />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(m.id)} className='text-destructive'>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
