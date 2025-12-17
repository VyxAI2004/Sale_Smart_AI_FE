import { Link } from '@tanstack/react-router'
import { Plus, FolderPlus } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { useProjects } from './projects-provider'

export function ProjectsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useProjects()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('add')}
      >
        <span>{t('projects.quickAdd')}</span> <FolderPlus size={18} />
      </Button>
      <Button className='space-x-1' asChild>
        <Link to='/projects/add'>
          <span>{t('projects.addProject')}</span> <Plus size={18} />
        </Link>
      </Button>
    </div>
  )
}
