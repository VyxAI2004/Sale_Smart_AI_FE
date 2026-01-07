import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ProductSearchInterface } from './product-search-interface'

interface ProductSearchDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductSearchDialog({
  projectId,
  open,
  onOpenChange,
}: ProductSearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className='!max-w-[90vw] !w-[90vw] !h-[95vh] !p-0 !border-0 overflow-y-auto'
        showCloseButton={true}
      >
        <div className='w-full h-full flex'>
          <ProductSearchInterface projectId={projectId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

