'use client'

import { useState } from 'react'
import type { UUID } from 'crypto'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useInviteToProduct } from '../hooks/use-product-members'

interface ProductInviteModalProps {
  productId: string
  isOpen: boolean
  onClose: () => void
  roleOptions?: Array<{ id: string; name: string }>
}

export function ProductInviteModal({
  productId,
  isOpen,
  onClose,
  roleOptions = [],
}: ProductInviteModalProps) {
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState<string>('')
  const inviteMutation = useInviteToProduct()

  const handleInvite = async () => {
    if (!email) return

    try {
      await inviteMutation.mutateAsync({
        productId,
        payload: {
          user_email: email,
          role_id: roleId as UUID | undefined,
        },
      })

      setEmail('')
      setRoleId('')
      onClose()
    } catch (error) {
      console.error('Failed to invite user:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Invite to Product</DialogTitle>
          <DialogDescription>
            Invite a user to join this product team
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <div className='relative'>
              <Mail className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
              <Input
                id='email'
                type='email'
                placeholder='user@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          {roleOptions.length > 0 && (
            <div className='space-y-2'>
              <Label htmlFor='role'>Role</Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger id='role'>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='flex gap-2 pt-4'>
            <Button variant='outline' onClick={onClose} className='flex-1'>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!email || inviteMutation.isPending}
              className='flex-1'
            >
              {inviteMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Send Invite
            </Button>
          </div>

          {inviteMutation.isError && (
            <div className='rounded-md bg-red-50 p-3 text-sm text-red-700'>
              Failed to send invite. Please try again.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
