import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/hooks/use-translation'

export function LanguageSwitcher() {
  const { currentLanguage, switchLanguage, t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Languages className='h-4 w-4' />
          <span className='sr-only'>{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => switchLanguage('vi')}
          className={currentLanguage === 'vi' ? 'bg-accent' : ''}
        >
          <span className='mr-2'>🇻🇳</span>
          {t('common.vietnamese')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage('en')}
          className={currentLanguage === 'en' ? 'bg-accent' : ''}
        >
          <span className='mr-2'>🇬🇧</span>
          {t('common.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
