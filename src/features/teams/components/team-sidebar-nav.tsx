import { useState, type JSX } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TeamSidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    id: string
    title: string
    icon: JSX.Element
  }[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function TeamSidebarNav({
  className,
  items,
  activeTab,
  onTabChange,
  ...props
}: TeamSidebarNavProps) {
  const [val, setVal] = useState(activeTab)

  const handleSelect = (e: string) => {
    setVal(e)
    onTabChange(e)
  }

  return (
    <>
      <div className='p-1 md:hidden'>
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue
              placeholder={
                items.find((item) => item.id === val)?.title ||
                items[0]?.title
              }
            />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                <div className='flex gap-x-4 px-2 py-1'>
                  <span className='scale-125'>{item.icon}</span>
                  <span className='text-md'>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        orientation='horizontal'
        type='always'
        className='bg-background hidden w-full min-w-40 px-1 py-2 md:block'
      >
        <nav
          className={cn(
            'flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0',
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                activeTab === item.id
                  ? 'bg-muted hover:bg-accent'
                  : 'hover:bg-accent hover:underline',
                'justify-start'
              )}
            >
              <span className='me-2'>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </nav>
      </ScrollArea>
    </>
  )
}
