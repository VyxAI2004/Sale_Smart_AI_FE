import { useState } from 'react'
import { Upload, Link, X, ImageIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ProductImagesCardProps {
  images?: string[]
  onImagesChange?: (images: string[]) => void
}

export function ProductImagesCard({ images = [], onImagesChange }: ProductImagesCardProps) {
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const addImageFromUrl = () => {
    if (urlInput.trim() && !images.includes(urlInput.trim())) {
      const newImages = [...images, urlInput.trim()]
      onImagesChange?.(newImages)
      setUrlInput('')
      setIsUrlDialogOpen(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange?.(newImages)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    // Handle file drop logic here
    // TODO: Implement file upload functionality
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Product Images</CardTitle>
        <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              <Link className="mr-1 h-3 w-3" />
              Add media from URL
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Image from URL</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addImageFromUrl()
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUrlDialogOpen(false)
                    setUrlInput('')
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addImageFromUrl} disabled={!urlInput.trim()}>
                  Add Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {images.length > 0 && (
          <div className="mb-4 space-y-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate" title={image}>
                    {image}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full border border-muted-foreground/25 p-4">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Drop your images here
              </p>
              <p className="text-xs text-muted-foreground">
                PNG or JPG (max. 5MB)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                // Handle file selection
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.multiple = true
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files
                  if (files) {
                    // TODO: Implement file upload logic
                    // Handle file upload functionality here
                  }
                }
                input.click()
              }}
            >
              <Upload className="mr-2 h-3 w-3" />
              Select images
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}