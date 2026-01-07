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
        className='!h-[95vh] !w-[90vw] !max-w-[90vw] overflow-y-auto !border-0 !p-0'
        showCloseButton={true}
      >
        <div className='flex h-full w-full'>
          <ProductSearchInterface projectId={projectId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
