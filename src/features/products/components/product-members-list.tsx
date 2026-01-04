'use client'

import { Trash2, UserCog, Users } from 'lucide-react'
import { getAvatarProps } from '@/utils/avatar-utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useProductMembers,
  useRemoveProductMember,
} from '../hooks/use-product-members'

interface ProductMembersListProps {
  productId: string
  onInviteClick?: () => void
}

export function ProductMembersList({
  productId,
  onInviteClick,
}: ProductMembersListProps) {
  const { data: members, isLoading, error } = useProductMembers(productId)
  const removeMutation = useRemoveProductMember()

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      await removeMutation.mutateAsync({ productId, userId })
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-12 animate-pulse rounded bg-gray-200' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='rounded-md bg-red-50 p-4 text-sm text-red-700'>
            Failed to load team members
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          Team Members ({members?.length || 0})
        </CardTitle>
        <Button size='sm' onClick={onInviteClick}>
          + Invite
        </Button>
      </CardHeader>
      <CardContent>
        {!members || members.length === 0 ? (
          <div className='py-8 text-center text-gray-500'>
            <UserCog className='mx-auto mb-2 h-12 w-12 opacity-50' />
            <p>No team members yet</p>
            <Button
              variant='outline'
              size='sm'
              className='mt-4'
              onClick={onInviteClick}
            >
              Invite someone
            </Button>
          </div>
        ) : (
          <div className='space-y-3'>
            {members.map((member) => {
              const avatarProps = getAvatarProps(member.user_name || 'User')
              return (
                <div
                  key={member.id}
                  className='flex items-center justify-between rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100'
                >
                  <div className='flex min-w-0 flex-1 items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className={avatarProps.colorClass}>
                        {avatarProps.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {member.user_name}
                      </p>
                      <p className='truncate text-xs text-gray-500'>
                        {member.user_email}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    {member.role_name && (
                      <Badge variant='secondary' className='ml-2'>
                        {member.role_name}
                      </Badge>
                    )}
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() =>
                        handleRemoveMember(member.user_id as string)
                      }
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className='h-4 w-4 text-red-500 hover:text-red-700' />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
